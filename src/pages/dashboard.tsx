import type {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Card, Grid, Metric, Tab, TabList, Text} from "@tremor/react";
import {useState} from "react";

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

import YearSelector from "@sio/components/selectors/YearSelector";

import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {YearsReturnType} from "@sio/query";
import RunCalculationsButton from "@sio/components/buttons/RunCalculationsButton";

const fetchYears = async (company: string): Promise<YearsReturnType> => {
    const res = await fetch(`http://localhost:3000/api/years?company=${company}`)
    return await res.json();
}

export default function Dashboard({company}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [selectedView, setSelectedView] = useState("1");

    const {
        data: years,
        isLoading: isLoadingYears,
        isError: isErrorYears
    } = useQuery({
            queryKey: ['years', company],
            queryFn: async () => await fetchYears(company)
        }
    )

    const headerMarkup = (
        <div className="block sm:flex sm:justify-between">
            <Welcome/>
            <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
                <YearSelector years={years} loading={isLoadingYears} disabled={isErrorYears}/>
                <RunCalculationsButton company={company}/>
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

    const customersMarkup = (
        <>X</>
    )

    return (
        <KpisProvider defaultYear={years?.[0]}>
            <main className={"max-w-6xl mx-auto pt-16 sm:pt-8 px-8"}>
                {headerMarkup}
                <TabList
                    defaultValue="1"
                    onValueChange={(value) => setSelectedView(value)}
                    className="mt-6"
                >
                    <Tab value="1" text="Dashboard"/>
                    <Tab value="2" text="Customers"/>
                    <Tab value="3" text="Importar SAF-T"/>
                </TabList>

                <div className="mt-6 mb-8 gap-6">
                    {selectedView == "1" && <>{dashMarkup}</>}
                    {selectedView == "2" && <>{customersMarkup}</>}
                    {selectedView == "3" && <SAFTDropzone/>}
                </div>
            </main>
        </KpisProvider>
    );
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const {company} = query

    if (company == undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(
        ['years', company],
        async () => await fetchYears(String(company)))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            company: String(company)
        },
    }
}