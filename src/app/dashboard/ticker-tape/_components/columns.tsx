"use client"

import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ExternalLink, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TickerTapeItem } from "~/convex/tickerTape";
import {
  removeTickerTapeItem,
  toggleTickerTapePublishStatus,
} from "@/actions/ticker-tape";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const columns: ColumnDef<TickerTapeItem>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return <span>{item._id}</span>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <span>{row.original.title}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link" />
    ),
    cell: ({ row }) => {
      const link = row.original.link;
      if (!link) {
        return <span className="text-muted-foreground">No link</span>;
      }

      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-[240px] items-center gap-1 truncate text-primary underline"
        >
          <span className="truncate">{link}</span>
          <ExternalLink className="size-4" />
        </a>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={item.isPublished ? "success" : "danger"}>
          {item.isPublished ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      const formatted = format(new Date(item.createdAt), "dd MMM yy, hh:mm a");
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{formatted}</span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-4">
          <Switch
            checked={item.isPublished}
            onCheckedChange={() => {
              toast.promise(
                toggleTickerTapePublishStatus(item._id, !item.isPublished),
                {
                  loading: "Updating ticker item...",
                  success: "Ticker item updated successfully",
                  error: (err) => `Error updating ticker item: ${err}`,
                }
              );
            }}
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {`Are you sure you want to delete "${item.title}"?`}
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    toast.promise(removeTickerTapeItem(item._id), {
                      loading: "Deleting ticker item...",
                      success: "Ticker item deleted successfully",
                      error: (err) => `Error deleting ticker item: ${err}`,
                    })
                  }
                  variant="destructive"
                  className="ml-2"
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
