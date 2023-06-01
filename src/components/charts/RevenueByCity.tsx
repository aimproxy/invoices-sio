import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import BaseProps from "@sio/types";
import useRevenueByCity from "@sio/hooks/useRevenueByCity";

export default function SalesByCity({company, year}: BaseProps) {
    const {revenueByCity, isLoading, isError} = useRevenueByCity({company, year})

    return (
        <Card>
            <Title>Sales by City</Title>
            {(isLoading || isError || revenueByCity?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={revenueByCity ?? []}
                        category="net_total"
                        index="billing_city"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={revenueByCity?.map((city) => city.billing_city) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
