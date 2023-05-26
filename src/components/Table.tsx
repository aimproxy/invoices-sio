import {ColumnDef, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

interface TableProps<T> {
    columns: ColumnDef<T, any>[],
    data: T[]
}

const Table = <T, >({columns, data}: TableProps<T>) => {
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="border border-gray-200 shadow rounded-md">
            <table className="w-full whitespace-no-wrap overflow-hidden rounded-md">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                        key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th className="px-4 py-3" key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {table.getRowModel().rows.map(row => (
                    <tr className="text-gray-700 dark:text-gray-400" key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td className="px-4 py-3 text-sm" key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table