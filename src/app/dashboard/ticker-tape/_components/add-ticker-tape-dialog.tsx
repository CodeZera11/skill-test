"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTickerTapeForm from "./add-ticker-tape-form";

const AddTickerTapeDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Ticker Item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ticker Item</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new ticker tape item.
          </DialogDescription>
        </DialogHeader>
        <AddTickerTapeForm afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTickerTapeDialog;
