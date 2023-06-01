import useFiscalYear from "@sio/hooks/useFiscalYear";
import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import BaseProps from "@sio/types";

const Orders = ({company, year}: BaseProps) => {
    const {data, isLoading, isError} = useFiscalYear({company, year})

    return (
        <Card>
            <Title>Orders</Title>
            <Text>Total Open Orders</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{data?.number_of_entries ?? 0}</Metric>}
            </div>
        </Card>
    )
}

export default Orders