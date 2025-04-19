"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { AddSubCategoryRequest, AddSubCategorySchema } from "./add-subcategory.schema"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputElement from "@/components/form-elements/input-element"
import SelectElement from "@/components/form-elements/select-element"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"

const AddSubCategoryForm = () => {
  const router = useRouter()
  const categories = useQuery(api.categories.list)
  const createSubCategory = useMutation(api.subCategories.create)

  const form = useForm<AddSubCategoryRequest>({
    resolver: zodResolver(AddSubCategorySchema),
    defaultValues: {
      name: "",
      categoryId: "",
    }
  })

  const onSubmit = async (values: AddSubCategoryRequest) => {
    try {
      await createSubCategory({
        name: values.name,
        categoryId: values.categoryId as Id<"categories">
      })
      router.push("/dashboard/subcategories")
    } catch (error) {
      console.error("Failed to create sub category:", error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Sub Category</CardTitle>
        <CardDescription>Create a new sub category under an existing category</CardDescription>
      </CardHeader>
      <CardContent>
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
            />
            <InputElement
              name="name"
              label="Sub Category Name"
              placeholder="Enter sub category name"
            />
            <Button type="submit" className="w-full">
              Add Sub Category
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AddSubCategoryForm
