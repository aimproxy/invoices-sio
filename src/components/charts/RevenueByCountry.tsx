import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import useRevenueByCountry from "@sio/hooks/useRevenueByCountry";
import formatEuro from "@sio/utils/formatEuro";


export default function RevenueByCountry() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        revenueByCountry,
        isLoading,
        isError
    } = useRevenueByCountry({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Sales by Country</Title>
            {(isLoading || isError || revenueByCountry?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={revenueByCountry ?? []}
                        category="net_total"
                        index="billing_country"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                    <Legend
                        categories={revenueByCountry?.map((country) => country.billing_country) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
