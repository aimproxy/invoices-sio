import {Card, DeltaType, DonutChart, Legend, Title,} from "@tremor/react";

interface CityData {
    name: string;
    region: string;
    sales: number;
    delta: string;
    deltaType: DeltaType;
}

const cities: CityData[] = [
    {
        name: "New York",
        region: "us",
        sales: 984888,
        delta: "6.1%",
        deltaType: "increase",
    },
    {
        name: "London",
        region: "europe",
        sales: 456700,
        delta: "1.2%",
        deltaType: "moderateDecrease",
    },
    {
        name: "San Francisco",
        region: "us",
        sales: 240000,
        delta: "2.3%",
        deltaType: "moderateIncrease",
    },
    {
        name: "Hong Kong",
        region: "asia",
        sales: 390800,
        delta: "0.5%",
        deltaType: "moderateDecrease",
    },
    {
        name: "Singapore",
        region: "asia",
        sales: 190800,
        delta: "1.8%",
        deltaType: "moderateIncrease",
    },
    {
        name: "Zurich",
        region: "europe",
        sales: 164400,
        delta: "3.4%",
        deltaType: "decrease",
    },
    {
        name: "Vienna",
        region: "europe",
        sales: 139800,
        delta: "3.1%",
        deltaType: "moderateIncrease",
    },
];

const valueFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()} $`;

export default function SalesByCity() {
    return (
        <Card>
            <Title>Sales by City</Title>
            <DonutChart
                data={cities}
                category="sales"
                index="name"
                colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                valueFormatter={valueFormatter}
                className="mt-6"
            />
            <Legend
                categories={cities.map((city) => city.name)}
                className="mt-6 justify-center"
            />
        </Card>
    );
}
