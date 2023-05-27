import {NextApiRequest, NextApiResponse} from "next";
import postgres from "@sio/postgres";

export type Company = { company_id: number, company_name: string, fiscal_years: number[] }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Company[] | undefined>
) {
    try {
        const companies = await postgres.selectFrom('company')
            .select(['company.company_id', 'company.company_name', 'fiscal_year.fiscal_year'])
            .innerJoin('fiscal_year', 'fiscal_year.company_id', 'company.company_id')
            .execute()

        const metadata = companies.reduce((result, current) => {
            const {company_id, company_name, fiscal_year} = current;
            const existingCompany = result.find(c => c.company_id === company_id);

            if (existingCompany) {
                existingCompany.fiscal_years.push(fiscal_year);
            } else {
                result.push({
                    company_id,
                    company_name,
                    fiscal_years: [fiscal_year]
                });
            }

            return result;
        }, [] as Company[]);

        res.status(200).json(metadata)
    } catch (e) {
        console.error(e)
        res.status(400).json(undefined)
    }
}