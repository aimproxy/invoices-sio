import {Card, LineChart, Text, Title} from "@tremor/react";

const data = [
    {
        Date: "01.01.2021",
        "Customer Churn": 9.73,
    },
    {
        Date: "02.01.2021",
        "Customer Churn": 10.74,
    },
    {
        Date: "03.01.2021",
        "Customer Churn": 11.93,
    },
    // ...
    {
        Date: "13.03.2021",
        "Customer Churn": 8.82,
    },

];

const valueFormatterRelative = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()}%`;

export default function CumulativeRevenueTrend() {
    return (
        <Card className={"col-span-2"}>
            <Title>Cumulative Revenue Trend</Title>
            <Text>Whether the revenue is increasing, decreasing, or remaining stable</Text>
            <LineChart
                className="mt-8 h-80"
                data={data}
                index="Date"
                categories={["Customer Churn"]}
                colors={["blue"]}
                showLegend={false}
                valueFormatter={valueFormatterRelative}
                yAxisWidth={40}
            />
        </Card>
    );
}
