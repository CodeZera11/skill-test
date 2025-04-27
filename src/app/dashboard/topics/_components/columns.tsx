"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TopicWithCategory } from "../../../../../convex/topics";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTopic } from "@/actions/topics";
import { Trash } from "lucide-react";

export const columns: ColumnDef<TopicWithCategory>[] = [
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
    accessorKey: "categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categories" />
    ),
    cell: ({ row }) => {
      const categories = row.original.categories;

      return (
        <span className="">{categories.length}</span>
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
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button onClick={() => toast.promise(deleteTopic(topic._id), {
            loading: "Deleting topic...",
            success: "Topic deleted successfully",
            error: (err) => `Error deleting Topic: ${err}`,
          })} variant="destructive" size="icon">
            <Trash />
          </Button>
        </div>
      )
    }
  }
]

