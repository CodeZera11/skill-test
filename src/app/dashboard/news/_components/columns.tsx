"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { News } from "~/convex/news";
import { removeNews, toggleNewsPublishStatus } from "@/actions/news";
import { Switch } from "@/components/ui/switch";

export const columns: ColumnDef<News>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.original.title;
      return (
        <span>{title}</span>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span>{
          description.length > 100 ? `${description.slice(0, 100)}...` : description
        }</span>
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
      const news = row.original;
      return (
        <div className="flex items-center gap-4">
          {/* <Button variant="secondary" onCick={() => {
            toast.promise(
              toggleNewsPublishStatus(news._id, !news.isPublished),
              {
                loading: "Updating news...",
                success: "News updated successfully",
                error: (err) => `Error updating News: ${err}`,
              }
            )
          }}> */}

          {/* </Button> */}
          <Switch checked={news.isPublished} onCheckedChange={() => {
            toast.promise(
              toggleNewsPublishStatus(news._id, !news.isPublished),
              {
                loading: "Updating news...",
                success: "News updated successfully",
                error: (err) => `Error updating News: ${err}`,
              }
            )
          }} />

          <Button onClick={() => toast.promise(removeNews(news._id), {
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

