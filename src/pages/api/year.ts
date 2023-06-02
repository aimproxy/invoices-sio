import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {company, year} = req.query

    try {
        const fiscalYear = await postgres
            .selectFrom('fiscal_year')
            .select([
                'fiscal_year.fiscal_year',
                'fiscal_year.company_id',
                'fiscal_year.net_sales',
                'fiscal_year.gross_sales',
                'fiscal_year.aov',
                'fiscal_year.clv',
                'fiscal_year.number_of_entries',
                'fiscal_year.rpr'
            ])
            .where('fiscal_year.company_id', '=', Number(company))
            .where('fiscal_year.fiscal_year', '=', Number(year))
            .executeTakeFirstOrThrow()

        res.status(200).json(fiscalYear)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}