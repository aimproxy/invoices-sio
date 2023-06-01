import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import BaseProps from "@sio/types";

export default function RepeatPurchaseRate({company, year}: BaseProps) {
    // Repeat purchase rate = (Number of customers who made more than one purchase / Total number of customers) x 100
    const {data, isLoading, isError} = useFiscalYear({company, year})

    return (
        <Card>
            <Title>RPR</Title>
            <Text>Repeat Purchase Rate</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{data?.rpr ?? 0}%</Metric>}
            </div>
        </Card>
    );
}