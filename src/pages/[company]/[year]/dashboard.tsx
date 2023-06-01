import {Grid} from "@tremor/react";

import Orders from "@sio/components/kpis/Orders";
import CustomerLifetimeValue from "@sio/components/kpis/CustomerLifetimeValue";
import AverageOrderValue from "@sio/components/kpis/AverageOrderValue";
import RepeatPurchaseRate from "@sio/components/kpis/RepeatPurchaseRate";

import CumulativeRevenueTrend from "@sio/components/charts/CumulativeRevenueTrend";
import RevenueByMonth from "@sio/components/charts/RevenueByMonth";
import Sales from "@sio/components/charts/Sales";
import RevenueByCountry from "@sio/components/charts/RevenueByCountry";
import RevenueByCity from "@sio/components/charts/RevenueByCity";
import RevenueOverTime from "@sio/components/charts/RevenueOverTime";
import TopCustomersByRevenue from "@sio/components/charts/TopCustomersByRevenue";

import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";

import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import YearSelector from "@sio/components/selectors/YearSelector";

export default function Dashboard({company, year}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const dashMarkup = (
        <div className="space-y-4">
            <Grid numCols={1} numColsLg={4} className="gap-6">
                <Orders company={company} year={year}/>
                <AverageOrderValue company={company} year={year}/>
                <CustomerLifetimeValue company={company} year={year}/>
                <RepeatPurchaseRate company={company} year={year}/>
            </Grid>
            <Grid numCols={1} numColsLg={3} className="gap-6">
                <div className="col-span-2">
                    <RevenueOverTime company={company} year={year}/>
                </div>
                <Sales company={company} year={year}/>
            </Grid>
            <Grid numCols={1} numColsLg={2} className="gap-6">
                <CumulativeRevenueTrend company={company} year={year}/>
                <RevenueByMonth company={company} year={year}/>
            </Grid>

            <Grid numCols={1} numColsLg={3} className="gap-6">
                <RevenueByCountry company={company} year={year}/>
                <RevenueByCity company={company} year={year}/>
                <TopCustomersByRevenue company={company} year={year}/>
            </Grid>
        </div>
    )

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <div className="flex justify-between">
                <Welcome company={company}/>
                <YearSelector company={company} year={year}/>
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

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    return {
        props: {
            company: params?.company || undefined,
            year: params?.year || undefined
        }
    }
}