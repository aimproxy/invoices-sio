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

import {KpisContext} from "@sio/components/KpisProvider";
import {useContext} from "react";

export default function Dashboard() {
    const router = useRouter()
    const {selectedCompany} = useContext(KpisContext)

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
                    <Title>Olá, {selectedCompany?.company_name}!</Title>
                    <Text>Aqui o especialista és sempre tu!</Text>
                </div>
                <YearSelector/>
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