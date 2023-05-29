import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import useSalesByCountry from "@sio/hooks/useSalesByCountry";


export default function SalesByCountry() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {
        data,
        isLoading,
        isError
    } = useSalesByCountry({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Sales by Country</Title>
            {(isLoading || isError || data?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={data ?? []}
                        category="sales_count"
                        index="billing_country"
                        colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                        className="mt-6"
                    />
                    <Legend
                        categories={data?.map((country) => country.billing_country) ?? []}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
