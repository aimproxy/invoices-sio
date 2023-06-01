import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import useSalesByCity from "@sio/hooks/useSalesByCity";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import BaseKpiProps from "@sio/types";

export default function SalesByCity({company, year}: BaseKpiProps) {
    const {data, isLoading, isError} = useSalesByCity({company, year})

    return (
        <Card>
            <Title>Sales by City</Title>
            {(isLoading || isError || data?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={data ?? []}
                        category="sales_count"
                        index="billing_city"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={data?.map((city) => city.billing_city) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
