import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const media = await postgres
        .selectFrom("fiscal_year")
        .select(["net_sales", "gross_sales"])
        .where('company_id', '=', 233020780)
        .where('fiscal_year', '=', 2022)
        .limit(1)
        .executeTakeFirst()

    res.status(200).json(media)
}