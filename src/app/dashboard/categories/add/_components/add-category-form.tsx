"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AddCategoryRequest, AddCategorySchema } from "./add-category.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Id } from "../../../../../../convex/_generated/dataModel"
import SelectElement from "@/components/form-elements/select-element"

interface AddCategoryFormProps {
  afterSubmit?: () => void
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const createCategory = useMutation(api.categories.create)
  const topics = useQuery(api.topics.list, {})
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
        createCategory({ ...values, topicId: values.topicId as Id<"topics"> }),
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
          Add Category
        </Button>
      </form>
    </Form>
  )
}

export default AddCategoryForm