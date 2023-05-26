import postgres from "@sio/postgres";
import {InferResult} from "kysely";

export const companiesQuery = postgres
    .selectFrom('company')
    .select([
        'company.company_id',
        'company.company_name',
        'company.currency_code',
        'company.tax_registration_number'
    ])

export type CompanyReturnType = InferResult<typeof companiesQuery>

export const yearsQuery = postgres
    .selectFrom('fiscal_year')
    .select([
            'fiscal_year.fiscal_year',
            'fiscal_year.company_id',
            'fiscal_year.net_sales',
            'fiscal_year.gross_sales',
            'fiscal_year.aov'
    ])

export type YearsReturnType = InferResult<typeof yearsQuery>

export const customersQuery = postgres
    .selectFrom('customer')
    .selectAll()

export type CustomersReturnType = InferResult<typeof customersQuery>
