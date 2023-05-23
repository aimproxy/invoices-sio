import type {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Card, Dropdown, DropdownItem, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";

import {useCallback, useMemo, useState} from "react";
import CumulativeRevenueTrend from "@sio/components/CumulativeRevenueTrend";
import AverageOrderValue from "@sio/components/AverageOrderValue";
import CustomerLifetimeValue from "@sio/components/CustomerLifetimeValue";
import RevenueBySegment from "@sio/components/RevenueBySegment";
import NetGrossMargin from "@sio/components/NetGrossMargin";
import TopProductsByRegion from "@sio/components/TopProductsByRegion";
import Sales from "@sio/components/Sales";
import SAFTDropzone from "@sio/components/SAFTDropzone";
import postgres from "@sio/postgres";

export default function Home({companies, years}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [selectedView, setSelectedView] = useState("1");

    const [selectedCompany, setSelectedCompany] = useState(companies[0].companyId)

    const companyYears = useMemo(() => years[selectedCompany], [selectedCompany, years])
    const [selectedFiscalYear, setSelectedFiscalYear] = useState(companyYears[0].fiscalYear)

    const setSelectedCompanyHandler = useCallback((value: string) => setSelectedCompany(value), []);
    const setSelectedFiscalYearHandler = useCallback((value: string) => setSelectedFiscalYear(value), []);


    const headerMarkup = (
        <div className="block sm:flex sm:justify-between">
            <div>
                <Title>Olá, {selectedCompany ?? 'Demo'}!</Title>
                <Text>Aqui o especialista és sempre tu!</Text>
            </div>
            <div className="flex flex-row space-x-4 mt-4 sm:mt-0">
                {selectedView == "1" && (
                    <>
                        <Dropdown
                            value={selectedCompany}
                            onValueChange={setSelectedCompanyHandler}
                            placeholder="Select Company"
                        >
                            {companies.map((company, k) => (
                                <DropdownItem value={company.companyId} text={company.companyName} key={k}/>
                            ))}
                        </Dropdown>
                        <Dropdown
                            value={selectedFiscalYear}
                            onValueChange={setSelectedFiscalYearHandler}
                            placeholder="Select Fiscal Year">
                            {companyYears.map((year, k) => (
                                <DropdownItem value={year.fiscalYear} text={year.fiscalYear} key={k}/>
                            ))}
                        </Dropdown>
                    </>
                )}
            </div>
        </div>
    )

    return (
        <main className={"max-w-[90rem] mx-auto pt-16 sm:pt-8 px-8"}>
            {headerMarkup}
            <TabList
                defaultValue="1"
                onValueChange={(value) => setSelectedView(value)}
                className="mt-6"
            >
                <Tab value="1" text="Dashboard"/>
                <Tab value="2" text="Importar SAF-T"/>
            </TabList>

            {selectedView === "1" ? (
                <div className="mt-6 mb-8 gap-6">
                    <Grid numCols={1} numColsLg={5} className="gap-6">
                        <AverageOrderValue/>
                        <CustomerLifetimeValue/>
                        <Sales/>
                        <NetGrossMargin/>
                        <CumulativeRevenueTrend/>
                        <TopProductsByRegion/>
                        <Card className={"col-span-2"}>
                            <Text>Title</Text>
                            <Metric>KPI 6</Metric>
                        </Card>
                        <RevenueBySegment/>
                        <Card className={"col-span-3"}>
                            <Text>Title</Text>
                            <Metric>KPI 7</Metric>
                        </Card>
                        <Card className={"col-span-2"}>
                            <Text>Title</Text>
                            <Metric>KPI 8</Metric>
                        </Card>
                    </Grid>
                </div>
            ) : (
                <SAFTDropzone/>
            )}
        </main>
    );
}

type FiscalYearDict = { [key: string]: { fiscalYear: string; startDate: string; endDate: string }[] }

export const getServerSideProps: GetServerSideProps<{
    companies: { companyId: string, companyName: string }[],
    years: FiscalYearDict
}> = async () => {
    const sql = await postgres
        .selectFrom('company')
        .innerJoin('fiscal_year', 'fiscal_year.company_id', 'company.company_id')
        .select([
            'company.company_id', 'company.company_name',
            'fiscal_year.fiscal_year', 'fiscal_year.start_date', 'fiscal_year.end_date'
        ])
        .execute();

    const years = sql.reduce((result, company) => {
        const {company_id, fiscal_year, start_date, end_date} = company;

        if (!result[company_id]) {
            result[company_id] = [];
        }

        result[company_id].push({
            startDate: start_date.toISOString(),
            endDate: end_date.toISOString(),
            fiscalYear: fiscal_year
        });

        return result;
    }, {} as FiscalYearDict);

    const companies = Array.from(new Set(sql.map(company => ({
        companyId: company.company_id,
        companyName: company.company_name
    }))));

    return {props: {companies, years}};
}