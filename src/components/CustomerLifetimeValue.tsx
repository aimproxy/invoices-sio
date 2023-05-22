import BaseKPI from "@sio/components/primitives/BaseKPI";

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

export default function CustomerLifetimeValue() {
    return (
        <BaseKPI title={"CLV"} description={"Customer Lifetime Value"} metric={"KPI 2"}/>
    );
}