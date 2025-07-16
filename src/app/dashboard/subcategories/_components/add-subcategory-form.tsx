"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { AddSubCategoryRequest, AddSubCategorySchema } from "./subcategory.schema"
import { Form } from "@/components/ui/form"

import InputElement from "@/components/form-elements/input-element"
import SelectElement from "@/components/form-elements/select-element"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { toast } from "sonner"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

interface AddSubCategoryFormProps {
  afterSubmit?: () => void
}

const AddSubCategoryForm: React.FC<AddSubCategoryFormProps> = ({ afterSubmit }) => {
  const router = useRouter()
  const categories = useQuery(api.categories.list, {
    searchQuery: "",
    sortOrder: "desc",
    onlyPublished: false,
  })
  const createSubCategory = useMutation(api.subCategories.create)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<AddSubCategoryRequest>({
    resolver: zodResolver(AddSubCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      imageStorageId: "",
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
      form.setValue("imageStorageId", storageId);

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

  const onSubmit = async (values: AddSubCategoryRequest) => {
    try {
      toast.promise(
        createSubCategory({
          name: values.name,
          categoryId: values.categoryId as Id<"categories">,
          description: values.description || undefined,
          imageStorageId: values.imageStorageId as Id<"_storage">
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
          {form.formState.errors.imageStorageId && (
            <p className="text-destructive text-sm">
              {form.formState.errors.imageStorageId.message}
            </p>
          )}
        </div>
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
