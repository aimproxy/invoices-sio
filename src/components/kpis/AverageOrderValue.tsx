import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {Card, Metric, Text, Title} from "@tremor/react";

export default function AverageOrderValue() {
    return (
        <Card>
            <Title>AOV</Title>
            <Text>Average Order Value</Text>
            <Metric className={"mt-4"}><TextSkeleton/></Metric>
        </Card>
    );
}