import {Card, Grid, Subtitle, Tab, TabList, Text, Title} from "@tremor/react";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";
import {useContext, useState} from "react"
import SAFTDropzone from "@sio/components/SAFTDropzone";
import useCompanies from "@sio/hooks/useCompanies";
import Link from "next/link";
import {KpisContext} from "@sio/components/KpisProvider";
import {CompanyReturnType} from "@sio/pages/api/companies";

export default function Home() {
    const {setSelectedCompany, setSelectedYear} = useContext(KpisContext);
    const [selectedView, setSelectedView] = useState("1");

    // TODO Invalidar esta query quando se da upload do saf-t
    const {data, isLoading, isError} = useCompanies();

    const handleCompanySelection = (company: CompanyReturnType) => {
        setSelectedCompany(company)
        setSelectedYear(String(company.fiscal_years[0]))
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
                            <Link href='/dashboard'
                                  onClick={() => handleCompanySelection(company)}
                                  key={k}>
                                <Card className="h-22">
                                    <Title>{company.company_name}</Title>
                                    <Subtitle>{company.company_id}</Subtitle>
                                </Card>
                            </Link>
                        ))}

                        {(!isLoading || !isError) && generateFakeCards}
                    </Grid>}
                {selectedView == "2" && <SAFTDropzone/>}
            </div>

        </main>
    );
}