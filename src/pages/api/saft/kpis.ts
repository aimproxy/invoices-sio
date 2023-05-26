import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const {company_id, year} = req.query

    // Calculate Net and Gross Sales
    try {
        const invoices = await postgres.selectFrom('invoice')
            .select(['tax_payable', 'net_total', 'gross_total'])
            .where('company_id', '=', Number(company_id))
            .where('fiscal_year', '=', Number(year))
            .execute();

        const net = invoices.reduce((sum, current) => sum + Number(current.net_total), 0);
        const gross = invoices.reduce((sum, current) => sum + Number(current.gross_total), 0);
        console.log(net)
        console.log(gross)
        console.log(company_id)

        await Promise.all([
            postgres.updateTable('fiscal_year')
                .set({
                    net_sales: net,
                    gross_sales: gross
                })
                .where('company_id', '=', Number(company_id))
                .where('fiscal_year', '=', Number(year))
                .executeTakeFirstOrThrow()
        ])
    } catch (e) {
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
}