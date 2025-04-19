"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { SubCategoryWithTests } from "../../../../../convex/subCategories";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<SubCategoryWithTests>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return <span>{subCategory._id}</span>
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return (
        <span>{subCategory.name}</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return (
        <Badge>{subCategory.category.name}</Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "tests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tests" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return (
        <span>{subCategory.tests.length}</span>
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
      const subCategory = row.original;
      const formatted = format(
        new Date(subCategory.createdAt),
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
