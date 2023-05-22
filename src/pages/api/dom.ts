import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres, {CustomerRaw} from "@sio/postgres";

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
    const customersBeforeSQL: CustomerRaw[] = []
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i];

        const customerTaxId = Number(customer.getAttribute('CustomerTaxID'));
        const companyElement = customer.getElementsByTagName('CompanyName')[0];
        const companyName = companyElement.textContent;

        const billingAddressElement = customer.getElementsByTagName('BillingAddress')[0];
        const billingAddressDetail = billingAddressElement.getElementsByTagName('AddressDetail')[0].textContent;
        const billingCity = billingAddressElement.getElementsByTagName('City')[0].textContent;
        const billingPostalCode = billingAddressElement.getElementsByTagName('PostalCode')[0].textContent;
        const billingCountry = billingAddressElement.getElementsByTagName('Country')[0].textContent;

        const shipToAddressElement = customer.getElementsByTagName('ShipToAddress')[0];
        const shipToAddressDetail = shipToAddressElement.getElementsByTagName('AddressDetail')[0].textContent;
        const shipToCity = shipToAddressElement.getElementsByTagName('City')[0].textContent;
        const shipToPostalCode = shipToAddressElement.getElementsByTagName('PostalCode')[0].textContent;
        const shipToCountry = shipToAddressElement.getElementsByTagName('Country')[0].textContent;

        const selfBillingIndicator = Number(customer.getElementsByTagName('SelfBillingIndicator')[0].textContent);

        customersBeforeSQL.push({
            customer_tax_id: customerTaxId,
            company_name: companyName!,
            billing_address_detail: billingAddressDetail!,
            billing_city: billingCity!,
            billing_postal_code: billingPostalCode!,
            billing_country: billingCountry!,
            ship_to_address_detail: shipToAddressDetail!,
            ship_to_city: shipToCity!,
            ship_to_postal_code: shipToPostalCode!,
            ship_to_country: shipToCountry!,
            self_billing_indicator: selfBillingIndicator!,
        });
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

const getElementsByTagNames = (element: Element, tags: string[]) => {
    const serializedTags: { [key: string]: string } = {};

    tags.forEach(tag => {
        const serializedTagName = tag
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();

        serializedTags[serializedTagName] = element.getElementsByTagName(tag)[0].textContent!;
    });

    return serializedTags;
}

const getCustomerByTaxId = (taxId: number) => {
    return postgres.selectFrom('customer')
        .select('customer_id')
        .where('customer_tax_id', '=', taxId)
        .executeTakeFirst()
}