import {Card, Metric, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useFiscalYear from "@sio/hooks/useFiscalYear";

export default function CustomerLifetimeValue() {
    // Customer lifetime value = Average order value x Average number of purchases x Average customer lifespan
    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {data, isLoading, isError} = useFiscalYear({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>CLV</Title>
            <Text>Customer Lifetime Value</Text>
            <div className={"mt-4"}>
                {isLoading || isError ? <TextSkeleton/> : <Metric>{data?.clv}€</Metric>}
            </div>
        </Card>
    );
}