"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AddTopicRequest, AddTopicSchema } from "./topic.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Id } from "~/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface AddTopicFormProps {
  afterSubmit?: () => void
}

const AddTopicForm: React.FC<AddTopicFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const createTopic = useMutation(api.topics.create)
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<AddTopicRequest>({
    resolver: zodResolver(AddTopicSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl({});

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      form.setValue("topicLogoId", storageId);

      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: AddTopicRequest) => {
    try {
      toast.promise(
        createTopic({ ...values, topicLogoId: values.topicLogoId as Id<"_storage"> }),
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={imageUrl} />
              <AvatarFallback>{form.watch("name")?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 ">
              <Button
                type="button"
                variant="outline"
                className="w-fit"
                disabled={isUploading}
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                {isUploading ? "Uploading..." : "Add Logo"}
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          {form.formState.errors.topicLogoId && (
            <p className="text-destructive text-sm">
              {form.formState.errors.topicLogoId.message}
            </p>
          )}
        </div>
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