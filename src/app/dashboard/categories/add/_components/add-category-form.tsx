"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AddCategoryRequest, AddCategorySchema } from "./add-category.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"

interface AddCategoryFormProps {
  afterSubmit?: () => void
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const createCategory = useMutation(api.categories.create)
  const form = useForm<AddCategoryRequest>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    }
  })

  const onSubmit = async (values: AddCategoryRequest) => {
    try {
      toast.promise(
        createCategory(values),
        {
          loading: "Creating category...",
          success: () => {
            afterSubmit?.()
            return "Category created successfully"
          },
          error: "Failed to create category"
        }
      )
      // await createCategory(values)
      router.push("/dashboard/categories")
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputElement
          name="name"
          label="Category Name"
          placeholder="Enter category name"
        />
        <TextAreaElement
          name="description"
          label="Description"
          placeholder="Enter category description (optional)"
        />
        <Button type="submit" className="w-full">
          Add Category
        </Button>
      </form>
    </Form>
  )
}

export default AddCategoryForm