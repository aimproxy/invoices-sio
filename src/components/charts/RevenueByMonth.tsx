import {BarChart, Card, Text, Title} from "@tremor/react";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import BaseProps from "@sio/types";
import formatEuro from "@sio/utils/formatEuro";
import useRevenueByMonth from "@sio/hooks/useRevenueByMonth";

export default function RevenueByMonth({company, year}: BaseProps) {
    const {data, isLoading, isError} = useRevenueByMonth({company, year})

    return (
        <Card>
            <Title>Revenue per Month</Title>
            <Text>Revenue per each month</Text>
            {(isLoading || isError || data == null) ? (
                <ChartSkeleton/>
            ) : (
                <BarChart
                    className="mt-4"
                    data={data}
                    index="month"
                    maxValue={Math.max(...data.map((r: any) => r["Revenue"]))}
                    valueFormatter={formatEuro}
                    relative={false}
                    categories={["Revenue"]}
                    colors={["indigo"]}
                />
            )}
        </Card>
    );
}
