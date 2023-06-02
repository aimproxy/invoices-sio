import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import BaseProps from "@sio/types";
import useRevenueByCountry from "@sio/hooks/useRevenueByCountry";
import formatEuro from "@sio/utils/formatEuro";


export default function SalesByCountry({company, year}: BaseProps) {
    const {revenueByCountry, isLoading, isError} = useRevenueByCountry({company, year})

    return (
        <Card>
            <Title>Revenue by Country</Title>
            {(isLoading || isError || revenueByCountry?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={revenueByCountry ?? []}
                        category="net_total"
                        index="billing_country"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={revenueByCountry?.map((country: any) => country.billing_country) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
