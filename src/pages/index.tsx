import {Card, Grid, Subtitle, Tab, TabList, Text, Title} from "@tremor/react";
import {GetServerSideProps} from "next";
import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {CompanyReturnType} from "@sio/query";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {useRouter} from "next/router";
import {MouseEvent, useState} from "react"
import SAFTDropzone from "@sio/components/SAFTDropzone";

const fetchCompanies = async (): Promise<CompanyReturnType> => {
    const res = await fetch(process.env.NODE_ENV == "development"
        ? 'http://localhost:3000/api/companies'
        : '/api/companies'
    )
    return await res.json();
}

export default function Home() {
    const router = useRouter();
    const [selectedView, setSelectedView] = useState("1");

    const {data, isLoading, isError} = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    })

    const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        router.push(href).then(console.info);
    };

    const generateFakeCards = Array.from(Array(3).keys()).map((card, k) => (
        <Card className="h-22" key={k}>
            <TextSkeleton/>
        </Card>
    ))

    return (
        <main className={"max-w-6xl mx-auto pt-16 sm:pt-8 px-8"}>
            <Title>Empresas</Title>
            <Text>Começa por escolher uma empresa!</Text>

            <TabList
                defaultValue="1"
                onValueChange={(value) => setSelectedView(value)}
                className="mt-6">
                <Tab value="1" text="Empresas"/>
                <Tab value="2" text="Importar SAF-T"/>
            </TabList>
            <div className="mt-6 mb-8 gap-6">
                {selectedView == "1" &&
                    <Grid numColsMd={4} className="mt-6 gap-6">
                        {(isLoading || isError) && generateFakeCards}

                        {data?.map((company, k) => (
                            <a href={`/dashboard?company=${company.company_id}`}
                               onClick={(event) => handleClick(event, `/dashboard?company=${company.company_id}`)}
                               key={k}>
                                <Card className="h-22">
                                    <Title>{company.company_name}</Title>
                                    <Subtitle>{company.tax_registration_number}</Subtitle>
                                </Card>
                            </a>
                        ))}

                        {(!isLoading || !isError) && generateFakeCards}
                    </Grid>}
                {selectedView == "2" && <SAFTDropzone/>}
            </div>

        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['companies'], fetchCompanies)

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    }
}