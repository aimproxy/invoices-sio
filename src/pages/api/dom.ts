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

    const products = doc.getElementsByTagName('Product');
    const productsBeforeSQL = []
    for (let i = 0; i < products.length; i++) {
        productsBeforeSQL.push(getElementsByTagNames(
            products[i],
            ['ProductType', 'ProductCode', 'ProductDescription', 'ProductNumberCode'])
        )
    }
    console.log(productsBeforeSQL)

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
        taxTableBeforeSQL.push(
            getElementsByTagNames(
                taxTable[i],
                ['TaxType', 'TaxCountryRegion', 'TaxCode', 'Description', 'TaxPercentage']
            )
        )
    }


    const pg = await Promise.all([
        postgres.insertInto('product').values(productsBeforeSQL).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
        postgres.insertInto('customer').values(customersBeforeSQL).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
        postgres.insertInto('tax_entry').values(taxTableBeforeSQL).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
    ])

    const invoices = doc.getElementsByTagName('Invoice');
    for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i];

        const lines = invoice.getElementsByTagName('Line');
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