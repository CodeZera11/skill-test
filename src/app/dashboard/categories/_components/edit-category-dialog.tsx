"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { CategoryWithCount } from "./columns"
import EditCategoryForm from "./edit-category-form"

const EditCategoryDialog = ({ category }: { category: CategoryWithCount }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="">Edit New Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Category
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new category.
          </DialogDescription>
        </DialogHeader>
        <EditCategoryForm category={category} afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default EditCategoryDialog