import type {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Card, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";
import postgres from "@sio/postgres";
import {useState} from "react";
import {Company, FiscalYear} from "@sio/types";

import SAFTDropzone from "@sio/components/SAFTDropzone";
import CompanyAndYearSelector from "@sio/components/selectors/CompanyAndYearSelector";

import CustomerLifetimeValue from "@sio/components/kpis/CustomerLifetimeValue";
import AverageOrderValue from "@sio/components/kpis/AverageOrderValue";
import RepeatPurchaseRate from "@sio/components/kpis/RepeatCustomerRate";

import NetGrossMargin from "@sio/components/charts/NetGrossMargin";
import CumulativeRevenueTrend from "@sio/components/charts/CumulativeRevenueTrend";
import RevenueBySegment from "@sio/components/charts/RevenueBySegment";
import Sales from "@sio/components/charts/Sales";
import SalesByCountry from "@sio/components/charts/SalesByCountry";
import SalesByCity from "@sio/components/charts/SalesByCity";
import RevenueOverTime from "@sio/components/charts/RevenueOverTime";

export default function Home({companies, years}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [selectedView, setSelectedView] = useState("1");

    const headerMarkup = (
        <div className="block sm:flex sm:justify-between">
            <div>
                <Title>Olá, demo!</Title>
                <Text>Aqui o especialista és sempre tu!</Text>
            </div>
            <div className="flex flex-row space-x-4 mt-4 sm:mt-0">
                {(selectedView == "1" && companies.length > 0) &&
                    <CompanyAndYearSelector companies={companies} years={years}/>}
            </div>
        </div>
    )

    const dashMarkup = (
        <div className="space-y-4">
            <Grid numCols={1} numColsLg={5} className="gap-6">
                <AverageOrderValue/>
                <CustomerLifetimeValue/>
                <RepeatPurchaseRate/>
                <div className={"col-span-2"}>
                    <NetGrossMargin/>
                </div>
            </Grid>
            <Grid numCols={1} numColsLg={3} className="gap-6">
                <div className={"col-span-2"}>
                    <CumulativeRevenueTrend/>
                </div>
                <Sales/>
            </Grid>
            <Grid numCols={1} numColsLg={2} className="gap-6">
                <RevenueOverTime/>
                <RevenueBySegment/>
            </Grid>
            <Grid numCols={1} numColsLg={3} className="gap-6">
                <SalesByCountry/>
                <SalesByCity/>
                <Card>
                    <Text>Title</Text>
                    <Metric>KPI 7</Metric>
                </Card>
            </Grid>
        </div>
    )

    const emptyMarkup = (
        <Card className="mt-6 h-96 flex flex-col justify-center items-center text-center">
            <p className="text-6xl">🚧</p>
            <h2 className="text-slate-700 text-xl font-extrabold mt-3 md:mt-5">There isn{'\''}t any data yet!</h2>
            <p className="max-w-xl mx-auto text-slate-500 mt-3 md:mt-5 font-normal text-base sm:text-lg">
                You can start by import a SAF-T XML file from the Portuguese Tax Authority
                under the {'\"'}Import SAF-T{'\!'} tab ☝️!
            </p>
        </Card>
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
                    {companies.length > 0 ? dashMarkup : emptyMarkup}
                </div>
            ) : (
                <SAFTDropzone/>
            )}
        </main>
    );
}

export const getServerSideProps: GetServerSideProps<{
    companies: Company[],
    years: { [key: string]: FiscalYear[] }
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
            startDate: start_date.toString(),
            endDate: end_date.toString(),
            fiscalYear: fiscal_year
        });

        return result;
    }, {} as { [key: string]: FiscalYear[] });

    const companies = Array.from(new Set(sql.map(company => ({
        companyId: company.company_id,
        companyName: company.company_name
    }))));

    return {props: {companies, years}};
}