import {NextApiRequest, NextApiResponse} from 'next';
import {DOMParser} from 'xmldom';
import postgres, {ProductRaw} from "@sio/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, pg: any }>
) {
    const xml = req.body

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    const products = doc.getElementsByTagName('Product');

    const productsBeforeSQL: ProductRaw[] = []
    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const productType = product.getElementsByTagName('ProductType')[0].textContent!;
        const productCode = product.getElementsByTagName('ProductCode')[0].textContent!;
        const productDescription = product.getElementsByTagName('ProductDescription')[0].textContent!;
        const productNumberCode = product.getElementsByTagName('ProductNumberCode')[0].textContent!;

        productsBeforeSQL.push({
            product_type: productType,
            product_code: productCode,
            product_description: productDescription,
            product_number_code: productNumberCode
        })
    }

    const pg = await Promise.all([
        postgres.insertInto('product').values(productsBeforeSQL).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
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