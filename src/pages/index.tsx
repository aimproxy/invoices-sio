import {Card, Grid, Subtitle, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import useCompanies from "@sio/hooks/useCompanies";
import Link from "next/link";
import Tabs from "@sio/components/Tabs";

export default function Home() {
    const {data, isLoading, isError} = useCompanies();

    // @ts-ignore
    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <Title>Empresas</Title>
            <Text>Começa por escolher uma empresa!</Text>

            <Tabs tabs={[
                {route: '', name: 'As minhas empresas'},
                {route: 'saft', name: 'Importar SAF-T'}
            ]}/>

            <div className="mt-6 mb-8 gap-6">
                <Grid numColsMd={4} className="mt-6 gap-6">
                    {(isLoading || isError || data?.length == 0) && Array.from(Array(4).keys()).map((card, k) => (
                        <Card className="h-22" key={k}>
                            <TextSkeleton/>
                        </Card>
                    ))}
                    {/*@ts-ignore*/}
                    {data?.map((company, k) => (
                        <Link href={`${company.company_id}/${company.fiscal_year}/dashboard`} key={k}>
                            <Card>
                                <Title>{company.company_name}</Title>
                                <Subtitle>{company.company_id}</Subtitle>
                            </Card>
                        </Link>
                    ))}
                </Grid>
            </div>
        </main>
    );
}