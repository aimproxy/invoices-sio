import {createKysely} from "@vercel/postgres-kysely";

export type CompanyRaw = Omit<Company, 'company_id'>
export type FiscalYearRaw = Omit<FiscalYear, 'fiscal_year_id'>
export type CustomerRaw = Omit<Customer, 'customer_id'>
export type ProductRaw = Omit<Product, 'product_id'>
export type TaxEntryRaw = Omit<TaxEntry, 'tax_id'>
export type InvoiceRaw = Omit<Invoice, 'invoice_id'>
export type InvoiceLineRaw = Omit<InvoiceLine, 'line_id'>

export interface Company extends Record<string, any> {
    company_id: number
    tax_registration_number: number
    company_name: string
    currency_code: string
}

export interface FiscalYear extends Record<string, any> {
    fiscal_year_id: number
    fiscal_year: number
    start_date: string
    end_date: string
    date_created: string
    company_id: number
}

export interface Customer extends Record<string, any> {
    customer_id: number;
    customer_tax_id: number;
    company_name: string;
    billing_address_detail: string;
    billing_city: string;
    billing_postal_code: string;
    billing_country: string;
    ship_to_address_detail: string;
    ship_to_city: string;
    ship_to_postal_code: string;
    ship_to_country: string;
    self_billing_indicator: number;
    company_id: number;
}

export interface Product extends Record<string, any> {
    product_id: number;
    product_type: string;
    product_code: string;
    product_description: string;
    product_number_code: string;
    company_id: number;
}

export interface TaxEntry extends Record<string, any> {
    tax_id: number;
    tax_type: string;
    tax_country_region: string;
    tax_code: string;
    description: string;
    tax_percentage: number;
    company_id: number;
}

export interface Invoice {
    invoice_id: number;
    invoice_no: string;
    atcud: string;
    invoice_status: string;
    invoice_status_date: Date;
    source_id: number;
    source_billing: string;
    hash: string;
    hash_control: number;
    period: number;
    invoice_date: Date;
    invoice_type: string;
    self_billing_indicator: number;
    // it should be vat_schema but we cant parse uppercase's like VAT
    cash_vatscheme_indicator: number;
    third_parties_billing_indicator: number;
    system_entry_date: Date;
    customer_id: number;
    tax_payable: number;
    net_total: number;
    gross_total: number;
    company_id: number;
}

export interface InvoiceLine {
    line_id: number;
    invoice_id: number;
    line_number: number;
    product_code: string;
    product_description: string;
    quantity: number;
    unit_of_measure: string;
    unit_price: number;
    tax_point_date: Date;
    description: string;
    credit_amount?: number;
    debit_amount?: number;
    tax_id: number;
}


interface DatabaseSchema {
    company: CompanyRaw;
    fiscal_year: FiscalYearRaw;
    customer: CustomerRaw;
    product: ProductRaw;
    tax_entry: TaxEntryRaw;
    invoice: InvoiceRaw;
    invoice_line: InvoiceLineRaw;
}


export default createKysely<DatabaseSchema>();