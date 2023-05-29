import {createColumnHelper} from "@tanstack/table-core";
import Table from "@sio/components/Table";
import ListSkeleton from "@sio/components/skeletons/ListSkeleton";
import {useRouter} from "next/router";
import useCustomers from "@sio/hooks/useCustomers";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {Customer} from "@sio/pages/api/customers";
import Tabs from "@sio/components/Tabs";
import Welcome from "@sio/components/Welcome";

export default function Customers() {
    const router = useRouter()

    const {selectedCompany} = useContext(KpisContext)
    const {data, isLoading, isError} = useCustomers({
        company: String(selectedCompany?.company_id)
    })

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

    const showMockTable = isLoading || isError

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <Welcome/>
            <Tabs/>

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