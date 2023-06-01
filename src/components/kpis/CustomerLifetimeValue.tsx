import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import useFiscalYear from "@sio/hooks/useFiscalYear";
import formatEuro from "@sio/utils/formatEuro";
import BaseProps from "@sio/types";

export default function CustomerLifetimeValue({company, year}: BaseProps) {
    // Customer lifetime value = Average order value x Average number of purchases x Average customer lifespan
    const {data, isLoading, isError} = useFiscalYear({company, year})

    return (
        <Card>
            <Title>CLV</Title>
            <Text>Customer Lifetime Value</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{formatEuro(data!.clv)}</Metric>}
            </div>
        </Card>
    );
}