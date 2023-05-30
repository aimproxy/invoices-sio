import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export type Customer = {
    customer_tax_id: number,
    company_name: string,
    ship_to_city: string,
    ship_to_postal_code: string,
    ship_to_country: string
    customer_net_total: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Customer[] | undefined>
) {

    const {company, year} = req.query

    try {
        const customers = await postgres
            .selectFrom('customer')
            .select([
                'company_name',
                'customer_tax_id',
                'ship_to_city',
                'ship_to_postal_code',
                'ship_to_country',
                'customer_net_total'
            ])
            .innerJoin('customer_fiscal_year', 'customer.saft_customer_id', 'customer_fiscal_year.saft_customer_id')
            .where('customer.company_id', '=', Number(company))
            .where('fiscal_year', '=', Number(year))
            .orderBy('customer_net_total', 'desc')
            .execute()

        res.status(200).json(customers)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}