import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {Card, Metric, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import formatEuro from "@sio/utils/formatEuro";

export default function AverageOrderValue() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {data, isLoading, isError} = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>AOV</Title>
            <Text>Average Order Value</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{formatEuro(data!.aov)}</Metric>}
            </div>
        </Card>
    );
}