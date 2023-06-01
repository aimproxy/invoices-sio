import {AreaChart, Card, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useRevenueOverTime from "@sio/hooks/useRevenueOverTime";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";

const RevenueOverTime = () => {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {revenueOverTime, isLoading, isError} = useRevenueOverTime({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

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
