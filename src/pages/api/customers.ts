import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export type Customer = {
    customer_tax_id: number,
    company_name: string,
    ship_to_city: string,
    ship_to_postal_code: string,
    ship_to_country: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Customer[] | undefined>
) {
    const {company} = req.query

    try {
        const customers = await postgres
            .selectFrom('customer')
            .select([
                'company_name',
                'customer_tax_id',
                'ship_to_city',
                'ship_to_postal_code',
                'ship_to_country'
            ])
            .where('company_id', '=', Number(company))
            .execute()

        res.status(200).json(customers)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}