import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export interface SalesByCity {
    billing_city: string,
    sales_count: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SalesByCity[] | undefined>
){
    const {company, year} = req.query

    try {
        const salesByCity = await postgres.selectFrom('sales_by_city')
            .select(['billing_city', 'sales_count'])
            .where('fiscal_year', '=', Number(year))
            .where('company_id', '=', Number(company))
            .orderBy('sales_count', 'desc')
            .limit(5)
            .execute()

        res.status(200).json(salesByCity)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}