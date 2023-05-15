import type {NextApiRequest, NextApiResponse} from 'next'
import {parseStringPromise, processors} from 'xml2js'
import camelCase from 'lodash.camelcase'

let xml = `
<AuditFile>
<MasterFiles>
<Customer>
<CustomerID>4</CustomerID>
<AccountID>Desconhecido</AccountID>
<CustomerTaxID>201356732</CustomerTaxID>
<CompanyName>Maria Cunha</CompanyName>
<BillingAddress>
<AddressDetail>Desconhecido</AddressDetail>
<City>Ermesinde</City>
<PostalCode>4445-271</PostalCode>
<Country>PT</Country>
</BillingAddress>
<ShipToAddress>
<AddressDetail>Desconhecido</AddressDetail>
<City>Ermesinde</City>
<PostalCode>4445-271</PostalCode>
<Country>PT</Country>
</ShipToAddress>
<SelfBillingIndicator>0</SelfBillingIndicator>
</Customer>
<Customer>
<CustomerID>5</CustomerID>
<AccountID>Desconhecido</AccountID>
<CustomerTaxID>234924675</CustomerTaxID>
<CompanyName>Matias Dias</CompanyName>
<BillingAddress>
<AddressDetail>Desconhecido</AddressDetail>
<City>Alfena</City>
<PostalCode>4445-267</PostalCode>
<Country>PT</Country>
</BillingAddress>
<ShipToAddress>
<AddressDetail>Desconhecido</AddressDetail>
<City>Alfena</City>
<PostalCode>4445-267</PostalCode>
<Country>PT</Country>
</ShipToAddress>
<SelfBillingIndicator>0</SelfBillingIndicator>
</Customer>
</MasterFiles>
<SourceDocuments>
<SalesInvoices>
<Invoice>
<InvoiceNo>FT 2023/1</InvoiceNo>
<ATCUD>0-1</ATCUD>
<DocumentStatus>
<InvoiceStatus>N</InvoiceStatus>
<InvoiceStatusDate>2023-02-20T16:31:46</InvoiceStatusDate>
<SourceID>27257</SourceID>
<SourceBilling>P</SourceBilling>
</DocumentStatus>
<Hash>
lzFGGiI0+mfoCqlfhHdOCEXTazdUDOtBxNpDO7j5nr3osO7OFnllG7I/MaCgGpsWIRji+1clrcLr+rIZqhVcIs6uJRlwZpmMKzIIBu0teIr9S8jj0I1bsx753i/5RbIOLGszma74+F6WUItTaFkuTewv+oLxPOgCdxCu2ZNQVNU=
</Hash>
<HashControl>1</HashControl>
<Period>1</Period>
<InvoiceDate>2022-01-03</InvoiceDate>
<InvoiceType>FT</InvoiceType>
<SpecialRegimes>
<SelfBillingIndicator>0</SelfBillingIndicator>
<CashVATSchemeIndicator>0</CashVATSchemeIndicator>
<ThirdPartiesBillingIndicator>0</ThirdPartiesBillingIndicator>
</SpecialRegimes>
<SourceID>27257</SourceID>
<SystemEntryDate>2023-02-20T16:31:46</SystemEntryDate>
<CustomerID>3</CustomerID>
<Line>
<LineNumber>1</LineNumber>
<ProductCode>111111111</ProductCode>
<ProductDescription>Reparação Mackbook</ProductDescription>
<Quantity>4.00</Quantity>
<UnitOfMeasure>un</UnitOfMeasure>
<UnitPrice>250.00000</UnitPrice>
<TaxPointDate>2022-01-03</TaxPointDate>
<Description>Reparação Mackbook</Description>
<CreditAmount>1000.00</CreditAmount>
<Tax>
<TaxType>IVA</TaxType>
<TaxCountryRegion>PT</TaxCountryRegion>
<TaxCode>NOR</TaxCode>
<TaxPercentage>23</TaxPercentage>
</Tax>
</Line>
<Line>
<LineNumber>2</LineNumber>
<ProductCode>111111111</ProductCode>
<ProductDescription>Reparação Mackbook</ProductDescription>
<Quantity>4.00</Quantity>
<UnitOfMeasure>un</UnitOfMeasure>
<UnitPrice>250.00000</UnitPrice>
<TaxPointDate>2022-01-03</TaxPointDate>
<Description>Reparação Mackbook</Description>
<CreditAmount>1000.00</CreditAmount>
<Tax>
<TaxType>IVA</TaxType>
<TaxCountryRegion>PT</TaxCountryRegion>
<TaxCode>NOR</TaxCode>
<TaxPercentage>23</TaxPercentage>
</Tax>
</Line>
<DocumentTotals>
<TaxPayable>230.0</TaxPayable>
<NetTotal>1000.00</NetTotal>
<GrossTotal>1230.00</GrossTotal>
</DocumentTotals>
</Invoice>
</SalesInvoices>
</SourceDocuments>
</AuditFile>
`

const convertKeysToPlural = (name: string) => {
    const keys = ['customer', 'product', 'invoice', 'line']

    return keys.includes(name) ? `${name}s` : name;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

    const arrayInvoices = !Array.isArray(invoices) ? [invoices] : invoices
    const invoiceLinesWithId = []

    for (const invoice of arrayInvoices) {
        if (!Array.isArray(invoice.lines)) {
            invoiceLinesWithId.push({
                invoiceId: invoice.invoiceNo,
                ...invoice.lines
            })
        }

        for (const line of invoice.lines) {
            invoiceLinesWithId.push({
                invoiceId: invoice.invoiceNo,
                ...line
            })
        }
    }

    res.status(200).json({customers, products, arrayInvoices, invoiceLinesWithId})
}
