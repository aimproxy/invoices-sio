import type {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Card, DateRangePicker, Dropdown, DropdownItem, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";

import {useCallback, useState} from "react";
import CumulativeRevenueTrend from "@sio/components/CumulativeRevenueTrend";
import AverageOrderValue from "@sio/components/AverageOrderValue";
import CustomerLifetimeValue from "@sio/components/CustomerLifetimeValue";
import RevenueBySegment from "@sio/components/RevenueBySegment";
import NetGrossMargin from "@sio/components/NetGrossMargin";
import TopProductsByRegion from "@sio/components/TopProductsByRegion";
import Sales from "@sio/components/Sales";
import SAFTDropzone from "@sio/components/SAFTDropzone";
import postgres from "@sio/postgres";

export default function Home({companies}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [selectedCompany, setSelectedCompany] = useState<string | undefined>()
    const [selectedView, setSelectedView] = useState("1");

    const setSelectedCompanyHandler = useCallback((value: string) => setSelectedCompany(value), []);

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
                                <DropdownItem value={company.company_name} text={company.company_name} key={k}/>
                            ))}
                        </Dropdown>
                        <DateRangePicker/>
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

interface CompanyWithFiscalYear extends Record<string, any> {
    company_id: number,
    company_name: string,
    fiscal_year: number,
    start_date: string,
    end_date: string
}

export const getServerSideProps: GetServerSideProps<{
    companies: CompanyWithFiscalYear[]
}> = async () => {
    const companies = await postgres
        .selectFrom('company')
        .innerJoin('fiscal_year', 'fiscal_year.company_id', 'company.company_id')
        .select([
            'company.company_id', 'company.company_name',
            'fiscal_year.fiscal_year', 'fiscal_year.start_date', 'fiscal_year.end_date'
        ])
        .execute();

    const serializedCompanies = companies.map((company) => ({
        ...company,
        start_date: company.start_date.toISOString(), // Convert to string
        end_date: company.end_date.toISOString() // Convert to string
    }));


    return {props: {companies: serializedCompanies}};
}