import {Card, CategoryBar, Text, Title} from "@tremor/react";

export default function NetGrossMargin() {
    return (
        <Card className={"col-span-2"}>
            <Title>Net Gross Margin</Title>
            <CategoryBar
                className={"mt-4"}
                categoryPercentageValues={[70, 30]}
                percentageValue={70}
                colors={["blue", "red"]}
                showLabels={false}
            />
            <div className="flex justify-between mt-3">
                <div>
                    <Title>700 €</Title>
                    <Text>Net</Text>
                </div>
                <div className="text-right">
                    <Title>300 €</Title>
                    <Text className="text-right">Gross</Text>
                </div>
            </div>
        </Card>
    )
}