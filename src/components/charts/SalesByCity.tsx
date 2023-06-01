import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import useSalesByCity from "@sio/hooks/useSalesByCity";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";

export default function SalesByCity() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        data,
        isLoading,
        isError
    } = useSalesByCity({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Sales by City</Title>
            {(isLoading || isError || data?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={data ?? []}
                        category="sales_count"
                        index="billing_city"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={data?.map((city) => city.billing_city) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
