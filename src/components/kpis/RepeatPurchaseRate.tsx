import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";

export default function RepeatPurchaseRate() {
    // Repeat purchase rate = (Number of customers who made more than one purchase / Total number of customers) x 100

    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {data, isLoading, isError} = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>RPR</Title>
            <Text>Repeat Purchase Rate</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{data?.rpr}%</Metric>}
            </div>
        </Card>
    );
}