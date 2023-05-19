import type {NextApiRequest, NextApiResponse} from 'next'
import {parseStringPromise, processors} from 'xml2js'
import postgres, {CustomerRaw, InvoiceLineRaw, InvoiceRaw, ProductRaw} from "@sio/postgres";

function convertKeysToLowercase(obj: any) {
    const convertedObj: any = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const split = key.split(/(?<=[a-z])(?=[A-Z])/)
            const lowercaseKey = split.join('_').toLowerCase()
            convertedObj[lowercaseKey] = obj[key];
        }
    }
    return convertedObj;
}


function mockCustomerTable(customer: SAFTCustomer): CustomerRaw {
    const {
        BillingAddress,
        ShipToAddress,
        ...left
    } = customer;

    const {
        AddressDetail: BillingAddressDetail,
        City: BillingCity,
        PostalCode: BillingPostalCode,
        Country: BillingCountry,
    } = BillingAddress

    const {
        AddressDetail: ShipToAddressDetail,
        City: ShipToCity,
        PostalCode: ShipToPostalCode,
        Country: ShipToCountry,
    } = ShipToAddress

    const beforeSQL = {
        BillingAddressDetail,
        BillingCity,
        BillingPostalCode,
        BillingCountry,
        ShipToAddressDetail,
        ShipToCity,
        ShipToPostalCode,
        ShipToCountry,
        ...left
    }

    return convertKeysToLowercase(beforeSQL)
}

function mockProductTable(product: SAFTProduct, i: number): ProductRaw {
    return {
        product_id: i,
        ...convertKeysToLowercase(product)
    }
}

function mockInvoiceTable(invoice: SAFTInvoice, i: number): InvoiceRaw {

    const {
        SpecialRegimes,
        DocumentTotals,
        DocumentStatus,
        // Ignore invoice lines (DO NOT DELETE)
        Line,
        ...left
    } = invoice

    return {
        invoice_id: i,
        ...convertKeysToLowercase(SpecialRegimes),
        ...convertKeysToLowercase(DocumentTotals),
        ...convertKeysToLowercase(DocumentStatus),
        ...convertKeysToLowercase(left) // this object does no longer contain invoice lines
    }
}

function mockInvoiceLineTable(invoiceLine: { InvoiceId: number } & SAFTInvoiceLine, i: number): InvoiceLineRaw {
    // references are not needed !!!!
    // @ts-ignore
    delete invoiceLine.References
    // @ts-ignore
    delete invoiceLine.Tax


    return {
        line_id: i,
        ...convertKeysToLowercase(invoiceLine)
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ ok: boolean, sql: any }>
) {
    const xml = req.body

    const parsedXml: { AuditFile: SAFT } = await parseStringPromise(xml, {
        explicitRoot: true, // Let the root node be in the result object
        explicitArray: false, // Disable automatic array creation
        mergeAttrs: true, // Merge objects with the same key into an array
        trim: true, // Trim space
        valueProcessors: [processors.parseNumbers],
    });

    const {
        // Even if we type the XML, this can still be Customer or Customer[]
        Customer: customerOrArray,
        Product: productOrArray
    } = parsedXml.AuditFile.MasterFiles
    const customers = customerOrArray.map(mockCustomerTable)
    const products = productOrArray.map(mockProductTable)

    const invoiceOrArray = parsedXml.AuditFile.SourceDocuments.SalesInvoices.Invoice
    const invoices = invoiceOrArray.map(mockInvoiceTable)

    const invoiceLineOrArray: ({
        InvoiceId: number
    } & SAFTInvoiceLine)[] = parsedXml.AuditFile.SourceDocuments.SalesInvoices.Invoice.flatMap(
        (invoice, i) =>
            Array.isArray(invoice.Line) ?
                invoice.Line.map(invoiceLine => ({
                    InvoiceId: i,
                    ...invoiceLine
                })) : ({InvoiceId: i, ...invoice.Line}))

    const invoiceLines = invoiceLineOrArray.map(mockInvoiceLineTable)

    const promises = await Promise.all([
        postgres.insertInto('customer').values(customers).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
        postgres.insertInto('product').values(products).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
        postgres.insertInto('invoice').values(invoices).onConflict(ocb => ocb.doNothing()).executeTakeFirst(),
    ])

    promises.push(await postgres.insertInto('invoice_line').values(invoiceLines).onConflict(ocb => ocb.doNothing()).executeTakeFirst())

    res.status(200).json({ok: true, sql: promises})
}

interface SAFT {
    Header: {
        AuditFileVersion: string;
        CompanyID: string;
        TaxRegistrationNumber: string;
        TaxAccountingBasis: string;
        CompanyName: string;
        BusinessName: string;
        CompanyAddress: Address;
        FiscalYear: string;
        StartDate: string;
        EndDate: string;
        CurrencyCode: string;
        DateCreated: string;
        TaxEntity: string;
        ProductCompanyTaxID: string;
        SoftwareCertificateNumber: string;
        ProductID: string;
        ProductVersion: string;
    };
    MasterFiles: {
        Customer: SAFTCustomer[];
        Product: SAFTProduct[];
        TaxTable: SAFTTaxTableEntry[];
    };
    SourceDocuments: {
        SalesInvoices: { Invoice: SAFTInvoice[] },
        MovementOfGoods: {
            NumberOfMovementLines: number;
            TotalQuantityIssued: number;
        },
        WorkingDocuments: {
            NumberOfEntries: number;
            TotalDebit: number;
            TotalCredit: number;
        }, Payments: {
            NumberOfEntries: number;
            TotalDebit: number;
            TotalCredit: number;
        }
    }
}

interface Address {
    AddressDetail: string;
    City: string;
    PostalCode: string;
    Country: string;
}

export interface SAFTCustomer {
    CustomerID: number;
    AccountID: string;
    CustomerTaxID: number;
    CompanyName: string;
    BillingAddress: Address;
    ShipToAddress: Address;
    SelfBillingIndicator: number;
}

interface SAFTProduct {
    ProductType: string;
    ProductCode: string;
    ProductDescription: string;
    ProductNumberCode: string;
}

interface SAFTTaxTableEntry {
    TaxType: string;
    TaxCountryRegion: string;
    TaxCode: string;
    Description: string;
    TaxPercentage: number;
}

interface SAFTInvoice {
    InvoiceNo: string;
    ATCUD: string;
    DocumentStatus: {
        InvoiceStatus: string;
        InvoiceStatusDate: string;
        SourceID: string;
        SourceBilling: string;
    };
    Hash: string;
    HashControl: string;
    Period: string;
    InvoiceDate: string;
    InvoiceType: string;
    SpecialRegimes: {
        SelfBillingIndicator: number;
        CashVATSchemeIndicator: number;
        ThirdPartiesBillingIndicator: number;
    };
    SourceID: string;
    SystemEntryDate: string;
    CustomerID: number;
    Line: SAFTInvoiceLine[] | SAFTInvoiceLine;
    DocumentTotals: {
        TaxPayable: number;
        NetTotal: string;
        GrossTotal: string;
    };
}

interface SAFTInvoiceLine {
    LineNumber: number;
    ProductCode: string;
    ProductDescription: string;
    Quantity: number;
    UnitOfMeasure: string;
    UnitPrice: string;
    TaxPointDate: string;
    References: {
        Reference: string;
    };
    Description: string;
    DebitAmount?: string;
    CreditAmount?: string;
    Tax: {
        TaxType: string;
        TaxCountryRegion: string;
        TaxCode: string;
        TaxPercentage: number;
    };
}

