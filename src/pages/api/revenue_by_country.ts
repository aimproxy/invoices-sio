import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company, year} = req.query

    try {
        const revenueByCountry = await postgres.selectFrom('revenue_by_country')
            .select(['billing_country', 'net_total'])
            .where('fiscal_year', '=', Number(year))
            .where('company_id', '=', Number(company))
            .orderBy('net_total', 'desc')
            .limit(5)
            .execute()

        res.status(200).json(revenueByCountry)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}