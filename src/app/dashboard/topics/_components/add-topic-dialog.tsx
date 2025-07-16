"use client"

import { useState } from "react"
import AddTopicForm from "./add-topic-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const AddTopicDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Add New Topic</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Topic
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new topic.
          </DialogDescription>
        </DialogHeader>
        <AddTopicForm afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default AddTopicDialog;