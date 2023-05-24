import {BarChart, Card, Text, Title} from "@tremor/react";

const data = [
    {
        Month: "Jan 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Feb 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Mar 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Apr 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "May 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Jun 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Jul 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Aug 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Sep 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Oct 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Nov 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Dec 21",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
    {
        Month: "Jan 22",
        "One Timers": 3890,
        Loyal: 2980,
        Recurrent: 2645,
    },
];

const valueFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

export default function RevenueBySegment() {
    return (
        <Card>
            <Title>Revenue by Segment</Title>
            <Text>Distribution of one-time, loyal and recurrent customers</Text>
            <BarChart
                className="mt-4 h-80"
                data={data}
                index="Month"
                categories={["One Timers", "Loyal", "Recurrent"]}
                colors={["emerald", "indigo", "cyan"]}
                valueFormatter={valueFormatter}
                stack={true}
                relative={true}
            />
        </Card>
    );
}
