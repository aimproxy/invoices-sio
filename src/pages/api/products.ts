import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company, year} = req.query

    try {
        const products = await postgres.selectFrom('product_fiscal_year')
            .select([
                'product_fiscal_year.product_code',
                'product_fiscal_year.product_description',
                'product_fiscal_year.revenue',
                'product_fiscal_year.total_sales'
            ])
            .where('product_fiscal_year.fiscal_year', '=', Number(year))
            .where('product_fiscal_year.company_id', '=', Number(company))
            .orderBy('product_fiscal_year.revenue', 'desc')
            .execute()

        res.status(200).json(products)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}