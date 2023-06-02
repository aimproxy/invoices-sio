import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres from "@sio/postgres";

export type SaftResponse = { ok: boolean, e?: any }

type KeyValue = { [key: string]: string }

const insertCompany = async (company: KeyValue, res: NextApiResponse) => {
    try {
        await postgres
            .insertInto('company')
            .values(company)
            .onConflict(oc => oc.column('company_id').doUpdateSet({
                company_id: company.company_id
            }))
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

const insertProducts = async (products: KeyValue[], res: NextApiResponse) => {
    try {
        console.log(products)
        await postgres.insertInto('product_fiscal_year')
            .values(products)
            .onConflict(oc => oc
                .columns(['product_code', 'fiscal_year', 'company_id'])
                .doUpdateSet(eb => ({
                    product_code: eb.ref('excluded.product_code'),
                    fiscal_year: eb.ref('excluded.fiscal_year'),
                    company_id: eb.ref('excluded.company_id')
                }))
            )
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

const insertCustomers = async (customers: KeyValue[], res: NextApiResponse) => {
    try {
        await postgres.insertInto('customer_fiscal_year')
            .values(customers)
            .onConflict(oc => oc
                .columns(['customer_tax_id', 'company_id', 'fiscal_year'])
                .doUpdateSet(eb => ({
                    customer_tax_id: eb.ref('excluded.customer_tax_id'),
                    company_id: eb.ref('excluded.company_id'),
                    fiscal_year: eb.ref('excluded.fiscal_year'),
                })))
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

const insertFiscalYear = async (fiscalYear: KeyValue, res: NextApiResponse) => {
    try {
        await postgres.insertInto('fiscal_year')
            .values(fiscalYear)
            .onConflict(oc => oc
                .columns(['fiscal_year', 'company_id'])
                .doUpdateSet(fiscalYear)
            )
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

const insertInvoices = async (invoices: KeyValue[], res: NextApiResponse) => {
    try {
        await postgres.insertInto('invoice')
            .values(invoices)
            .onConflict(oc => oc
                .columns(['hash', 'fiscal_year', 'company_id'])
                .doUpdateSet(eb => ({
                    hash: eb.ref('excluded.hash'),
                    fiscal_year: eb.ref('excluded.fiscal_year'),
                    company_id: eb.ref('excluded.company_id')
                }))
            )
            .executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

const insertInvoiceLines = async (invoiceLines: KeyValue[], res: NextApiResponse) => {
    try {
        await postgres.insertInto('invoice_line').values(invoiceLines).executeTakeFirstOrThrow()
    } catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, e})
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SaftResponse>
) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(req.body, 'application/xml');

    /**
     * Insert Company
     */
    const {tax_registration_number, ...company} = getElementsByTagNames(
        doc.getElementsByTagName('Header')[0],
        ['TaxRegistrationNumber', 'CompanyName', 'CurrencyCode']
    )

    await insertCompany({
        company_id: tax_registration_number,
        ...company
    }, res)

    /**
     * Insert Fiscal Year
     */
    const fiscalYear: { [key: string]: any } = {
        company_id: tax_registration_number,
        ...getElementsByTagNames(
            doc.getElementsByTagName('Header')[0],
            ['FiscalYear', 'StartDate', 'EndDate', 'DateCreated']
        ),
        ...getElementsByTagNames(
            doc.getElementsByTagName('SalesInvoices')[0],
            ['NumberOfEntries']
        )
    }

    await insertFiscalYear(fiscalYear, res)

    /**
     * Insert Products
     */
    const product = doc.getElementsByTagName('Product');
    const products: KeyValue[] = []
    for (let i = 0; i < product.length; i++) {
        const p = getElementsByTagNames(product[i], ['ProductCode', 'ProductDescription'])
        products.push({
            company_id: tax_registration_number,
            fiscal_year: fiscalYear.fiscal_year,
            ...p
        })
    }

    await insertProducts(products, res)

    /**
     * Insert Customers
     */
    const customer = doc.getElementsByTagName('Customer');
    const customersByCustomerId: { [key: string]: string } = {}
    const customers: KeyValue[] = []
    for (let i = 0; i < customer.length; i++) {
        const billingAddress = getElementsByTagNames(
            customer[i].getElementsByTagName('BillingAddress')[0],
            ['AddressDetail', 'City', 'PostalCode', 'Country'],
            'billing'
        )
        const {customer_id, company_name, customer_tax_id} = getElementsByTagNames(customer[i], [
            'CustomerID', 'CompanyName', 'CustomerTaxID'
        ])
        customersByCustomerId[String(customer_id)] = String(customer_tax_id)
        customers.push({
            fiscal_year: fiscalYear.fiscal_year,
            company_id: tax_registration_number,
            company_name,
            customer_tax_id,
            ...billingAddress,
        })
    }

    await insertCustomers(customers, res)

    /**
     * Insert Invoices
     */
    const invoice = doc.getElementsByTagName('Invoice')
    const invoices: KeyValue[] = []
    const invoiceLines: { hash: string, line: Element }[] = []

    for (let i = 0; i < invoice.length; i++) {
        const {customer_id, hash, ...left} = getElementsByTagNames(invoice[i], [
            'Hash', 'InvoiceDate', 'CustomerID', 'NetTotal', 'GrossTotal'
        ])
        const documentTotals = getElementsByTagNames(
            invoice[i].getElementsByTagName('DocumentTotals')[0],
            ['TaxPayable', 'NetTotal', 'GrossTotal']
        )

        invoices.push({
            company_id: tax_registration_number,
            fiscal_year: fiscalYear.fiscal_year,
            customer_tax_id: customersByCustomerId[customer_id],
            hash: hash.trim(),
            ...left,
            ...documentTotals
        })

        invoiceLines.push({
            hash,
            line: invoice[i].getElementsByTagName('Line')[0]
        })
    }

    const fiscalYearMetadata: { [key: string]: any } = {
        company_id: companyMetadata.company_id,
        customers_count: customers.length,
        ...getElementsByTagNames(header, [
            'FiscalYear', 'StartDate',
            'EndDate', 'DateCreated'
        ]),
        ...getElementsByTagNames(
            doc.getElementsByTagName('SalesInvoices')[0],
            ['NumberOfEntries']
        )
    }

    const invoiceElement = doc.getElementsByTagName('Invoice');
    const invoices = []

    const invoiceLinesElements: { hash: string, line: Element }[] = []

    for (let i = 0; i < invoiceElement.length; i++) {
        const rawInvoice = invoiceElement[i]
        const {
            customer_id,
            ...left
        } = getElementsByTagNames(rawInvoice, [
            'Hash', 'InvoiceDate', 'CustomerID',
            'NetTotal', 'GrossTotal'
        ])

        const documentTotals = getElementsByTagNames(
            rawInvoice.getElementsByTagName('DocumentTotals')[0],
            ['TaxPayable', 'NetTotal', 'GrossTotal']
        )

        invoices.push({
            company_id: companyMetadata.company_id,
            fiscal_year: fiscalYearMetadata.fiscal_year,
            saft_customer_id: customer_id,
            ...left,
            ...documentTotals
        })

        const line = rawInvoice.getElementsByTagName('Line')[0]
        invoiceLinesElements.push({
            hash: left.hash,
            line
        })
    }

    const invoiceLines = []
    for (let i = 0; i < invoiceLinesElements.length; i++) {
        const {hash, line} = invoiceLinesElements[i]

        invoiceLines.push({
            invoice_hash: hash.trim(),
            company_id: companyMetadata.company_id,
            fiscal_year: fiscalYearMetadata.fiscal_year,
            credit_amount: line.getElementsByTagName('CreditAmount')[0]?.textContent ?? 0,
            debit_amount: line.getElementsByTagName('DebitAmount')[0]?.textContent ?? 0,
            ...getElementsByTagNames(line, ['ProductCode', 'Quantity', 'UnitPrice'])
        })
    }

    try {
        await Promise.all([
            // Insert Fiscal Year
            postgres.insertInto('fiscal_year')
                .values(fiscalYearMetadata)
                .onConflict(oc => oc
                    .columns(['fiscal_year', 'company_id'])
                    .doUpdateSet(fiscalYearMetadata)
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
            await postgres.insertInto('invoice')
                .values(invoices)
                .onConflict(oc => oc
                    .columns(['hash', 'fiscal_year', 'company_id'])
                    .doUpdateSet(eb => ({
                        hash: eb.ref('excluded.hash'),
                        fiscal_year: eb.ref('excluded.fiscal_year'),
                        company_id: eb.ref('excluded.company_id')
                    }))
                )
                .executeTakeFirstOrThrow(),

            // Insert Invoice Lines
            await postgres.insertInto('invoice_line')
                .values(invoiceLines)
                .executeTakeFirstOrThrow()
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