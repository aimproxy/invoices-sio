import {BarChart, Card, Title,} from "@tremor/react";

const chartdata = [
    {
        name: "A",
        value: 2488,
    },
    {
        name: "B",
        value: 2154,
    },
    {
        name: "C",
        value: 1245,
    },
    {
        name: "D",
        value: 1563,
    },
    {
        name: "E",
        value: 1093,
    },
];

const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
};

export default function TopProductsByUnitsSold() {
    return (
        <Card>
            <Title>Top Products by Units Sold</Title>
            <BarChart
                className="mt-6"
                layout={"vertical"}
                data={chartdata}
                index="name"
                categories={["value"]}
                colors={["emerald", "indigo", "yellow"]}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
            />
        </Card>
    );
}
