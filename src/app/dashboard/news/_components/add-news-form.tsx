"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { AddNewsRequest, AddNewsSchema } from "./add-news.schema"

interface AddNewsFormProps {
  afterSubmit?: () => void
}

const AddNewsForm: React.FC<AddNewsFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const createNews = useMutation(api.news.createNews)
  const form = useForm<AddNewsRequest>({
    resolver: zodResolver(AddNewsSchema),
    defaultValues: {
      isPublished: false
    }
  })

  const onSubmit = async (values: AddNewsRequest) => {
    try {
      toast.promise(
        createNews({
          title: values.title,
          description: values.description,
          externalLink: values.externalLink,
          isPublished: false
        }),
        {
          loading: "Creating news...",
          success: () => {
            afterSubmit?.()
            return "News created successfully"
          },
          error: "Failed to create news"
        }
      )
      router.push("/dashboard/news")
    } catch (error) {
      console.error("Failed to create news:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputElement
          name="title"
          label="Title"
          placeholder="Enter news title"
        />
        <TextAreaElement
          name="description"
          label="Description"
          placeholder="Enter topic description"
        />
        <InputElement
          name="externalLink"
          label="External Link"
          placeholder="Enter a valid URL"
          description="This link will be used to redirect users to the full news article."
        />
        <Button type="submit" className="w-full">
          Add News
        </Button>
      </form>
    </Form>
  )
}

export default AddNewsForm