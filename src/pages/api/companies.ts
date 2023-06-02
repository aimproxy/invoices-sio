import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const companies = await postgres.selectFrom('company')
            .select([
                'company.company_id',
                'company.company_name',
            ])
            .execute();

        res.status(200).json(companies)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}