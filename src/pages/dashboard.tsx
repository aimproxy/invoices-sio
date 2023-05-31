import {Grid} from "@tremor/react";
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
import Orders from "@sio/components/kpis/Orders";
import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";
import TopCustomersByRevenue from "@sio/components/charts/TopCustomersByRevenue";

export default function Dashboard() {
    const router = useRouter()
    const {selectedCompany} = useContext(KpisContext)

    const dashMarkup = (
        <div className="space-y-4">
            <Grid numCols={1} numColsLg={4} className="gap-6">
                <Orders/>
                <AverageOrderValue/>
                <CustomerLifetimeValue/>
                <RepeatPurchaseRate/>
            </Grid>
            <Grid numCols={1} numColsLg={3} className="gap-6">
                <div className={"col-span-2"}>
                    <RevenueOverTime/>
                </div>
                <Sales/>
            </Grid>
            <Grid numCols={1} numColsLg={2} className="gap-6">
                <CumulativeRevenueTrend/>
                <RevenueBySegment/>
            </Grid>

            <Grid numCols={1} numColsLg={3} className="gap-6">
                <SalesByCountry/>
                <SalesByCity/>
                <TopCustomersByRevenue/>
            </Grid>
        </div>
    )

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <div className="flex justify-between">
                <Welcome/>
                <YearSelector/>
            </div>
            <Tabs tabs={[
                {route: 'dashboard', name: 'Dashboard'},
                {route: 'customers', name: 'Customers'},
                {route: 'products', name: 'Products'}
            ]}/>

            <div className="mt-6 mb-8 gap-6">
                {dashMarkup}
            </div>
        </main>
    );
}