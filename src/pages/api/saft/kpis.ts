import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const {company_id, year} = req.query
    const {count, sum} = postgres.fn

    try {
        const [
            invoices,
            fiscal_year,
            invoicesByCustomer,
            revenueByMonth,
            revenueByProducts,
            salesByCity
        ] = await Promise.all([
            postgres.selectFrom('invoice')
                .select(['net_total', 'gross_total'])
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .execute(),

            postgres.selectFrom('fiscal_year')
                .select(['number_of_entries'])
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow(),

            postgres.selectFrom("invoice")
                .select([
                    count('invoice_id').as('invoices_count'),
                    'saft_customer_id',
                    'fiscal_year'
                ])
                .where('fiscal_year', '=', Number(year))
                .groupBy(['saft_customer_id', 'fiscal_year'])
                .execute(),

            sql<{
                invoices_count: number,
                month: number,
                total_net_amount: number,
                fiscal_year: number,
                company_id: number
            }>`
                SELECT COUNT(invoice_id)                AS invoices_count,
                       EXTRACT(MONTH FROM invoice_date) AS month,
                       SUM(net_total)                   AS net_total,
                       SUM(gross_total)                 AS gross_total,
                       fiscal_year,
                       company_id
                FROM invoice
                WHERE fiscal_year = ${Number(year)}
                GROUP BY month, fiscal_year, company_id`.execute(postgres),

            sql<{ product_code: number, amount_spend: number }[]>`
                SELECT product_code, MAX(quantity * unit_price) AS amount_spent
                FROM invoice_line
                WHERE fiscal_year = ${Number(year)}
                GROUP BY product_code
                ORDER BY amount_spent DESC`.execute(postgres),

            sql<{company_id: number, fiscal_year: number, billing_city: string, sales_count: number}[]>`
                SELECT count(i) as sales_count, customer.billing_city, i.fiscal_year, customer.company_id
                FROM customer
                         INNER JOIN invoice i ON i.saft_customer_id = customer.saft_customer_id
                WHERE i.company_id = 233020780
                  AND fiscal_year = 2022
                GROUP BY customer.billing_city, i.fiscal_year, customer.company_id`.execute(postgres)
        ])

        const net = invoices.reduce((sum, current) => sum + Number(current.net_total), 0);
        const gross = invoices.reduce((sum, current) => sum + Number(current.gross_total), 0);
        const aov = net / fiscal_year.number_of_entries

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
                .values(invoicesByCustomer)
                .executeTakeFirstOrThrow(),

            postgres.insertInto('product_fiscal_year')
                .values(revenueByProducts.rows.map(p => ({
                    ...p,
                    company_id: company_id,
                    fiscal_year: year
                })))
                .onConflict(oc => oc
                    .columns(['product_code', 'fiscal_year', 'company_id'])
                    .doUpdateSet(eb => ({
                        product_code: eb.ref('excluded.product_code'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        company_id: eb.ref('excluded.company_id')
                    }))
                )
                .executeTakeFirstOrThrow(),

            postgres.insertInto('revenue_by_month')
                .values(revenueByMonth.rows)
                .onConflict(oc => oc
                    .columns(['month', 'fiscal_year', 'company_id'])
                    .doUpdateSet(eb => ({
                        month: eb.ref('excluded.month'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        company_id: eb.ref('excluded.company_id')
                    }))
                )
                .executeTakeFirstOrThrow(),

            postgres.insertInto('sales_by_city')
                .values(salesByCity.rows)
                .onConflict(oc => oc
                    .columns(['company_id', 'fiscal_year', 'billing_city'])
                    .doUpdateSet(eb => ({
                        company_id: eb.ref('excluded.company_id'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        billing_city: eb.ref('excluded.billing_city')
                    })))
                .executeTakeFirstOrThrow()
        ])
    } catch (e) {
        console.log(e)
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
}