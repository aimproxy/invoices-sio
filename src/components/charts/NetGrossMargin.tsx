import {Card, CategoryBar, Text, Title} from "@tremor/react";
import {useContext, useState} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";

export default function NetGrossMargin() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const [isLoading, setIsLoading] = useState(true)
    const [netSales, setNetSales] = useState(0)
    const [grossSales, setGrossSales] = useState(0)

    console.log({
        selectedCompany,
        selectedYear,
        POSTGRES_URL: process.env.POSTGRES_URL,
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING
    });

    const kpiMarkup = (
        <>
            <CategoryBar
                className={"mt-4"}
                categoryPercentageValues={[70, 30]}
                percentageValue={70}
                colors={["blue", "red"]}
                showLabels={false}
            />
            <div className="flex justify-between mt-3">
                <div>
                    <Title>{netSales} €</Title>
                    <Text>Net</Text>
                </div>
                <div className="text-right">
                    <Title>{grossSales} €</Title>
                    <Text className="text-right">Gross</Text>
                </div>
            </div>
        </>
    )

    return (
        <Card>
            <Title>Net Gross Margin</Title>
            {isLoading ? <TextSkeleton/> : kpiMarkup}
        </Card>
    )
}