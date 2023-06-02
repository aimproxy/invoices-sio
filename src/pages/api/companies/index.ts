import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";
import {sql} from "kysely";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const companies = await sql`
            SELECT company.company_id, company.company_name, max(fiscal_year) as fiscal_year
            FROM company
                     INNER JOIN fiscal_year fy on company.company_id = fy.company_id
            GROUP BY company.company_name, company.company_id`.execute(postgres)

        res.status(200).json(companies.rows)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}