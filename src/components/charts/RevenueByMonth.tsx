import {BarChart, Card, Text, Title} from "@tremor/react";
import useSalesByMonth from "@sio/hooks/useSalesByMonth";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import BaseProps from "@sio/types";

export default function RevenueByMonth({company, year}: BaseProps) {
    const {
        data,
        isLoading,
        isError
    } = useRevenueByMonth({company, year})

    return (
        <Card>
            <Title>Sales per Month</Title>
            <Text>Revenue per each month</Text>
            {(isLoading || isError || data == null) ? (
                <ChartSkeleton/>
            ) : (
                <BarChart
                    className="mt-4"
                    data={data}
                    index="month"
                    maxValue={Math.max(...data.map(r => r["Number Of Sales"]))}
                    valueFormatter={formatEuro}
                    relative={false}
                    categories={["Number Of Sales"]}
                    colors={["indigo"]}
                />
            )}
        </Card>
    );
}
