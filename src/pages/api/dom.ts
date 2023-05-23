import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, pg: any }>
) {
    const xml = req.body

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const header = doc.getElementsByTagName('Header')[0];
    const company = getElementsByTagNames(
        header, ['CompanyID', 'TaxRegistrationNumber', 'CompanyName', 'CurrencyCode']
    )

    const fiscalYear = {
        company_id: company.company_id,
        ...getElementsByTagNames(header, ['FiscalYear', 'StartDate', 'EndDate', 'DateCreated'])
    }

    // because the fiscal year has a foreign key with a company, this should run sequentially
    await postgres.insertInto('company').values(company).executeTakeFirst();
    await postgres.insertInto('fiscal_year').values(fiscalYear).executeTakeFirst();

    const products = doc.getElementsByTagName('Product');
    const productsBeforeSQL = []
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        productsBeforeSQL.push({
            company_id: company.company_id,
            ...getElementsByTagNames(
                product,
                ['ProductType', 'ProductCode', 'ProductDescription', 'ProductNumberCode'])
        })
    }

    const customers = doc.getElementsByTagName('Customer');
    const customersBeforeSQL = []
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const billingAddressElement = customer.getElementsByTagName('BillingAddress')[0];
        const shipToAddressElement = customer.getElementsByTagName('ShipToAddress')[0];

        const {
            customer_tax_id,
            self_billing_indicator,
            ...left
        } = getElementsByTagNames(customer, ['CompanyName', 'CustomerTaxID', 'SelfBillingIndicator'])

        customersBeforeSQL.push({
            company_id: company.company_id,
            customer_tax_id: Number(customer_tax_id),
            self_billing_indicator: Number(self_billing_indicator),
            ...left,
            ...getElementsByTagNames(billingAddressElement, ['AddressDetail', 'City', 'PostalCode', 'Country'], 'billing'),
            ...getElementsByTagNames(shipToAddressElement, ['AddressDetail', 'City', 'PostalCode', 'Country'], 'ship_to')
        })
    }

    const taxTable = doc.getElementsByTagName('TaxTable')[0].getElementsByTagName('TaxTableEntry')
    const taxTableBeforeSQL = []

    for (let i = 0; i < taxTable.length; i++) {
        const taxEntry = taxTable[i]
        taxTableBeforeSQL.push({
            company_id: company.company_id,
            ...getElementsByTagNames(
                taxEntry,
                ['TaxType', 'TaxCountryRegion', 'TaxCode', 'Description', 'TaxPercentage']
            )
        })
    }

    const pg = await Promise.all([
        postgres.insertInto('product').values(productsBeforeSQL).executeTakeFirst(),
        postgres.insertInto('customer').values(customersBeforeSQL).executeTakeFirst(),
        postgres.insertInto('tax_entry').values(taxTableBeforeSQL).executeTakeFirst(),
    ])

    const invoices = doc.getElementsByTagName('Invoice');
    for (let i = 0; i < invoices.length; i++) {
        const rawInvoice = invoices[i]
        const invoice = getElementsByTagNames(rawInvoice, [
            'InvoiceNo', 'ATCUD', 'InvoiceStatus',
            'InvoiceStatusDate', 'Hash', 'Period',
            'InvoiceDate', 'InvoiceType', 'SystemEntryDate',
            'CustomerID', 'TaxPayable', 'NetTotal', 'GrossTotal'
        ])

        const documentTotals = getElementsByTagNames(
            rawInvoice.getElementsByTagName('DocumentTotals')[0],
            ['TaxPayable', 'NetTotal', 'GrossTotal'])

        const lines = rawInvoice.getElementsByTagName('Line');
        for (let j = 0; j < lines.length; j++) {
            const line = lines[j];
        }
    }

    res.status(200).json({ok: true, pg})
}

const getElementsByTagNames = (element: Element, tags: string[], prefix?: string) => {
    const serializedTags: { [key: string]: string } = {};

    tags.forEach(tag => {
        const serializedTagName = tag
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();

        const tagName = prefix ? `${prefix}_${serializedTagName}` : serializedTagName

        serializedTags[tagName] = element.getElementsByTagName(tag)[0].textContent!;
    });

    return serializedTags;
}

const getCustomerByTaxId = (taxId: number) => {
    return postgres.selectFrom('customer')
        .select('customer_id')
        .where('customer_tax_id', '=', taxId)
        .executeTakeFirst()
}