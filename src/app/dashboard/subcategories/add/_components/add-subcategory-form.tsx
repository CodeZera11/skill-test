"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { AddSubCategoryRequest, AddSubCategorySchema } from "./add-subcategory.schema"
import { Form } from "@/components/ui/form"

import InputElement from "@/components/form-elements/input-element"
import SelectElement from "@/components/form-elements/select-element"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"

interface AddSubCategoryFormProps {
  afterSubmit?: () => void
}

const AddSubCategoryForm: React.FC<AddSubCategoryFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const categories = useQuery(api.categories.list)
  const createSubCategory = useMutation(api.subCategories.create)

  const form = useForm<AddSubCategoryRequest>({
    resolver: zodResolver(AddSubCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
    }
  })

  const onSubmit = async (values: AddSubCategoryRequest) => {
    try {
      toast.promise(
        createSubCategory({
          name: values.name,
          categoryId: values.categoryId as Id<"categories">,
          description: values.description || undefined
        }),
        {
          loading: "Creating sub category...",
          success: () => {
            afterSubmit?.()
            router.push("/dashboard/subcategories")
            return "Sub category created successfully"
          },
          error: "Failed to create sub category"
        }
      )
    } catch (error) {
      console.error("Failed to create sub category:", error)
    }
  }

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SelectElement
          name="categoryId"
          label="Category"
          placeholder="Select a category"
          options={categories?.map((category: { name: string, _id: string }) => ({
            label: category.name,
            value: category._id,
          })) ?? []}
          className="w-full"
        />
        <InputElement
          name="name"
          label="Sub Category Name"
          placeholder="Enter sub category name"
        />
        <TextAreaElement
          name="description"
          label="Description"
          placeholder="Enter sub category description (optional)"
        />
        <Button type="submit" className="w-full mt-4">
          Add Sub Category
        </Button>
      </form>
    </Form>

  )
}

export default AddSubCategoryForm
