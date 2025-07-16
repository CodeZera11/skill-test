"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EditCategoryRequest, EditCategorySchema } from "./category.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Id } from "~/convex/_generated/dataModel"
import SelectElement from "@/components/form-elements/select-element"
import { CategoryWithCount } from "./columns"

interface EditCategoryFormProps {
  afterSubmit?: () => void
  category: CategoryWithCount
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({ afterSubmit, category }) => {
  const router = useRouter()
  const updateCategory = useMutation(api.categories.update)
  const topics = useQuery(api.topics.list, { onlyPublished: false })
  const form = useForm<EditCategoryRequest>({
    resolver: zodResolver(EditCategorySchema),
    defaultValues: {
      id: category._id,
      description: category.description || "",
      name: category.name,
      topicId: category.topic?._id || "",
    }
  })

  const onSubmit = async (values: EditCategoryRequest) => {
    try {
      toast.promise(
        updateCategory({
          ...values,
          topicId: values.topicId as Id<"topics">,
          id: category._id
        }),
        {
          loading: "Updating category...",
          success: () => {
            afterSubmit?.()
            return "Category updated successfully"
          },
          error: "Failed to update category"
        }
      )
      // await createCategory(values)
      router.push("/dashboard/categories")
    } catch (error) {
      console.error("Failed to update category:", error)
    }
  }

  if (!topics) {
    return <div>Loading...</div>
  }

  if (topics === null || topics.length === 0) {
    return <div>No topics found</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SelectElement
          name="topicId"
          label="Topic"
          placeholder="Select a topic"
          options={topics.map((topic) => ({
            label: topic.name,
            value: topic._id,
          }))}
          defaultValue={category.topic?._id || ""}
        />
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
          Update Category
        </Button>
      </form>
    </Form>
  )
}

export default EditCategoryForm