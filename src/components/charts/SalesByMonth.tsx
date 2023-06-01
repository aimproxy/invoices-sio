import {BarChart, Card, Text, Title} from "@tremor/react";
import useSalesByMonth from "@sio/hooks/useSalesByMonth";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import BaseKpiProps from "@sio/types";

export default function SalesByMonth({company, year}: BaseKpiProps) {
    const {
        salesByMonth,
        isLoading,
        isError
    } = useSalesByMonth({company, year})

    return (
        <Card>
            <Title>Sales per Month</Title>
            <Text>Number of sales per each month</Text>
            {(isLoading || isError || salesByMonth == undefined) ? (
                <ChartSkeleton/>
            ) : (
                <BarChart
                    className="mt-4"
                    data={salesByMonth}
                    index="month"
                    categories={['Number Of Sales']}
                    colors={["indigo"]}
                />
            )}
        </Card>
    );
}
