import type {GetServerSideProps} from 'next';
import {Card, Grid, Metric, Tab, TabList, Text} from "@tremor/react";
import {useMemo, useState} from "react";

import SAFTDropzone from "@sio/components/SAFTDropzone";

import CustomerLifetimeValue from "@sio/components/kpis/CustomerLifetimeValue";
import AverageOrderValue from "@sio/components/kpis/AverageOrderValue";
import RepeatPurchaseRate from "@sio/components/kpis/RepeatCustomerRate";

import CumulativeRevenueTrend from "@sio/components/charts/CumulativeRevenueTrend";
import RevenueBySegment from "@sio/components/charts/RevenueBySegment";
import Sales from "@sio/components/charts/Sales";
import SalesByCountry from "@sio/components/charts/SalesByCountry";
import SalesByCity from "@sio/components/charts/SalesByCity";
import RevenueOverTime from "@sio/components/charts/RevenueOverTime";
import KpisProvider from "@sio/components/KpisProvider";
import Welcome from "@sio/components/Welcome";

import CompanySelector from "@sio/components/selectors/CompanySelector";
import YearSelector from "@sio/components/selectors/YearSelector";

import {dehydrate, QueryClient, useQueries} from "@tanstack/react-query";
import {CompanyReturnType, YearsReturnType} from "@sio/query";
import RunCalculationsButton from "@sio/components/buttons/RunCalculationsButton";

const fetchCompanies = async (): Promise<CompanyReturnType> => {
    const res = await fetch('http://localhost:3000/api/companies')
    return await res.json();
}

const fetchYears = async (): Promise<YearsReturnType> => {
    const res = await fetch('http://localhost:3000/api/years')
    return await res.json();
}

export default function Home() {
    const [selectedView, setSelectedView] = useState("1");

    const [companiesRequest, yearsRequest] = useQueries({
            queries: [
                {
                    queryKey: ['companies'],
                    queryFn: fetchCompanies,
                },
                {
                    queryKey: ['years'],
                    queryFn: fetchYears
                }
            ],
        }
    )

    const {
        data: companies,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies
    } = companiesRequest

    const {
        data: years,
        isLoading: isLoadingYears,
        isError: isErrorYears
    } = yearsRequest

    const memoizedYears = useMemo(() => {
        return years?.reduce((result, company) => {
            const {company_id, ...left} = company;

            if (!result[company_id]) {
                result[company_id] = [];
            }

            result[company_id].push({company_id, ...left});

            return result;
        }, {} as { [key: string]: YearsReturnType });
    }, [years])

    const headerMarkup = (
        <div className="block sm:flex sm:justify-between">
            <Welcome/>
            <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
                <CompanySelector companies={companies}
                                 loading={isLoadingCompanies}
                                 disabled={isErrorCompanies}/>

                <YearSelector years={memoizedYears}
                              loading={isLoadingYears}
                              disabled={isErrorYears}/>

                <RunCalculationsButton/>
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
                    <Card/>
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

    return (
        <KpisProvider>
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
                        {dashMarkup}
                    </div>
                ) : (
                    <SAFTDropzone/>
                )}
            </main>
        </KpisProvider>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['companies'], fetchCompanies)
    await queryClient.prefetchQuery(['years'], fetchYears)

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}