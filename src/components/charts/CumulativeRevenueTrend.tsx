import {Card, LineChart, Text, Title} from "@tremor/react";
import useRevenueOverTime from "@sio/hooks/useRevenueOverTime";
import formatEuro from "@sio/utils/formatEuro";
import BaseProps from "@sio/types";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";


export default function CumulativeRevenueTrend({company, year}: BaseProps) {
    const {revenueOverTime, isLoading, isError} = useRevenueOverTime({company, year})

    return (
        <Card>
            <Title>Cumulative Revenue Trend</Title>
            <Text>Whether the revenue is increasing, or remaining the same</Text>

            {isLoading || isError
                ? <ChartSkeleton/>
                : <LineChart
                    className="mt-8"
                    data={revenueOverTime ?? []}
                    index="month"
                    categories={["Cumulative Revenue"]}
                    colors={["blue", "emerald"]}
                    valueFormatter={formatEuro}
                />
            }
        </Card>
    );
}
