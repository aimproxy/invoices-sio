import {Card, DonutChart, Legend, Title,} from "@tremor/react";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import useSalesByCountry from "@sio/hooks/useSalesByCountry";
import BaseProps from "@sio/types";

export default function SalesByCountry({company, year}: BaseProps) {
    const {
        data,
        isLoading,
        isError
    } = useSalesByCountry({company, year})

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
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6"
                    />
                    <Legend
                        categories={data?.map((country) => country.billing_country) ?? []}
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
