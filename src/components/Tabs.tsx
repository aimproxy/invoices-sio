import {useRouter} from "next/router";
import {Tab, TabList} from "@tremor/react";

const Tabs = () => {
    const router = useRouter()

    return (
        <TabList
            value={router.route.replace('/', '')}
            onValueChange={(value) => router.push({
                pathname: value,
                query: router.query,
            })}
            className="mt-6"
        >
            <Tab value="dashboard" text="Dashboard"/>
            <Tab value="customers" text="Customers"/>
            <Tab value="products" text="Products"/>
        </TabList>
    )
}

export default Tabs