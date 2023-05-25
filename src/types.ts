type Company = { companyId: number, companyName: string }
export type FiscalYear = { fiscalYear: number; startDate: string; endDate: string }

export interface CompanyMetadataResponse {
    companies: Company[],
    years: { [key: string]: FiscalYear[] }
}