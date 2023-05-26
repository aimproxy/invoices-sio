import {NextApiRequest, NextApiResponse} from "next";
import {customersQuery} from "@sio/query";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company} = req.query

    try {
        const customers = await customersQuery
            .where('company_id', '=', Number(company))
            .execute()

        res.status(200).json(customers)
    } catch (e) {
        res.status(400).json(e)
    }
}