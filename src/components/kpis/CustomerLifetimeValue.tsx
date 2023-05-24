import BaseKPI from "@sio/components/primitives/BaseKPI";

export default function CustomerLifetimeValue() {
    // Customer lifetime value = Average order value x Average number of purchases x Average customer lifespan
    return (
        <BaseKPI title={"LTV"} description={"Customer Lifetime Value"} metric={"23,44€"}/>
    );
}