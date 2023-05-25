import {Card, CategoryBar, Text, Title} from "@tremor/react";
import {useContext, useEffect, useState} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import postgres from "@sio/postgres";
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

    useEffect(() => {
        postgres
            .selectFrom("fiscal_year")
            .select(["net_sales", "gross_sales"])
            .where('company_id', '=', Number(selectedCompany))
            .where('fiscal_year', '=', Number(selectedYear))
            .limit(1)
            .executeTakeFirst()
            .then(sales => {
                console.log(sales)
                setNetSales(sales.net_sales)
                setGrossSales(sales.gross_sales)
            })
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [selectedCompany, selectedYear])

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