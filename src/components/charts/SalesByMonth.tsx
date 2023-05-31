import {BarChart, Card, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useSalesByMonth from "@sio/hooks/useSalesByMonth";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function SalesByMonth() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        data,
        isLoading,
        isError
    } = useSalesByMonth({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    const salesByMonth = Array.from(months,
        (month, i) => ({
            "Number Of Sales": data?.[i].invoice_count ?? 0,
            month: month,
        }))

    return (
        <Card>
            <Title>Sales per Month</Title>
            <Text>Number of sales per each month</Text>
            {(isLoading || isError || data == null) ? (
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
