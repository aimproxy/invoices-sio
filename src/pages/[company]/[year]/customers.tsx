import {createColumnHelper} from "@tanstack/table-core";
import Table from "@sio/components/Table";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";
import useCustomers from "@sio/hooks/useCustomers";
import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import YearSelector from "@sio/components/selectors/YearSelector";

export default function Customers({company, year}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {data, isLoading, isError} = useCustomers({company, year})
    const columnHelper = createColumnHelper<any>()

    const customerColumns = [
        columnHelper.accessor('company_name', {
            header: () => 'Customer',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('customer_tax_id', {
            header: () => 'NIF',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('billing_city', {
            header: () => 'City',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('billing_postal_code', {
            header: () => 'Postal Code',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('billing_country', {
            header: () => 'Country',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('invoices_count', {
            header: () => 'Invoices',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('customer_net_total', {
            header: () => 'Net Total',
            cell: info => `${info.getValue()} €`,
        }),
    ]

    const showMockTable = isLoading || isError

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <div className="flex justify-between">
                <Welcome company={company} year={year}/>
                <YearSelector company={company} year={year}/>
            </div>
            <Tabs tabs={[
                {route: 'dashboard', name: 'Dashboard'},
                {route: 'customers', name: 'Customers'},
                {route: 'products', name: 'Products'}
            ]}/>

            <div className="mt-6 mb-8 gap-6">
                {showMockTable ? (
                    <ListSkeleton/>
                ) : (
                    <Table columns={customerColumns} data={data ?? []}/>
                )}
            </div>
        </main>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    return {
        props: {
            company: params?.company || undefined,
            year: params?.year || undefined
        }
    }
}