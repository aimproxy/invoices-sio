import {NextApiRequest, NextApiResponse} from "next";
import {yearsQuery} from "@sio/query";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const years = await yearsQuery.execute()

    res.status(200).json(years)
}