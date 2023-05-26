import type {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import {Card, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";
import {useRouter} from "next/router";

import CustomerLifetimeValue from "@sio/components/kpis/CustomerLifetimeValue";
import AverageOrderValue from "@sio/components/kpis/AverageOrderValue";
import RepeatPurchaseRate from "@sio/components/kpis/RepeatPurchaseRate";

import CumulativeRevenueTrend from "@sio/components/charts/CumulativeRevenueTrend";
import RevenueBySegment from "@sio/components/charts/RevenueBySegment";
import Sales from "@sio/components/charts/Sales";
import SalesByCountry from "@sio/components/charts/SalesByCountry";
import SalesByCity from "@sio/components/charts/SalesByCity";
import RevenueOverTime from "@sio/components/charts/RevenueOverTime";

import YearSelector from "@sio/components/selectors/YearSelector";

import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {YearsReturnType} from "@sio/query";
import {KpisContext} from "@sio/components/KpisProvider";
import {useContext, useEffect} from "react";

const fetchYears = async (company: string): Promise<YearsReturnType> => {
    const res = await fetch(`/api/years?company=${company}`)
    return await res.json();
}

export default function Dashboard({company}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const {setSelectedYear} = useContext(KpisContext)

    const {
        data: years,
        isLoading,
        isError
    } = useQuery(['years', company], {
        queryFn: async () => await fetchYears(company),
    })

    useEffect(() => {
        if (!isLoading && !isError) {
            setSelectedYear(years[0])
        }
    }, [isLoading, isError, setSelectedYear, years])

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
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <div className="block sm:flex sm:justify-between">
                <div className="flex flex-col">
                    <Title>Olá, {company}!</Title>
                    <Text>Aqui o especialista és sempre tu!</Text>
                </div>
                <YearSelector company={company}
                              years={years}
                              loading={isLoading}
                              disabled={isError}/>
            </div>
            <TabList
                value={router.route.replace('/', '')}
                onValueChange={(value) => router.push({
                    pathname: value,
                    query: router.query,
                })}
                className="mt-6"
            >
                <Tab value="dashboard" text="Dashboard"/>
                <Tab value="customers" text="Customers"/>
            </TabList>

            <div className="mt-6 mb-8 gap-6">
                {dashMarkup}
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps<{ company: string }> = async ({query}) => {
    const {company} = query

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