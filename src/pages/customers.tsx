import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {createColumnHelper} from "@tanstack/table-core";
import Table from "@sio/components/Table";
import KpisLayout from "@sio/components/KpisLayout";
import {dehydrate, QueryClient, useQuery} from "@tanstack/react-query";
import {CustomersReturnType} from "@sio/query";
import {Customer} from "@sio/postgres";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";

const fetchCustomers = async (company: string): Promise<CustomersReturnType> => {
    const res = await fetch(`/api/customers?company=${company}`)
    return await res.json();
}

export default function Customers({company}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        <KpisLayout>
            {showMockTable ? (
                <ListSkeleton/>
            ) : (
                <Table columns={customerColumns} data={customers ?? []}/>
            )}
        </KpisLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
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