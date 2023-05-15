import type {NextApiRequest, NextApiResponse} from 'next'
import {parseStringPromise, processors} from 'xml2js'
import camelCase from 'lodash.camelcase'

const convertKeysToPlural = (name: string) => {
    const keys = ['customer', 'product', 'invoice', 'line']

    return keys.includes(name) ? `${name}s` : name;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean}>
) {
    const xml = req.body

    const parsedXml = await parseStringPromise(xml, {
        explicitRoot: true, // Let the root node be in the result object
        explicitArray: false, // Disable automatic array creation
        mergeAttrs: true, // Merge objects with the same key into an array
        trim: true, // Trim whitespaces
        tagNameProcessors: [
            camelCase,
            convertKeysToPlural
        ],
        valueProcessors: [
            processors.parseNumbers
        ],
    });

    const {customers, products} = parsedXml.auditFile.masterFiles
    const {invoices} = parsedXml.auditFile.sourceDocuments.salesInvoices

    const arrayCustomers = [...customers]
    const arrayInvoices = [...invoices]
    const arrayProducts = [...products]
    console.log(arrayCustomers, arrayInvoices, arrayProducts)

    res.status(200).json({ok: true})
}
