import useFiscalYear from "@sio/hooks/useFiscalYear";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";

const Orders = () => {

    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {data, isLoading, isError} = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Orders</Title>
            <Text>Total open orders</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{data?.number_of_entries}</Metric>}
            </div>
        </Card>
    )
}

export default Orders