import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {Card, Metric, Text, Title} from "@tremor/react";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import formatEuro from "@sio/utils/formatEuro";
import BaseKpiProps from "@sio/types";

export default function AverageOrderValue({company, year}: BaseKpiProps) {
    const {data, isLoading, isError} = useFiscalYear({company, year})

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