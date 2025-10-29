"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TopicWithCategory } from "~/convex/topics";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTopic, toggleTopicPublishStatus } from "@/actions/topics";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditTopicDialog from "./edit-topic-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const columns: ColumnDef<TopicWithCategory>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return <span>{topic._id}</span>
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return (
        <span>{topic.name}</span>
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
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return (
        <Badge variant={topic?.isPublished ? "success" : "danger"}>{topic.isPublished ? "Yes" : "No"}</Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      const formatted = format(
        new Date(topic.createdAt),
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
          <EditTopicDialog topic={topic} />
          <Button variant="secondary" onClick={() => {
            toast.promise(
              toggleTopicPublishStatus(topic._id, !topic.isPublished),
              {
                loading: "Updating topic...",
                success: "Topic updated successfully",
                error: (err) => `Error updating Topic: ${err}`,
              }
            )
          }}>
            {topic.isPublished ? "Unpublish" : "Publish"}
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
                  {`Are you sure you want to delete the topic "${topic.name}"?`}
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All associated categories will also be deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() => toast.promise(deleteTopic(topic._id), {
                    loading: "Deleting topic...",
                    success: "Topic deleted successfully",
                    error: (err) => `Error deleting Topic: ${err}`,
                  })}
                  variant="destructive"
                  className="ml-2"
                >
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

