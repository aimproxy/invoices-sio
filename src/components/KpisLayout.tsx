import {Tab, TabList} from "@tremor/react";
import Welcome from "@sio/components/Welcome";
import {PropsWithChildren, ReactNode} from "react";
import {useRouter} from "next/router";

interface KpisLayoutProps {
    buttons?: ReactNode
}

const KpisLayout = ({buttons, children}: PropsWithChildren<KpisLayoutProps>) => {
    const router = useRouter()

    return (
        <main className={"max-w-6xl mx-auto pt-16 sm:pt-8 px-8"}>
            <div className="block sm:flex sm:justify-between">
                <Welcome/>
                <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
                    {buttons}
                </div>
            </div>
            <TabList
                defaultValue="dashboard"
                value={router.route.replace('/', '')}
                onValueChange={(value) => router.push({
                    pathname: value,
                    query: router.query,
                })}
                className="mt-6"
            >
                <Tab value="dashboard" text="Dashboard"/>
                <Tab value="customers" text="Customers"/>
            </TabList>

            <div className="mt-6 mb-8 gap-6">
                {children}
            </div>
        </main>
    )
}

export default KpisLayout