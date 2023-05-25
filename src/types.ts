type Company = { companyId: number; companyName: string; currencyCode: string }
export type FiscalYear = { fiscalYear: number; startDate: string; endDate: string }

export interface CompanyResponse {
    companies: Company[],
    years: { [key: string]: FiscalYear[] }
}