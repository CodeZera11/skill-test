"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { AddTestRequest, AddTestSchema } from "./add-test.schema"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InputElement from "@/components/form-elements/input-element"
import SelectElement from "@/components/form-elements/select-element"
import NumberInputElement from "@/components/form-elements/number-input-element"
import TextareaElement from "@/components/form-elements/textarea-element"
import { Button } from "@/components/ui/button"

const AddTestForm = () => {
  const router = useRouter()
  const subCategories = useQuery(api.subCategories.list)
  const createTest = useMutation(api.tests.create)

  const form = useForm<AddTestRequest>({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      name: "",
      subCategoryId: "",
      description: "",
      duration: 30,
      passingPercentage: 60,
    }
  })

  const onSubmit = async (values: AddTestRequest) => {
    try {
      await createTest({
        name: values.name,
        description: values.description,
        subCategoryId: values.subCategoryId as Id<"subCategories">,
        duration: values.duration,
        totalQuestions: 0 // Start with 0 questions, they'll be added later
      })
      router.push("/dashboard/tests")
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Test</CardTitle>
        <CardDescription>Create a new test under a sub category</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SelectElement
              name="subCategoryId"
              label="Sub Category"
              placeholder="Select a sub category"
              options={subCategories?.map((subCategory: { name: string, _id: string }) => ({
                label: subCategory.name,
                value: subCategory._id,
              })) ?? []}
            />
            <InputElement
              name="name"
              label="Test Name"
              placeholder="Enter test name"
            />
            <TextareaElement
              name="description"
              label="Description"
              placeholder="Enter test description"
            />
            <div className="grid grid-cols-2 gap-4">
              <NumberInputElement
                name="duration"
                label="Duration (minutes)"
                placeholder="Enter test duration"

              />
              <NumberInputElement
                name="passingPercentage"
                label="Passing Percentage"
                placeholder="Enter passing percentage"

              />
            </div>
            <Button type="submit" className="w-full">
              Add Test
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default AddTestForm
