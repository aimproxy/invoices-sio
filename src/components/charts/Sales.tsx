import {Bold, Card, DonutChart, Flex, Metric, Text, Title} from "@tremor/react";
import {useContext} from "react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import useProducts from "@sio/hooks/useProducts";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";

export default function Sales() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {
        data: year,
        isLoading: isLoadingYear,
        isError: isErrorYear
    } = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    const {
        products,
        isLoading: isLoadingProducts,
        isError: isErrorProducts
    } = useProducts({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

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
                        <Metric>{formatEuro(year!.net_sales)}{' '}</Metric>
                        <Text>/{' '}{formatEuro(year!.gross_sales)}</Text>
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
