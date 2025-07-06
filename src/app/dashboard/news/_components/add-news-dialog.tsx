"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddNewsForm from "./add-news-form"

const AddNewsDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Add News</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add News
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new news topic.
          </DialogDescription>
        </DialogHeader>
        <AddNewsForm afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default AddNewsDialog;