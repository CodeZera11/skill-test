"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { EditTopicRequest, EditTopicSchema } from "./topic.schema"
import { Form } from "@/components/ui/form"
import InputElement from "@/components/form-elements/input-element"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Id } from "~/convex/_generated/dataModel"
import { TopicWithCategory } from "~/convex/topics"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getUrl = useMutation(api.files.getUrl);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (topic.topicLogoId) {
        const url = await getUrl({ storageId: topic.topicLogoId });
        setImageUrl(url || "");
      }
    };
    fetchImageUrl();
  }, [])

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

  const onSubmit = async (values: EditTopicRequest) => {
    try {
      toast.promise(
        updateTopic({
          ...values,
          id: values.id as Id<"topics">,
          topicLogoId: values.topicLogoId as Id<"_storage">
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
                {isUploading ? "Uploading..." : "Change Logo"}
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
          Update Topic
        </Button>
      </form>
    </Form>
  )
}

export default EditTopicForm