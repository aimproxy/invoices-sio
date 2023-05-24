import {AreaChart, Card, Text, Title} from "@tremor/react";

const chart = [
    {
        date: "Jan",
        "Net Sales": 2890,
        "Gross Sales": 2338,
    },
    {
        date: "Feb",
        "Net Sales": 2756,
        "Gross Sales": 2103,
    },
    {
        date: "Mar",
        "Net Sales": 3322,
        "Gross Sales": 2194,
    },
    {
        date: "Apr",
        "Net Sales": 3470,
        "Gross Sales": 2108,
    },
    {
        date: "May",
        "Net Sales": 3475,
        "Gross Sales": 1812,
    },
    {
        date: "Jun",
        "Net Sales": 3129,
        "Gross Sales": 1726,
    },
];

const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const RevenueOverTime = () => (
    <Card>
        <Title>Revenue Over Time</Title>
        <Text>Comparison between Sales and Profit</Text>
        <AreaChart
            className="h-72 mt-4"
            data={chart}
            index="date"
            categories={["Net Sales", "Gross Sales"]}
            colors={["indigo", "cyan"]}
            valueFormatter={dataFormatter}
        />
    </Card>
);

export default RevenueOverTime
