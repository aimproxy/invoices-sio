import {createColumnHelper} from "@tanstack/table-core";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";
import Table from "@sio/components/Table";
import useProducts from "@sio/hooks/useProducts";
import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import YearSelector from "@sio/components/selectors/YearSelector";

export default function Products({company, year}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {products, isLoading, isError} = useProducts({company, year})

    const columnHelper = createColumnHelper<any>()

    const productColumns = [
        columnHelper.accessor('product_code', {
            header: () => 'Code',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('product_description', {
            header: () => 'Product',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('total_sales', {
            header: () => 'Total Sales',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('revenue', {
            header: () => 'Revenue',
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
                    <Table columns={productColumns} data={products ?? []}/>
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