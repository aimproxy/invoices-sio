import {createKysely} from "@vercel/postgres-kysely";
import {Generated, Selectable} from "kysely";

export type Company = Selectable<CompanyTable>
export type FiscalYear = Selectable<FiscalYearTable>

export interface CompanyTable extends Record<string, any> {
    company_id: Generated<number>;
    tax_registration_number: number
    company_name: string
    currency_code: string
}

export interface FiscalYearTable extends Record<string, any> {
    fiscal_year_id: Generated<number>;
    fiscal_year: number
    start_date: string
    end_date: string
    date_created: string
    company_id: number
    number_of_entries: number
    aov: number
    net_sales: number
    gross_sales: number
}

export interface CustomerTable extends Record<string, any> {
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
    saft_customer_id: number;
}

export interface CustomerFiscalYearTable extends Record<string, any> {
    customer_fiscal_year_id: Generated<number>
    customer_tax_id: number
    fiscal_year_id: number
    invoices_count: number,
}

export interface ProductTable extends Record<string, any> {
    product_id: Generated<number>;
    product_type: string;
    product_code: string;
    product_description: string;
    product_number_code: string;
    company_id: number;
}

export interface InvoiceTable extends Record<string, any> {
    invoice_id: Generated<number>
    invoice_no: string
    atcud: string
    hash: string
    invoice_status: string
    invoice_status_date: Date
    invoice_date: Date
    invoice_type: string
    system_entry_date: Date
    saft_customer_id: number
    tax_payable: number
    net_total: number
    gross_total: number
    fiscal_year: number
    company_id: number
}

export interface InvoiceLine extends Record<string, any> {
    line_id: Generated<number>
    invoice_hash: string
    product_code: number
    quantity: number
    unit_of_measure: string
    unit_price: number
    tax_point_date: Date
    description: string
    credit_amount?: number
    debit_amount?: number
}


interface DatabaseSchema {
    company: CompanyTable;
    fiscal_year: FiscalYearTable;
    customer: CustomerTable;
    customer_fiscal_year: CustomerFiscalYearTable;
    product: ProductTable;
    invoice: InvoiceTable;
    invoice_line: InvoiceLine;
}


export default createKysely<DatabaseSchema>();