import {Card, LineChart, Text, Title} from "@tremor/react";
import useRevenueOverTime from "@sio/hooks/useRevenueOverTime";
import formatEuro from "@sio/utils/formatEuro";
import BaseKpiProps from "@sio/types";


export default function CumulativeRevenueTrend({company, year}: BaseKpiProps) {
    const {revenueOverTime, isLoading, isError} = useRevenueOverTime({company, year})

    // TODO Show loading state
    return (
        <Card>
            <Title>Cumulative Revenue Trend</Title>
            <Text>Whether the revenue is increasing, or remaining the same</Text>
            <LineChart
                className="mt-8"
                data={revenueOverTime ?? []}
                index="month"
                categories={["Cumulative Revenue"]}
                colors={["blue", "emerald"]}
                valueFormatter={formatEuro}
            />
        </Card>
    );
}
