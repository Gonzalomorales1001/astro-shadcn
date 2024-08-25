import { DataTableFacetedFilter } from "@/components/react/table/faceted-filter"
import { DataTablePagination } from "@/components/react/table/pagination"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { useState } from "react"

// data example
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status",
        header: "Status",
        enableGlobalFilter: true,
        enableColumnFilter: true,
        filterFn: (row, id, values) => values.includes(row.original.status),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]

const Datatable = ({ data }: { data: Payment[] }) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
        state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center pt-4 gap-2">
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(event) =>
                        setGlobalFilter(event.target.value)
                    }
                    className="max-w-sm"
                />
                {
                    table.getColumn("status") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("status")}
                            title="Status"
                            options={[
                                {
                                    value: "pending",
                                    label: "Pending",
                                },
                                {
                                    value: "processing",
                                    label: "Processing",
                                },
                                {
                                    value: "success",
                                    label: "Success",
                                },
                                {
                                    value: "failed",
                                    label: "Failed",
                                },
                            ]}
                        />
                    )
                }
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto" variant={"secondary"}>
                            <span>Show</span>
                            <ChevronDown className="ms-2" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="grid grid-cols-3">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize rounded"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border bg-background/70">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                // onClick={() => router.push(`${row.getValue("id")}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="py-3" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='px-5'>
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}

export default Datatable