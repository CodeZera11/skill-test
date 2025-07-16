"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EditTopicRequest, EditTopicSchema } from "./topic.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Id } from "~/convex/_generated/dataModel"
import { TopicWithCategory } from "~/convex/topics"

interface EditTopicFormProps {
  afterSubmit?: () => void
  topic: TopicWithCategory
}

const EditTopicForm: React.FC<EditTopicFormProps> = ({ afterSubmit, topic }) => {
  const router = useRouter()
  const updateTopic = useMutation(api.topics.update)
  const form = useForm<EditTopicRequest>({
    resolver: zodResolver(EditTopicSchema),
    defaultValues: {
      ...topic,
      id: topic._id
    }
  })

  const onSubmit = async (values: EditTopicRequest) => {
    try {
      toast.promise(
        updateTopic({
          ...values,
          id: values.id as Id<"topics">
        }),
        {
          loading: "Updating topic...",
          success: () => {
            afterSubmit?.()
            return "Topic updated successfully"
          },
          error: "Failed to update topic"
        }
      )
      router.push("/dashboard/topics")
    } catch (error) {
      console.error("Failed to update topic:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InputElement
          name="name"
          label="Topic Name"
          placeholder="Enter topic name"
        />
        <TextAreaElement
          name="description"
          label="Description"
          placeholder="Enter topic description (optional)"
        />
        <Button type="submit" className="w-full">
          Update Topic
        </Button>
      </form>
    </Form>
  )
}

export default EditTopicForm