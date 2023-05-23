import {
    Card,
    DeltaType,
    DonutChart,
    Dropdown,
    DropdownItem,
    Flex,
    Legend,
    List,
    ListItem,
    Title,
    Toggle,
    ToggleItem,
} from "@tremor/react";
import {useEffect, useState} from "react";
import {ChartPieIcon, ListBulletIcon} from "@heroicons/react/24/outline";

const regions = [
    {key: "all", name: "All Regions"},
    {key: "us", name: "United States"},
    {key: "europe", name: "Europe"},
    {key: "asia", name: "Asia"},
];

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

const filterByRegion = (region: string, data: CityData[]) =>
    region === "all" ? data : data.filter((city) => city.region === region);

export default function TopProductsByRegion() {
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [filteredData, setFilteredData] = useState(cities);
    const [selectedView, setSelectedView] = useState("chart");

    useEffect(() => {
        const data = cities;
        setFilteredData(filterByRegion(selectedRegion, data));
    }, [selectedRegion]);

    return (
        <Card className="col-span-2 mx-auto">
            <Flex className="space-x-8" justifyContent="between" alignItems="center">
                <Title>Top Products</Title>
                <Dropdown
                    onValueChange={(value) => setSelectedRegion(value)}
                    placeholder="Region Selection"
                    className={"w-5"}
                >
                    {regions.map((region) => (
                        <DropdownItem
                            key={region.key}
                            value={region.key}
                            text={region.name}
                        />
                    ))}
                </Dropdown>
            </Flex>
            <Flex justifyContent="end" className={"my-4"}>
                <Toggle
                    defaultValue="chart"
                    color="gray"
                    onValueChange={(value) => setSelectedView(value)}
                >
                    <ToggleItem value="chart" icon={ChartPieIcon}/>
                    <ToggleItem value="list" icon={ListBulletIcon}/>
                </Toggle>
            </Flex>

            {selectedView === "chart" ?
                <>
                    <DonutChart
                        data={filteredData}
                        category="sales"
                        index="name"
                        valueFormatter={valueFormatter}
                        className="mt-6"
                    />
                    <Legend
                        categories={filteredData.map((city) => city.name)}
                        className="mt-6 justify-center"
                    />
                </>
                :
                <>
                    <List className="mt-1">
                        {cities.map((item) => (
                            <ListItem key={item.name}>
                                <span> {item.name} </span>
                                <span> {item.sales} </span>
                            </ListItem>
                        ))}
                    </List>
                </>
            }
        </Card>
    );
}
