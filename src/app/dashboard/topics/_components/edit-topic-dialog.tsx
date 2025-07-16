"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TopicWithCategory } from "~/convex/topics"
import EditTopicForm from "./edit-topic-form"

const EditTopicDialog = ({topic}: {topic: TopicWithCategory}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="">
          Edit Topic
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Topic
          </DialogTitle>
          <DialogDescription>
            Update the details of the topic.
          </DialogDescription>
        </DialogHeader>
        <EditTopicForm afterSubmit={() => setOpen(false)} topic={topic} />
      </DialogContent>
    </Dialog>
  )
}

export default EditTopicDialog;