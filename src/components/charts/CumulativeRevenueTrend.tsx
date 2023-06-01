import {Card, LineChart, Text, Title} from "@tremor/react";
import useRevenueOverTime from "@sio/hooks/useRevenueOverTime";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import formatEuro from "@sio/utils/formatEuro";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";


export default function CumulativeRevenueTrend() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {revenueOverTime, isLoading, isError} = useRevenueOverTime({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    // TODO Show loading state
    return (
        <Card>
            <Title>Cumulative Revenue Trend</Title>
            <Text>Whether the revenue is increasing, or remaining the same</Text>

            {isLoading ?
                <ChartSkeleton/>
                :
                <LineChart
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
