"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AddTopicRequest, AddTopicSchema } from "./add-topic.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"

interface AddTopicFormProps {
  afterSubmit?: () => void
}

const AddTopicForm: React.FC<AddTopicFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const createTopic = useMutation(api.topics.create)
  const form = useForm<AddTopicRequest>({
    resolver: zodResolver(AddTopicSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  })

  const onSubmit = async (values: AddTopicRequest) => {
    try {
      toast.promise(
        createTopic({ ...values }),
        {
          loading: "Creating topic...",
          success: () => {
            afterSubmit?.()
            return "Topic created successfully"
          },
          error: "Failed to create topic"
        }
      )
      // await createCategory(values)
      router.push("/dashboard/topics")
    } catch (error) {
      console.error("Failed to create topic:", error)
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
          Add Topic
        </Button>
      </form>
    </Form>
  )
}

export default AddTopicForm