import {BarChart, Card, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useRevenueByMonth from "@sio/hooks/useRevenueByMonth";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";

export default function RevenueByMonth() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        data,
        isLoading,
        isError
    } = useRevenueByMonth({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

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
                    categories={['Number Of Sales']}
                    colors={["indigo"]}
                />
            )}
        </Card>
    );
}
