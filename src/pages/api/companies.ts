import {NextApiRequest, NextApiResponse} from "next";
import {companyQuery} from "@sio/query";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const companies = await companyQuery.execute()

        res.status(200).json(companies)
    } catch (e) {
        res.status(400).json(e)
    }
}