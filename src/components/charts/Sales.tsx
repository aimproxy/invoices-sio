import {Bold, Card, DonutChart, Flex, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import useProducts from "@sio/hooks/useProducts";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import BaseProps from "@sio/types";

export default function Sales({company, year}: BaseProps) {
    const {
        data: fiscalYear,
        isLoading: isLoadingYear,
        isError: isErrorYear
    } = useFiscalYear({company, year})

    const {
        products,
        isLoading: isLoadingProducts,
        isError: isErrorProducts
    } = useProducts({company, year})

    const topProducts = products?.slice(0, 5).map(product => ({
        name: product.product_description.slice(0, 30),
        value: Number(product.amount_spent)
    }))

    return (
        <Card>
            <Title>Sales</Title>
            <Flex justifyContent="start" className="space-x-1 mt-2" alignItems="baseline">
                {(isLoadingYear || isErrorYear) ? (
                    <TextSkeleton/>
                ) : (
                    <>
                        <Metric>{formatEuro(fiscalYear!.net_sales)}{' '}</Metric>
                        <Text>/{' '}{formatEuro(fiscalYear!.gross_sales)}</Text>
                    </>
                )}
            </Flex>
            <Text className="mt-4">
                <Bold>Top 5 products by units sold</Bold>
            </Text>
            {(isLoadingProducts || isErrorProducts) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <DonutChart
                        data={topProducts ?? []}
                        category="value"
                        index="name"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={formatEuro}
                        className="mt-6"
                    />
                </>
            )}
        </Card>
    );
}
