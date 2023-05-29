import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export type Product = {
    product_code: number
    product_description: string
    amount_spent: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Product[] | undefined>
) {
    const {company, year} = req.query

    try {
        const products = await postgres.selectFrom('product_fiscal_year')
            .select([
                'product.product_code',
                'product.product_description',
                'product_fiscal_year.amount_spent'
            ])
            .where('product_fiscal_year.fiscal_year', '=', Number(year))
            .where('product_fiscal_year.company_id', '=', Number(company))
            .innerJoin('product', 'product.product_code', 'product_fiscal_year.product_code')
            .orderBy('product_fiscal_year.amount_spent', 'desc')
            .execute()

        res.status(200).json(products)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}