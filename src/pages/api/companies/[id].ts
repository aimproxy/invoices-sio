import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {id} = req.query

    try {
        const company = await sql`
            SELECT fiscal_year, company_name
            FROM company
                     INNER JOIN fiscal_year fy on company.company_id = fy.company_id
            WHERE company.company_id = ${id}`.execute(postgres)

        res.status(200).json(company.rows)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}