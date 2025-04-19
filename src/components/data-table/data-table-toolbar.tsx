"use client"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { cn } from "@/lib/utils"
import { ListFilter, RotateCcw, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { FacetOption } from "@/types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchFilterKey?: string
  searchPlaceholder?: string
  facetKey?: string
  facetOptions?: FacetOption[]
  showViewOptions?: boolean
  inputClassName?: string
  toolbarClassName?: string
  facetTitle?: string
  searchTerm?: string
  backendSearch?: boolean
  backendFilter?: boolean
  showLocalFilter?: boolean
}

export function DataTableToolbar<TData>({
  table,
  searchFilterKey,
  searchPlaceholder,
  facetKey,
  facetOptions,
  showViewOptions = true,
  inputClassName,
  toolbarClassName,
  facetTitle,
  searchTerm,
  backendSearch = false,
  backendFilter = false,
  showLocalFilter = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [text, setText] = useState(searchTerm ?? "")

  return (
    <div className="flex items-center justify-between">
      <div
        className={cn(
          "flex flex-col md:flex-row md:flex-1 md:items-center gap-4",
          toolbarClassName
        )}
      >
        {searchFilterKey &&
          (backendSearch ? (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={text}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`${pathname}?search=${text}`)
                  }
                  if (e.key === "Escape") {
                    e.currentTarget.blur()
                  }
                }}
                onChange={(event) => {
                  if (event.target.value === "") {
                    router.push(`${pathname}?search=`)
                  }
                  setText(event.target.value)
                }}
                className={cn("md:w-[450px]", inputClassName)}
              />
              {text && text.length > 0 ? (
                <X
                  className="absolute right-2 top-2 cursor-pointer"
                  size={16}
                  onClick={() => {
                    router.push(`${pathname}?search=`)
                    setText("")
                  }}
                />
              ) : (
                <span></span>
              )}
            </div>
          ) : (
            <Input
              placeholder={searchPlaceholder}
              value={
                (table
                  .getColumn(searchFilterKey)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table
                  .getColumn(searchFilterKey)
                  ?.setFilterValue(event.target.value)
              }
              className={cn("shad-input md:w-[450px]", inputClassName)}
            />
          ))}

        {facetKey && table.getColumn(facetKey) && facetOptions && facetOptions.length > 0 && !backendFilter ? (
          <DataTableFacetedFilter
            column={table.getColumn(facetKey)}
            title={
              facetTitle ?? facetKey.charAt(0).toUpperCase() + facetKey.slice(1)
            }
            options={facetOptions ?? []}
          />
        ) : (
          showLocalFilter && facetOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="space-x-2">
                  <ListFilter size={16} />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-primary text-light-200">
                <DropdownMenuItem
                  className="hover:bg-accent_dark hover:text-white"
                  onClick={() => {
                    router.push(`${pathname}`)
                  }}
                >
                  Clear Filter
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-light-200" />
                {facetKey &&
                  facetOptions?.map((option) => {
                    const isSelected =
                      searchParams.get(facetKey) === option.value.toString()
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        className={cn(
                          "hover:bg-accent_dark hover:text-primary",
                          isSelected && "bg-accent_dark text-primary"
                        )}
                        onClick={() => {
                          router.push(`${pathname}?${facetKey}=${option.value}`)
                        }}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}

        {isFiltered && (
          <Button
            onClick={() => table.resetColumnFilters()}
            className="h-11 flex items-center gap-1 justify-center"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        )}
      </div>
      {showViewOptions && <DataTableViewOptions table={table} />}
    </div>
  )
}
