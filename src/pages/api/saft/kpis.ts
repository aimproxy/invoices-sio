import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const {company_id, year} = req.query
    const {count} = postgres.fn

    try {
        const invoices = await postgres.selectFrom('invoice')
            .select(['tax_payable', 'net_total', 'gross_total'])
            .where('company_id', '=', Number(company_id))
            .where('fiscal_year', '=', Number(year))
            .execute();

        const fiscalYear = await postgres.selectFrom('fiscal_year')
            .select(['number_of_entries'])
            .where('company_id', '=', Number(company_id))
            .where('fiscal_year', '=', Number(year))
            .executeTakeFirstOrThrow()

        const invoicesByCustomer = await postgres.selectFrom("invoice")
            .select([count('invoice_id').as('invoices_count'), 'saft_customer_id'])
            .where("fiscal_year", '=', Number(year))
            .groupBy(['saft_customer_id'])
            .execute()

        const mostProfitableProductsQuery = await sql<{ product_code: number, amount_spend: number }[]>`
            SELECT product_code, MAX(quantity * unit_price) AS amount_spent
            FROM invoice_line
            WHERE fiscal_year = ${Number(year)}
            GROUP BY product_code
            ORDER BY amount_spent DESC
            LIMIT 5`.execute(postgres)

        const mostProfitableProducts = mostProfitableProductsQuery.rows.map(p => ({
            ...p,
            company_id: company_id,
            fiscal_year: year
        }))

        const customerFiscalYear = invoicesByCustomer.map((c) => ({
            ...c,
            fiscal_year: year
        }))

        const net = invoices.reduce((sum, current) => sum + Number(current.net_total), 0);
        const gross = invoices.reduce((sum, current) => sum + Number(current.gross_total), 0);
        const aov = net / fiscalYear.number_of_entries

        await Promise.all([
            postgres.updateTable('fiscal_year')
                .set({
                    net_sales: net,
                    gross_sales: gross,
                    aov
                })
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow(),

            postgres.insertInto('customer_fiscal_year')
                .values(customerFiscalYear)
                .executeTakeFirstOrThrow(),

            postgres.insertInto('product_fiscal_year')
                .values(mostProfitableProducts)
                .onConflict(oc => oc
                    .columns(['product_code', 'fiscal_year', 'company_id'])
                    .doUpdateSet(eb => ({
                        product_code: eb.ref('excluded.product_code'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        company_id: eb.ref('excluded.company_id')
                    }))
                )
                .executeTakeFirstOrThrow()
        ])
    } catch (e) {
        console.log(e)
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
}