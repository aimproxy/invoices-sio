import {Card, Metric, Text, Title} from "@tremor/react";

interface BaseKPIProps {
    title: string
    description: string
    metric: string
}

export default function BaseKPI({title, description, metric}: BaseKPIProps) {

    return (
        <Card>
            <Title>{title}</Title>
            <Text>{description}</Text>
            <Metric className={"mt-4"}>{metric}</Metric>
        </Card>
    )
}