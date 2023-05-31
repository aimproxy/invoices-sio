import {createColumnHelper} from "@tanstack/table-core";
import {Product} from "@sio/pages/api/products";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";
import Table from "@sio/components/Table";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import useProducts from "@sio/hooks/useProducts";
import {useRouter} from "next/router";
import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";

export default function Products() {
    const router = useRouter()

    const {selectedCompany, selectedYear} = useContext(KpisContext)
    const {products, isLoading, isError} = useProducts({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    const columnHelper = createColumnHelper<Product>()

    const productColumns = [
        columnHelper.accessor('product_code', {
            header: () => 'Code',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('product_description', {
            header: () => 'Product',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('amount_spent', {
            header: () => 'Amount Spent',
            cell: info => `${info.getValue()} €`,
        }),
    ]

    const showMockTable = isLoading || isError

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <Welcome/>
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