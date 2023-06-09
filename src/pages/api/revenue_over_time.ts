import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company, year} = req.query

    try {
        const revenue = await postgres.selectFrom('revenue_by_month')
            .select(['net_total', 'gross_total', 'month'])
            .where('company_id', '=', Number(company))
            .where('fiscal_year', '=', Number(year))
            .orderBy('month', 'asc')
            .execute()

        res.status(200).json(revenue)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}