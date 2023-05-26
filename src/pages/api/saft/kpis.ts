import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const {company_id, year} = req.query
    const {count} = postgres.fn
    // Calculate Net and Gross Sales
    try {
        const invoices = await postgres.selectFrom('invoice')
            .select(['tax_payable', 'net_total', 'gross_total'])
            .where('company_id', '=', Number(company_id))
            .where('fiscal_year', '=', Number(year))
            .execute();

        const fiscalYear = await postgres.selectFrom('fiscal_year')
            .select(['number_of_entries', 'fiscal_year_id'])
            .where('company_id', '=', Number(company_id))
            .where('fiscal_year', '=', Number(year))
            .executeTakeFirstOrThrow()

        const invoicesByCustomer = await postgres.selectFrom("invoice")
            .select([count('invoice_id').as('invoices_count'), 'saft_customer_id'])
            .where("fiscal_year", '=', Number(year))
            .groupBy(['saft_customer_id'])
            .execute()

        const customerFiscalYear = invoicesByCustomer.map((c) => ({
            ...c,
            fiscal_year_id: fiscalYear.fiscal_year_id
        }))

        const net = invoices.reduce((sum, current) => sum + Number(current.net_total), 0);
        const gross = invoices.reduce((sum, current) => sum + Number(current.gross_total), 0);
        const aov = net / fiscalYear.number_of_entries

        console.log(net)
        console.log(gross)
        console.log(company_id)

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
                .executeTakeFirstOrThrow()
        ])
    } catch (e) {
        console.log(e)
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
}