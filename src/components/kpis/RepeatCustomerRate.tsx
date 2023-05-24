import BaseKPI from "@sio/components/primitives/BaseKPI";

export default function RepeatPurchaseRate() {
    // Repeat purchase rate = (Number of customers who made more than one purchase / Total number of customers) x 100
    return (
        <BaseKPI title={"RPR"} description={"Repeat Purchase Rate"} metric={"2.4%"}/>
    );
}