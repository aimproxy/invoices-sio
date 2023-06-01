import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export interface RevenueByCity {
    billing_city: string,
    net_total: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RevenueByCity[] | undefined>
){
    const {company, year} = req.query

    try {
        const revenueByCity = await postgres.selectFrom('revenue_by_city')
            .select(['billing_city', 'net_total'])
            .where('fiscal_year', '=', Number(year))
            .where('company_id', '=', Number(company))
            .orderBy('net_total', 'desc')
            .limit(5)
            .execute()

        res.status(200).json(revenueByCity)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}