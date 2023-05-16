import type {NextApiRequest, NextApiResponse} from 'next'
import {parseStringPromise, processors} from 'xml2js'
import postgres, {CustomerRaw, ProductRaw} from "@sio/postgres";

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

    const {Customer, Product} = parsedXml.AuditFile.MasterFiles
    const customers = Customer.map(mockCustomerTable)
    const products = Product.map(mockProductTable)

    const promises = await Promise.all([
        postgres.insertInto('customer').values(customers).executeTakeFirst(),
        postgres.insertInto('product').values(products).executeTakeFirst(),
    ])

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
        SalesInvoices: SAFTInvoice[],
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
    Line: {
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
        DebitAmount: string;
        Tax: {
            TaxType: string;
            TaxCountryRegion: string;
            TaxCode: string;
            TaxPercentage: number;
        };
    };
    DocumentTotals: {
        TaxPayable: number;
        NetTotal: string;
        GrossTotal: string;
    };
}


