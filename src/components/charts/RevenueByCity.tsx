import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import useRevenueByCity from "@sio/hooks/useRevenueByCity";

export default function RevenueByCity() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        revenueByCity,
        isLoading,
        isError
    } = useRevenueByCity({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Sales by City</Title>
            {(isLoading || isError || revenueByCity?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={revenueByCity ?? []}
                        category="net_total"
                        index="billing_city"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={revenueByCity?.map((city) => city.billing_city) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
