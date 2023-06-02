import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely"

const {count, sum} = postgres.fn

const yearOf = (company: number, year: number) => postgres
    .selectFrom('fiscal_year')
    .select('number_of_entries')
    .where('company_id', '=', company)
    .where('fiscal_year', '=', year)
    .executeTakeFirstOrThrow()

const invoicesOf = (company: number, year: number) => postgres
    .selectFrom("invoice")
    .select([
        count('hash').as('invoices_count'),
        sum('net_total').as('customer_net_total'),
        'customer_tax_id',
        'fiscal_year',
        'company_id'
    ])
    .where('fiscal_year', '=', year)
    .where('company_id', '=', company)
    .groupBy(['customer_tax_id', 'fiscal_year', 'company_id'])
    .execute()

const revenueByMonthOf = (company: number, year: number) => sql<{
    invoices_count: number,
    month: number,
    net_total: number,
    gross_total: number,
    fiscal_year: number,
    company_id: number
}>`
    SELECT COUNT(*)                         AS invoices_count,
           EXTRACT(MONTH FROM invoice_date) AS month,
           SUM(net_total)                   AS net_total,
           SUM(gross_total)                 AS gross_total,
           fiscal_year,
           company_id
    FROM invoice
    WHERE fiscal_year = ${year}
      AND company_id = ${company}
    GROUP BY month, fiscal_year, company_id`.execute(postgres)

const revenueByProductsOf = (company: number, year: number) => sql<{
    product_code: number,
    revenue: number,
    total_sales: number
}>`
    SELECT product_code,
           MAX(quantity * unit_price) AS revenue,
           count(product_code)        AS total_sales
    FROM invoice_line
    WHERE fiscal_year = ${year}
      AND company_id = ${company}
    GROUP BY product_code
    ORDER BY revenue DESC`.execute(postgres)

const revenueByCityOf = (company: number, year: number) => sql<{
    company_id: number,
    fiscal_year: number,
    billing_city: string,
    net_total: number
}>`
    SELECT sum(i.net_total) as net_total, c.billing_city, i.fiscal_year, c.company_id
    FROM customer_fiscal_year c
             INNER JOIN invoice i ON i.customer_tax_id = c.customer_tax_id
    WHERE i.company_id = ${company}
      AND i.fiscal_year = ${year}
    GROUP BY c.billing_city, i.fiscal_year, c.company_id`.execute(postgres)

const revenueByCountryOf = (company: number, year: number) => sql<{
    company_id: number,
    fiscal_year: number,
    billing_country: string,
    net_total: number
}>`
    SELECT sum(i.net_total) as net_total, c.billing_country, i.fiscal_year, c.company_id
    FROM customer_fiscal_year c
             INNER JOIN invoice i ON i.customer_tax_id = c.customer_tax_id
    WHERE i.company_id = ${company}
      AND i.fiscal_year = ${year}
    GROUP BY c.billing_country, i.fiscal_year, c.company_id`.execute(postgres)

const averageCustomersLifespanOf = (company: number, year: number) => sql<{
    average_months_active: number
}>`
    SELECT AVG(months_active) AS average_months_active
    FROM (SELECT COUNT(DISTINCT EXTRACT(MONTH FROM i.invoice_date)) AS months_active
          FROM customer_fiscal_year c
                   INNER JOIN invoice i ON i.customer_tax_id = c.customer_tax_id
          WHERE i.company_id = ${company}
            AND i.fiscal_year = ${year}
          GROUP BY c.customer_tax_id) AS customer_months_active`.execute(postgres)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const company = Number(req.query.company)
    const year = Number(req.query.year)

    try {
        const [
            fiscal_year,
            invoicesByCustomer,
            revenueByMonth,
            revenueByProducts,
            revenueByCity,
            revenueByCountry,
            averageCustomersLifespan,
        ] = await Promise.all([
            yearOf(company, year),
            invoicesOf(company, year),
            revenueByMonthOf(company, year),
            revenueByProductsOf(company, year),
            revenueByCityOf(company, year),
            revenueByCountryOf(company, year),
            averageCustomersLifespanOf(company, year)
        ])

        const totalCustomersCount = invoicesByCustomer.length
        const customerWithInvoices = invoicesByCustomer.filter(c => Number(c.invoices_count) > 1).length

        const net_sales = revenueByMonth.rows.reduce((sum, current) => sum + Number(current.net_total), 0)
        const gross_sales = revenueByMonth.rows.reduce((sum, current) => sum + Number(current.gross_total), 0)
        const aov = net_sales / fiscal_year.number_of_entries
        const rpr = (customerWithInvoices / totalCustomersCount) * 100

        const averageTransactionsPerMonth = revenueByMonth.rows.reduce(
            (sum, current) => sum + Number(current.invoices_count), 0
        ) / 12

        /*
        const clv = (
            aov *
            averageTransactionsPerMonth *
            averageCustomersLifespan.rows[0].average_months_active
        ) / fiscal_year.customers_count */

        await Promise.all([
            postgres.updateTable('fiscal_year')
                .set({net_sales, gross_sales, aov, rpr, clv: 0})
                .where('company_id', '=', Number(company))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow(),

            /*
            ...invoicesByCustomer.map(invoice => postgres
                .updateTable('customer_fiscal_year')
                .set({...invoice})
                .where({})
                .executeTakeFirstOrThrow()),
*/
            /*
            postgres.updateTable('product_fiscal_year')
                .set(revenueByProducts.rows.map(p => ({
                    ...p,
                    company_id: company,
                    fiscal_year: year
                })))
                .executeTakeFirstOrThrow(),
*/

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

            postgres.insertInto('revenue_by_city')
                .values(revenueByCity.rows)
                .onConflict(oc => oc
                    .columns(['billing_city', 'company_id', 'fiscal_year'])
                    .doUpdateSet(eb => ({
                        company_id: eb.ref('excluded.company_id'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        billing_city: eb.ref('excluded.billing_city')
                    })))
                .executeTakeFirstOrThrow(),

            postgres.insertInto('revenue_by_country')
                .values(revenueByCountry.rows)
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