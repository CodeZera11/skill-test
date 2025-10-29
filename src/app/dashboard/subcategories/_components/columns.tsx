"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { SubCategoryWithTests } from "~/convex/subCategories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteSubCategory, toggleSubCategoryPublishStatus } from "@/actions/sub-categories";
import EditSubCategoryDialog from "./edit-subcategory-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return (
        <Badge variant={subCategory.isPublished ? "success" : "danger"}>
          {subCategory.isPublished ? "Yes" : "No"}
        </Badge>
      )
    }
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
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const subCategory = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditSubCategoryDialog subCategory={subCategory} />
          <Button variant="secondary" onClick={() => {
            toast.promise(
              toggleSubCategoryPublishStatus(subCategory._id, !subCategory.isPublished),
              {
                loading: "Updating subcategory...",
                success: "Subcategory updated successfully",
                error: (err) => `Error updating subcategory: ${err}`,
              }
            )
          }}>
            {subCategory.isPublished ? "Unpublish" : "Publish"}
          </Button>


          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {`Are you sure you want to delete the subcategory "${subCategory.name}"?`}
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All associated tests will also be deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => toast.promise(deleteSubCategory(subCategory._id), {
                  loading: "Deleting SubCategory...",
                  success: "SubCategory deleted successfully",
                  error: (err) => `Error deleting SubCategory: ${err}`,
                })} variant="destructive">
                  Delete
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      )
    }
  }
]
