import {createKysely} from "@vercel/postgres-kysely";

export interface CustomerRaw {
    customer_id: number;
    account_id: string;
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
}

export interface ProductRaw {
    product_id: number;
    product_type: string;
    product_code: string;
    product_description: string;
    product_number_code: string;
}

export interface TaxEntryRaw {
    tax_id: number;
    tax_type: string;
    tax_country_region: string;
    tax_code: string;
    description: string;
    tax_percentage: number;
}

export interface InvoiceRaw {
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
}

export interface InvoiceLineRaw {
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
    customer: CustomerRaw;
    product: ProductRaw;
    tax_entry: TaxEntryRaw;
    invoice: InvoiceRaw;
    invoice_line: InvoiceLineRaw;
}


export default createKysely<DatabaseSchema>();