import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";

export default function CustomerLifetimeValue() {
    // Customer lifetime value = Average order value x Average number of purchases x Average customer lifespan
    return (
        <Card>
            <Title>LTV</Title>
            <Text>Customer Lifetime Value</Text>
            <Metric className={"mt-4"}></Metric>
            <TextSkeleton/>
        </Card>
    );
}