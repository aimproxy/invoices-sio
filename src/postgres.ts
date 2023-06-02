import {createKysely} from "@vercel/postgres-kysely";

interface Company {
    company_id: number;
    company_name: string;
    currency_code: string;
}

interface FiscalYear {
    fiscal_year: number;
    company_id: number;
    start_date: Date;
    end_date: Date;
    date_created: Date;
    number_of_entries: number;
    net_sales: number;
    gross_sales: number;
    aov: number;
    rpr: number;
    clv: number;
}

interface CustomerFiscalYear {
    customer_tax_id: number;
    company_name: string;
    billing_address_detail: string;
    billing_city: string;
    billing_postal_code: string;
    billing_country: string;
    company_id: number;
    fiscal_year: number;
    invoices_count: number;
    customer_net_total: number;
}

interface ProductFiscalYear {
    product_code: string;
    product_description: string;
    fiscal_year: number;
    company_id: number;
    revenue: number;
    total_sales: number;
}

interface RevenueByMonth {
    company_id: number;
    fiscal_year: number;
    month: number;
    invoices_count: number;
    net_total: number;
    gross_total: number;
}

interface RevenueByCity {
    company_id: number;
    fiscal_year: number;
    billing_city: string;
    net_total: number;
}

interface RevenueByCountry {
    company_id: number;
    fiscal_year: number;
    billing_country: string;
    net_total: number;
}

interface Invoice {
    hash: Buffer;
    invoice_date: Date;
    tax_payable: number;
    net_total: number;
    gross_total: number;
    customer_tax_id: number;
    fiscal_year: number;
    company_id: number;
}

interface InvoiceLine {
    line_id: number;
    fiscal_year: number;
    company_id: number;
    invoice_hash: Buffer;
    quantity: number;
    unit_price: number;
    credit_amount: number;
    debit_amount: number;
    product_code: string;
}

interface DatabaseSchema {
    company: Company;
    fiscal_year: FiscalYear;
    customer_fiscal_year: CustomerFiscalYear;
    product_fiscal_year: ProductFiscalYear;
    invoice: Invoice;
    invoice_line: InvoiceLine;
    revenue_by_month: RevenueByMonth;
    revenue_by_city: RevenueByCity;
    revenue_by_country: RevenueByCountry;
}


export default createKysely<DatabaseSchema>();