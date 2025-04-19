"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Pagination } from "@/components/data-table/pagination"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { constants } from "@/constants/common"
import { FacetOption } from "@/types/"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  toolbarClassName?: string
  // search filter options\
  searchFilterKey?: string
  searchPlaceholder?: string
  inputClassName?: string

  // facet filter options
  facetKey?: string
  facetTitle?: string
  facetOptions?: FacetOption[]

  // pagination options
  showPagination?: boolean
  pageCount?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void

  showViewOptions?: boolean

  // backend search
  searchTerm?: string
  backendSearch?: boolean

  // backend filter
  backendFilter?: boolean

  // local filter
  showLocalFilter?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchFilterKey,
  searchPlaceholder,
  facetKey,
  facetTitle,
  facetOptions,
  showPagination = true,
  showViewOptions = true,
  inputClassName,
  toolbarClassName,
  currentPage,
  pageCount,
  searchTerm,
  backendSearch,
  backendFilter,
  showLocalFilter,
  onPageChange,
  onPageSizeChange
}: DataTableProps<TData, TValue>) {
  // const router = useRouter()
  // const pathname = usePathname()
  // const searchParams = useSearchParams()
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  // const nextPage = () => {
  //   if (currentPage && totalPages) {
  //     if (searchParams.get("search")) {
  //       router.push(
  //         `${pathname}?search=${searchParams.get("search")}&page=${currentPage + 1}`
  //       )
  //       return
  //     }
  //     router.push(`${pathname}?page=${currentPage + 1}`)
  //   }
  // }

  // const previousPage = () => {
  //   if (currentPage && totalPages) {
  //     if (searchParams.get("search")) {
  //       router.push(
  //         `${pathname}?search=${searchParams.get("search")}&page=${currentPage - 1}`
  //       )
  //       return
  //     }
  //     router.push(`${pathname}?page=${currentPage - 1}`)
  //   }
  // }

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      pagination: {
        pageSize: constants.PAGE_SIZE,
      },
    },
  })

  const showFilters = searchFilterKey || facetKey

  return (
    <div className="">
      {showFilters && (
        <DataTableToolbar
          table={table}
          searchTerm={searchTerm}
          backendSearch={backendSearch}
          searchFilterKey={searchFilterKey}
          searchPlaceholder={searchPlaceholder}
          toolbarClassName={toolbarClassName}
          inputClassName={inputClassName}
          facetTitle={facetTitle}
          facetKey={facetKey}
          facetOptions={facetOptions}
          showViewOptions={showViewOptions}
          backendFilter={backendFilter}
          showLocalFilter={showLocalFilter}
        />
      )}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-primary"
                    >
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
          <TableBody className="">
            {isLoading && (
              <TableRow className="">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-primary"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {table?.getRowModel().rows?.length && !isLoading
              ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-14"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-primary "
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
              : !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-primary"
                  >
                    No results!
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <Pagination
          currentPage={currentPage || 1}
          pageCount={pageCount || 1}
          isLoading={isLoading}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}
