"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Doc } from "../../../../../convex/_generated/dataModel";

type CategoryWithCount = Doc<"categories"> & { _subcategoriesCount: number };

export const columns: ColumnDef<CategoryWithCount>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return <span>{category._id}</span>
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <span>{category.name}</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "subcategories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Categories" />
    ),
    cell: ({ row }) => {
      const category = row.original;

      return (
        <span className="">{category._subcategoriesCount}</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      const formatted = format(
        new Date(category.createdAt),
        "dd MMM yy, hh:mm a"
      );
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{formatted}</span>
        </div>
      )
    },
    enableSorting: false,
  }
]

