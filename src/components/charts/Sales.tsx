import {Bold, Card, DonutChart, Flex, Legend, Metric, Text, Title} from "@tremor/react";
import {useContext} from "react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import useTopProducts from "@sio/hooks/useTopProducts";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";

const valueFormatter = (number: number) => `${Intl.NumberFormat("us").format(number).toString()} €`;

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
    } = useTopProducts({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    console.log(products)

    return (
        <Card>
            <Title>Sales</Title>
            <Flex justifyContent="start" className="space-x-1 mt-2" alignItems="baseline">
                {(isLoadingYear || isErrorYear) ? (
                    <TextSkeleton/>
                ) : (
                    <>
                        <Metric>{valueFormatter(year!.net_sales)}{' '}</Metric>
                        <Text>/{' '}{valueFormatter(year!.gross_sales)}</Text>
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
                        data={products ?? []}
                        category="value"
                        index="name"
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        valueFormatter={valueFormatter}
                        className="mt-6"
                    />
                    <Legend
                        colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                        categories={products?.map((product) => product.name) ?? []}
                        className="mt-6 justify-center"
                    />
                </>
            )}
        </Card>
    );
}
