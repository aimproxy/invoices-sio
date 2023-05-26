import {NextApiRequest, NextApiResponse} from "next";
import {yearsQuery} from "@sio/query";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company} = req.query

    try {
        const years = await yearsQuery
            .where('fiscal_year.company_id', '=', Number(company))
            .execute()

        res.status(200).json(years)
    } catch (e) {
        res.status(400).json(e)
    }
}