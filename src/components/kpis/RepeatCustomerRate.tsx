import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";

export default function RepeatPurchaseRate() {
    // Repeat purchase rate = (Number of customers who made more than one purchase / Total number of customers) x 100
    return (
        <Card>
            <Title>RPR</Title>
            <Text>Repeat Purchase Rate</Text>
            <Metric className={"mt-4"}></Metric>
            <TextSkeleton/>
        </Card>
    );
}