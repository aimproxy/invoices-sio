import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely";

export interface SalesByMonth {
    invoice_count: number,
    month: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SalesByMonth[] | undefined>
) {
    const {company, year} = req.query

    try {
        const salesByMonth = await sql<SalesByMonth>`
            SELECT count(invoice_id) as invoice_count,
                   to_char(invoice_date, 'Month') as month
            FROM invoice
            WHERE company_id = ${Number(company)}
              AND fiscal_year = ${Number(year)}
            GROUP BY TO_CHAR(invoice_date, 'Month')
            ORDER BY min (invoice_date)
        `.execute(postgres)

        res.status(200).json(salesByMonth.rows)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}