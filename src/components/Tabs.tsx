import {useRouter} from "next/router";
import {Tab, TabList} from "@tremor/react";

const Tabs = ({tabs}: { tabs: { route: string, name: string }[] }) => {
    const router = useRouter()
    const route = /\/([^/]+)$/.exec(router.route)

    return (
        <TabList
            value={route?.[1] ?? ''}
            onValueChange={(value) => router.push({
                pathname: value,
                query: router.query,
            })}
            className="mt-6"
        >
            {tabs.map(({route, name}) => <Tab key={route} value={route} text={name}/>)}
        </TabList>
    )
}

export default Tabs