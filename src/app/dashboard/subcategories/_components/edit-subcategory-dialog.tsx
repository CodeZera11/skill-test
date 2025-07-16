"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import EditSubCategoryForm from "./edit-subcategory-form"
import { SubCategoryWithTests } from "~/convex/subCategories"

const EditSubCategoryDialog = ({ subCategory }: { subCategory: SubCategoryWithTests }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="">Update Sub Category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Sub Category
          </DialogTitle>
          <DialogDescription>
            Fill in the details to update the sub category.
          </DialogDescription>
        </DialogHeader>
        <EditSubCategoryForm afterSubmit={() => setOpen(false)} subCategory={subCategory} />
      </DialogContent>
    </Dialog>
  )
}

export default EditSubCategoryDialog
