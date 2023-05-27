import {Bold, Card, DonutChart, Flex, Legend, Metric, Text, Title} from "@tremor/react";
import {useContext} from "react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";

const products = [
    {
        name: 'Product A',
        value: 456,
    },
    {
        name: 'Product B',
        value: 351,
    },
    {
        name: 'Product C',
        value: 271,
    },
    {
        name: 'Product D',
        value: 191,
    },
    {
        name: 'Product X',
        value: 91,
    },
    {
        name: 'Product Y',
        value: 80,
    },
    {
        name: 'Product Z',
        value: 40,
    },
];


const valueFormatter = (number: number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Sales() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {data, isLoading, isError} = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Sales</Title>
            <Flex justifyContent="start" className="space-x-1 mt-2" alignItems="baseline">
                {(isLoading || isError) ? (
                    <TextSkeleton/>
                ) : (
                    <>
                        <Metric>{data?.net_sales}€{' '}</Metric>
                        <Text>/{' '}{data?.gross_sales}€</Text>
                    </>
                )}
            </Flex>
            <Text className="mt-4">
                <Bold>Top products by units sold</Bold>
            </Text>
            <DonutChart
                data={products}
                category="value"
                index="name"
                colors={["emerald", "violet", "indigo", "yellow", "rose", "cyan", "amber"]}
                valueFormatter={valueFormatter}
                className="mt-6"
            />
            <Legend
                categories={products.map((product) => product.name)}
                className="mt-6 justify-center"
            />
        </Card>
    );
}
