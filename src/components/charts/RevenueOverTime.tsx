import {AreaChart, Card, Text, Title} from "@tremor/react";
import useRevenueOverTime from "@sio/hooks/useRevenueOverTime";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import BaseKpiProps from "@sio/types";

const RevenueOverTime = ({company, year}: BaseKpiProps) => {
    const {revenueOverTime, isLoading, isError} = useRevenueOverTime({company, year})

    return (
        <Card>
            <Title>Revenue Over Time</Title>
            <Text>Comparison between Sales and Profit</Text>
            {(isLoading || isError) ? (
                <ChartSkeleton/>
            ) : (
                <AreaChart
                    className="h-72 mt-4"
                    data={revenueOverTime ?? []}
                    index="month"
                    categories={["Net Sales", "Gross Sales"]}
                    colors={["indigo", "emerald", "amber"]}
                    valueFormatter={formatEuro}
                />
            )}
        </Card>
    )
};

export default RevenueOverTime
