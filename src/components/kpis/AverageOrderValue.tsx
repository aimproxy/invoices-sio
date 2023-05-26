import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {Card, Metric, Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";

export default function AverageOrderValue() {
    const {selectedYear} = useContext(KpisContext)
    console.log(selectedYear)

    return (
        <Card>
            <Title>AOV</Title>
            <Text>Average Order Value</Text>
            <div className={"mt-4"}>
                {selectedYear == undefined ? <TextSkeleton/> : <Metric>{selectedYear?.aov}€</Metric>}
            </div>
        </Card>
    );
}