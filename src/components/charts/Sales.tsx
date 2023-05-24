import {Bold, Card, DonutChart, Flex, Legend, Metric, Text, Title} from "@tremor/react";

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
    return (
        <Card>
            <Title>Sales</Title>
            <Flex justifyContent="start" className="space-x-1" alignItems="baseline">
                <Metric>12,780€{' '}</Metric>
                <Text>/{' '}19,800€</Text>
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
