"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddSubCategoryForm from "../add/_components/add-subcategory-form"
import { useState } from "react"

const AddSubCategoryDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Add New Sub Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add New Sub Category
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new sub category.
          </DialogDescription>
        </DialogHeader>
        <AddSubCategoryForm afterSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default AddSubCategoryDialog
