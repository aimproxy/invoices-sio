import postgres from "@sio/postgres";
import {InferResult} from "kysely";

export const companyQuery = postgres
    .selectFrom('company')
    .select([
        'company.company_id',
        'company.company_name',
        'company.currency_code'
    ])

export type CompanyReturnType = InferResult<typeof companyQuery>

export const yearsQuery = postgres
    .selectFrom('fiscal_year')
    .select([
        'fiscal_year.fiscal_year',
        'fiscal_year.company_id',
        'fiscal_year.net_sales',
        'fiscal_year.gross_sales'
    ])

export type YearsReturnType = InferResult<typeof yearsQuery>