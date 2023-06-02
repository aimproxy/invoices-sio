import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company, year} = req.query

    try {
        const revenueByMonth = await sql`
            SELECT to_char(to_date(month::text, 'MM'), 'Month') as month,
                   sum(net_total)                               as "Number Of Sales"
            FROM revenue_by_month
            WHERE company_id = ${Number(company)}
              AND fiscal_year = ${Number(year)}
            GROUP BY to_char(to_date(month::text, 'MM'), 'Month')
            ORDER BY MIN(month)
        `.execute(postgres)

        res.status(200).json(revenueByMonth.rows)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}