import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export interface SalesByCountry {
    billing_country: string,
    sales_count: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SalesByCountry[] | undefined>
) {
    const {company, year} = req.query

    try {
        const salesByCountry = await postgres.selectFrom('sales_by_country')
            .select(['billing_country', 'sales_count'])
            .where('fiscal_year', '=', Number(year))
            .where('company_id', '=', Number(company))
            .orderBy('sales_count', 'desc')
            .limit(5)
            .execute()

        res.status(200).json(salesByCountry)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}