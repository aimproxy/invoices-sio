import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {createColumnHelper} from "@tanstack/table-core";
import Table from "@sio/components/Table";
import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {CustomersReturnType} from "@sio/query";
import {Customer} from "@sio/postgres";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";
import {Tab, TabList, Text, Title} from "@tremor/react";
import {useRouter} from "next/router";

const fetchCustomers = async (company: string): Promise<CustomersReturnType> => {
    const res = await fetch(`/api/customers?company=${company}`)
    return await res.json();
}

export default function Customers({company}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()

    const {
        data: customers,
        isLoading: isLoadingCustomers,
        isError: isErrorCustomers
    } = useQuery({
            queryKey: ['customers', company],
            queryFn: async () => await fetchCustomers(company)
        }
    )

    const columnHelper = createColumnHelper<Customer>()

    const customerColumns = [
        columnHelper.accessor('company_name', {
            header: () => 'Customer',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('customer_tax_id', {
            header: () => 'NIF',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('ship_to_city', {
            header: () => 'City',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('ship_to_postal_code', {
            header: () => 'Postal Code',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('ship_to_country', {
            header: () => 'Country',
            cell: info => info.getValue(),
        }),
    ]

    const showMockTable = isLoadingCustomers || isErrorCustomers

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <div className="block sm:flex sm:justify-between">
                <div className="flex flex-col">
                    <Title>Olá, {company}!</Title>
                    <Text>Aqui o especialista és sempre tu!</Text>
                </div>
            </div>
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
            </TabList>

            <div className="mt-6 mb-8 gap-6">
                {showMockTable ? (
                    <ListSkeleton/>
                ) : (
                    <Table columns={customerColumns} data={customers ?? []}/>
                )}
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps<{ company: string }> = async ({query}) => {
    const {company} = query

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(
        ['customers', company],
        async () => await fetchCustomers(String(company)))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            company: String(company)
        },
    }
}