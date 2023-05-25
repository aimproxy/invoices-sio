import {Card, CategoryBar, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import postgres from "@sio/postgres";

export default async function NetGrossMargin() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    let net, gross

    try {
        const netGross = await postgres
            .selectFrom("fiscal_year")
            .select(["net_sales", "gross_sales"])
            .where('company_id', '=', Number(selectedCompany))
            .where('fiscal_year', '=', Number(selectedYear))
            .limit(1)
            .executeTakeFirstOrThrow();

        net = netGross.net_sales
        gross = netGross.gross_sales
    } catch (e) {
        throw e
    }

    return (
        <Card>
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
                    <Title>{net} €</Title>
                    <Text>Net</Text>
                </div>
                <div className="text-right">
                    <Title>{gross} €</Title>
                    <Text className="text-right">Gross</Text>
                </div>
            </div>
        </Card>
    )
}