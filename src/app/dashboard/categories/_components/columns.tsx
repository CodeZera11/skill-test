"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Topic } from "../../../../../convex/topics";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteCategory, toggleCategoryPublishStatus } from "@/actions/categories";
import { Badge } from "@/components/ui/badge";

type CategoryWithCount = Doc<"categories"> & { _subcategoriesCount: number, topic: Topic | null };

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
    accessorKey: "topic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Topic" />
    ),
    cell: ({ row }) => {
      const topic = row.original.topic;

      return (
        <span className="">{topic?.name ?? "-"}</span>
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
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <Badge variant={category?.isPublished ? "success" : "danger"} className="">{category.isPublished ? "Yes" : "No"}</Badge>
      )
    }
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
      const category = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => {
            toast.promise(
              toggleCategoryPublishStatus(category._id, !category.isPublished),
              {
                loading: "Updating category...",
                success: "Category updated successfully",
                error: (err) => `Error updating Category: ${err}`,
              }
            )
          }}>
            {category.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button onClick={() => toast.promise(deleteCategory(category._id), {
            loading: "Deleting category...",
            success: "Category deleted successfully",
            error: (err) => `Error deleting category: ${err}`,
          })} variant="destructive" size="icon">
            <Trash />
          </Button>
        </div>
      )
    }
  }
]

