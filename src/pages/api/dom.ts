import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres, {InvoiceRaw} from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, e?: any }>
) {
    const xml = req.body

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const header = doc.getElementsByTagName('Header')[0];
    const companyMetadata = getElementsByTagNames(
        header, ['CompanyID', 'TaxRegistrationNumber', 'CompanyName', 'CurrencyCode']
    )

    const fiscalYearMetadata: { [key: string]: any } = {
        company_id: companyMetadata.company_id,
        ...getElementsByTagNames(header, ['FiscalYear', 'StartDate', 'EndDate', 'DateCreated'])
    }

    await postgres
        .insertInto('company')
        .values(companyMetadata)
        .onConflict(oc =>
            oc.column('tax_registration_number').doUpdateSet({
                tax_registration_number: companyMetadata.tax_registration_number
            })
        )
        .executeTakeFirstOrThrow()
        .catch(e => _handleErrorOverHTTP(res, e))

    const productMetadata = doc.getElementsByTagName('Product');
    const products = []
    for (let i = 0; i < productMetadata.length; i++) {
        const product = productMetadata[i];
        products.push({
            company_id: companyMetadata.company_id,
            ...getElementsByTagNames(
                product,
                ['ProductType', 'ProductCode', 'ProductDescription', 'ProductNumberCode']
            )
        })
    }

    const customers = doc.getElementsByTagName('Customer');
    const customersBeforeSQL = []
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];
        const billingAddressElement = customer.getElementsByTagName('BillingAddress')[0];
        const shipToAddressElement = customer.getElementsByTagName('ShipToAddress')[0];

        const {
            customer_id,
            customer_tax_id,
            self_billing_indicator,
            ...left
        } = getElementsByTagNames(customer, ['CustomerID', 'CompanyName', 'CustomerTaxID', 'SelfBillingIndicator'])

        customersBeforeSQL.push({
            saft_customer_id: customer_id,
            company_id: companyMetadata.company_id,
            customer_tax_id: Number(customer_tax_id),
            self_billing_indicator: Number(self_billing_indicator),
            ...left,
            ...getElementsByTagNames(billingAddressElement, ['AddressDetail', 'City', 'PostalCode', 'Country'], 'billing'),
            ...getElementsByTagNames(shipToAddressElement, ['AddressDetail', 'City', 'PostalCode', 'Country'], 'ship_to')
        })
    }

    const masterFilesInserts = await Promise.all([
        // Insert Fiscal Year
        postgres.insertInto('fiscal_year')
            .values(fiscalYearMetadata)
            .onConflict(oc => oc
                .column('fiscal_year')
                .doUpdateSet({
                    fiscal_year: fiscalYearMetadata.fiscal_year
                })
            )
            .executeTakeFirstOrThrow()
            .catch(e => _handleErrorOverHTTP(res, e)),

        // Insert Products
        postgres.insertInto('product')
            .values(products)
            .returning(['product_id', 'product_code'])
            .onConflict(oc => oc
                .column('product_code')
                .doUpdateSet(eb => ({
                    product_code: eb.ref('excluded.product_code')
                }))
            )
            .executeTakeFirstOrThrow()
            .catch(e => _handleErrorOverHTTP(res, e)),

        // Insert Customers
        postgres.insertInto('customer')
            .values(customersBeforeSQL)
            .returning(['customer_id'])
            .onConflict(oc => oc
                .column('customer_tax_id')
                .doUpdateSet(eb => ({
                    customer_tax_id: eb.ref('excluded.customer_tax_id')
                }))
            )
            .executeTakeFirstOrThrow()
            .catch(e => _handleErrorOverHTTP(res, e)),
    ])

    console.log(masterFilesInserts)

    const invoiceElement = doc.getElementsByTagName('Invoice');
    const invoices: InvoiceRaw[] = []

    for (let i = 0; i < invoiceElement.length; i++) {
        const rawInvoice = invoiceElement[i]
        const invoice = getElementsByTagNames(rawInvoice, [
            'InvoiceNo', 'ATCUD', 'InvoiceStatus',
            'InvoiceStatusDate', 'Hash', 'Period',
            'InvoiceDate', 'InvoiceType', 'SystemEntryDate',
            'CustomerID', 'TaxPayable', 'NetTotal', 'GrossTotal'
        ])

        const documentTotals = getElementsByTagNames(
            rawInvoice.getElementsByTagName('DocumentTotals')[0],
            ['TaxPayable', 'NetTotal', 'GrossTotal'])

        invoices.push({
            ...invoice,
            ...documentTotals
        })
    }


    /*
    await postgres.insertInto('invoice')
        .values(eb => ({
            invoice_no
        })) */

    /*
    subquery
        db.with('jennifer', (db) => db
      .selectFrom('person')
      .where('first_name', '=', 'Jennifer')
      .select(['id', 'first_name', 'gender'])
      .limit(1)
    ).insertInto('pet').values((eb) => ({
      owner_id: eb.selectFrom('jennifer').select('id'),
      name: eb.selectFrom('jennifer').select('first_name'),
      species: 'cat',
    }))

    const result = await db
    .insertInto('person')
    .values((eb) => ({
    first_name: 'Jennifer',
    last_name: sql`${'Ani'} || ${'ston'}`,
    middle_name: eb.ref('first_name'),
    age: eb.selectFrom('person').select(sql`avg(age)`),
    }))
    .executeTakeFirst()
     */

    res.status(200).json({ok: true})
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

const _handleErrorOverHTTP = (res: NextApiResponse, e: any) => res.status(400).json({ok: false, e})