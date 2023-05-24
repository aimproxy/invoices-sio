import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const xml = req.body

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const header = doc.getElementsByTagName('Header')[0];
    const companyMetadata = getElementsByTagNames(header, [
        'CompanyID', 'TaxRegistrationNumber',
        'CompanyName', 'CurrencyCode'
    ])

    const fiscalYearMetadata: { [key: string]: any } = {
        company_id: companyMetadata.company_id,
        ...getElementsByTagNames(header, [
            'FiscalYear', 'StartDate',
            'EndDate', 'DateCreated'
        ])
    }

    try {
        await postgres
            .insertInto('company')
            .values(companyMetadata)
            .onConflict(oc =>
                oc.column('tax_registration_number').doUpdateSet({
                    tax_registration_number: companyMetadata.tax_registration_number
                })
            )
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }

    const productMetadata = doc.getElementsByTagName('Product');
    const products = []
    for (let i = 0; i < productMetadata.length; i++) {
        const product = productMetadata[i];
        products.push({
            company_id: companyMetadata.company_id,
            ...getElementsByTagNames(product, [
                    'ProductType', 'ProductCode',
                    'ProductDescription', 'ProductNumberCode'
                ]
            )
        })
    }

    const customerMetadata = doc.getElementsByTagName('Customer');
    const customers = []
    for (let i = 0; i < customerMetadata.length; i++) {
        const customer = customerMetadata[i];
        const billingAddressElement = customer.getElementsByTagName('BillingAddress')[0];
        const shipToAddressElement = customer.getElementsByTagName('ShipToAddress')[0];

        const {
            customer_id,
            customer_tax_id,
            self_billing_indicator,
            ...left
        } = getElementsByTagNames(customer, [
            'CustomerID', 'CompanyName',
            'CustomerTaxID', 'SelfBillingIndicator'
        ])

        customers.push({
            saft_customer_id: customer_id,
            company_id: companyMetadata.company_id,
            customer_tax_id: Number(customer_tax_id),
            self_billing_indicator: Number(self_billing_indicator),
            ...left,
            ...getElementsByTagNames(billingAddressElement, [
                'AddressDetail', 'City',
                'PostalCode', 'Country'
            ], 'billing'),
            ...getElementsByTagNames(shipToAddressElement, [
                'AddressDetail', 'City',
                'PostalCode', 'Country'
            ], 'ship_to')
        })
    }

    const invoiceElement = doc.getElementsByTagName('Invoice');
    const invoices = []

    const invoiceLinesElements: { hash: string, line: Element }[] = []

    for (let i = 0; i < invoiceElement.length; i++) {
        const rawInvoice = invoiceElement[i]
        const invoice = getElementsByTagNames(rawInvoice, [
            'InvoiceNo', 'ATCUD', 'Hash', 'InvoiceStatus',
            'InvoiceStatusDate', 'InvoiceDate', 'InvoiceType',
            'SystemEntryDate', 'CustomerID', 'TaxPayable',
            'NetTotal', 'GrossTotal'
        ])

        const documentTotals = getElementsByTagNames(
            rawInvoice.getElementsByTagName('DocumentTotals')[0],
            ['TaxPayable', 'NetTotal', 'GrossTotal']
        )

        invoices.push({
            fiscal_year: fiscalYearMetadata.fiscal_year,
            ...invoice,
            ...documentTotals
        })

        const line = rawInvoice.getElementsByTagName('Line')[0]
        invoiceLinesElements.push({
            hash: invoice.hash,
            line
        })
    }

    const invoiceLines = []
    for (let i = 0; i < invoiceLinesElements.length; i++) {
        const {hash, line} = invoiceLinesElements[i]
        const invoiceLine = getElementsByTagNames(line, [
            'ProductCode', 'Quantity', 'UnitOfMeasure',
            'UnitPrice', 'TaxPointDate', 'Description',
        ])

        invoiceLines.push({
            invoice_hash: hash,
            credit_amount: line.getElementsByTagName('CreditAmount')[0]?.textContent ?? null,
            debit_amount: line.getElementsByTagName('DebitAmount')[0]?.textContent ?? null,
            ...invoiceLine
        })
    }

    try {
        await Promise.all([
            // Insert Fiscal Year
            postgres.insertInto('fiscal_year')
                .values(fiscalYearMetadata)
                .onConflict(oc => oc
                    .column('fiscal_year')
                    .doUpdateSet({
                        fiscal_year: fiscalYearMetadata.fiscal_year
                    })
                )
                .executeTakeFirstOrThrow(),

            // Insert Products
            postgres.insertInto('product')
                .values(products)
                .onConflict(oc => oc
                    .column('product_code')
                    .doUpdateSet(eb => ({
                        product_code: eb.ref('excluded.product_code')
                    }))
                )
                .executeTakeFirstOrThrow(),

            // Insert Customers
            postgres.insertInto('customer')
                .values(customers)
                .onConflict(oc => oc
                    .column('customer_tax_id')
                    .doUpdateSet(eb => ({
                        customer_tax_id: eb.ref('excluded.customer_tax_id')
                    }))
                )
                .executeTakeFirstOrThrow(),

            // Insert Invoices
            await postgres.insertInto('invoice').values(invoices).executeTakeFirstOrThrow(),
            await postgres.insertInto('invoice_line').values(invoiceLines).executeTakeFirstOrThrow()
        ])
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }

    return res.status(200).json({ok: true})
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