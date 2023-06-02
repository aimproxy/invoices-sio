import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const {company, year} = req.query

    try {
        const customers = await postgres
            .selectFrom('customer_fiscal_year')
            .select([
                'company_name',
                'customer_tax_id',
                'billing_city',
                'billing_postal_code',
                'billing_country',
                'invoices_count',
                'customer_net_total'
            ])
            .where('company_id', '=', Number(company))
            .where('fiscal_year', '=', Number(year))
            .orderBy('customer_net_total', 'desc')
            .execute()

        res.status(200).json(customers)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}