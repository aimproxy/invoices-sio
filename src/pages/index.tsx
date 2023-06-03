import {Card, Grid, Subtitle, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import useCompanies from "@sio/hooks/useCompanies";
import Link from "next/link";
import Tabs from "@sio/components/Tabs";
import {BuildingOffice2Icon} from "@heroicons/react/24/outline";

export default function Home() {
    const {data, isLoading, isError} = useCompanies();
    // @ts-ignore
    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <Title>Companies</Title>
            <Text>Start by choosing a company!</Text>

            <Tabs tabs={[
                {route: '', name: 'My companies'},
                {route: 'saft', name: 'Import SAF-T'}
            ]}/>

            <div className="mt-6 mb-8 gap-6">
                <Grid numColsMd={4} className="mt-6 gap-6">
                    {(isLoading || isError) && Array.from(Array(4).keys()).map((card, k) => (
                        <Card className="h-22" key={k}>
                            <TextSkeleton/>
                        </Card>
                    ))}
                    {(!isLoading && !isError && data?.length === 0) &&
                        <div className={"col-span-4 flex flex-col justify-center items-center px-6 h-40"}>
                            <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                            <Text className={"mt-4"}>No companies found</Text>
                        </div>
                    }
                    {/*@ts-ignore*/}
                    {data?.map((company, k) => (
                        <Link href={`${company.company_id}/${company.fiscal_year}/dashboard`} key={k}>
                            <Card>
                                <Title className={"truncate"}>{company.company_name}</Title>
                                <Subtitle>{company.company_id}</Subtitle>
                            </Card>
                        </Link>
                    ))}
                </Grid>
            </div>
        </main>
    );
}