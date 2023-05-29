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
            fiscal_year,
            invoicesByCustomer,
            revenueByMonth,
            revenueByProducts,
            salesByCity,
            salesByCountry,
            averageMonthsActive,
        ] = await Promise.all([

            postgres.selectFrom('fiscal_year')
                .select(['number_of_entries', 'customers_count'])
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow(),

            postgres.selectFrom("invoice")
                .select([
                    count('invoice_id').as('invoices_count'),
                    'saft_customer_id',
                    'fiscal_year',
                    'company_id'
                ])
                .where('fiscal_year', '=', Number(year))
                .groupBy(['saft_customer_id', 'fiscal_year', 'company_id'])
                .execute(),

            sql<{
                invoices_count: number,
                month: number,
                net_total: number,
                gross_total: number,
                fiscal_year: number,
                company_id: number
            }>`
                SELECT COUNT(invoice_id) AS invoices_count,
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

            sql<{ company_id: number, fiscal_year: number, billing_city: string, sales_count: number }[]>`
                SELECT count(i) as sales_count, customer.billing_city, i.fiscal_year, customer.company_id
                FROM customer
                         INNER JOIN invoice i ON i.saft_customer_id = customer.saft_customer_id
                WHERE i.company_id = ${Number(company_id)}
                  AND fiscal_year = ${Number(year)}
                GROUP BY customer.billing_city, i.fiscal_year, customer.company_id`.execute(postgres),

            sql<{ company_id: number, fiscal_year: number, billing_country: string, sales_count: number }[]>`
                SELECT count(i) as sales_count, customer.billing_country, i.fiscal_year, customer.company_id
                FROM customer
                         INNER JOIN invoice i ON i.saft_customer_id = customer.saft_customer_id
                WHERE i.company_id = ${Number(company_id)}
                  AND fiscal_year = ${Number(year)}
                GROUP BY customer.billing_country, i.fiscal_year, customer.company_id`.execute(postgres),

            sql<{ average_months_active: number }>`
                SELECT AVG(months_active) AS average_months_active
                FROM (SELECT COUNT(DISTINCT EXTRACT(MONTH FROM i.invoice_date)) AS months_active
                      FROM customer c
                               INNER JOIN invoice i ON i.saft_customer_id = c.saft_customer_id
                      WHERE i.company_id = ${Number(company_id)}
                        AND fiscal_year = ${Number(year)}
                      GROUP BY c.saft_customer_id) AS customer_months_active`.execute(postgres),

        ])

        const totalCustomersCount = invoicesByCustomer.length
        const customerWithInvoices = invoicesByCustomer.filter(c => Number(c.invoices_count) > 1).length

        const net = revenueByMonth.rows.reduce((sum, current) => sum + Number(current.net_total), 0);
        const gross = revenueByMonth.rows.reduce((sum, current) => sum + Number(current.gross_total), 0);
        const aov = net / fiscal_year.number_of_entries
        const rpr = (customerWithInvoices / totalCustomersCount) * 100

        const averageTransactionsPerMonth = revenueByMonth.rows.reduce((sum, current) =>
            sum + Number(current.invoices_count), 0) / 12

        const clv = (averageTransactionsPerMonth * aov * averageMonthsActive.rows[0].average_months_active) / fiscal_year.customers_count

        await Promise.all([
            postgres.updateTable('fiscal_year')
                .set({
                    net_sales: net,
                    gross_sales: gross,
                    aov,
                    rpr,
                    clv
                })
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow(),

            postgres.insertInto('customer_fiscal_year')
                .values(invoicesByCustomer)
                .onConflict(oc => oc
                    .columns(['saft_customer_id', 'company_id', 'fiscal_year'])
                    .doUpdateSet(eb => ({
                        saft_customer_id: eb.ref('excluded.saft_customer_id'),
                        company_id: eb.ref('excluded.company_id'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                    })))
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
                    .columns(['billing_city', 'company_id', 'fiscal_year'])
                    .doUpdateSet(eb => ({
                        company_id: eb.ref('excluded.company_id'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        billing_city: eb.ref('excluded.billing_city')
                    })))
                .executeTakeFirstOrThrow(),

            postgres.insertInto('sales_by_country')
                .values(salesByCountry.rows)
                .onConflict(oc => oc
                    .columns(['company_id', 'fiscal_year', 'billing_country'])
                    .doUpdateSet(eb => ({
                        company_id: eb.ref('excluded.company_id'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        billing_country: eb.ref('excluded.billing_country')
                    })))
                .executeTakeFirstOrThrow()
        ])
    } catch (e) {
        console.log(e)
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
}