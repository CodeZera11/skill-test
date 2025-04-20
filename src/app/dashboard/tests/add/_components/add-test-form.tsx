"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../../../convex/_generated/api"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AddTestRequest, AddTestSchema } from "./add-test.schema"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import InputElement from "@/components/form-elements/input-element"
import SelectElement from "@/components/form-elements/select-element"
import NumberInputElement from "@/components/form-elements/number-input-element"
import TextareaElement from "@/components/form-elements/textarea-element"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDown, ChevronUp, Plus, Trash } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface FormStep {
  id: number
  name: string
  key: string
  fields: string[]
}

interface StepsHeaderProps {
  steps: FormStep[]
  currentStepId: number
}

const steps: FormStep[] = [
  {
    id: 0,
    name: "Basic Information",
    key: "basic-information",
    fields: [
      "name",
      "subCategoryId",
      "description",
      "duration",
      "totalQuestions"
    ]
  },
  {
    id: 1,
    name: "Section Configuration",
    key: "section-configuration",
    fields: [
      "sections"
    ]
  },
  {
    id: 2,
    name: "Questions Input",
    key: "questions-input",
    fields: [
      "questions"
    ]
  }
]

const AddTestForm = () => {
  type FieldName = keyof AddTestRequest;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [openSections, setOpenSections] = useState<number[]>([0])

  const createTest = useMutation(api.tests.create)
  const subCategories = useQuery(api.subCategories.list)

  const form = useForm<AddTestRequest>({
    resolver: zodResolver(AddTestSchema),
    defaultValues: {
      name: "",
      subCategoryId: JSON.parse(localStorage.getItem("basic-information") || "{}")?.subCategoryId,
      description: "",
      duration: 30,
      sections: [{
        name: "",
        description: "",
        duration: undefined,
        totalQuestions: undefined,
      }]
    }
  })

  useEffect(() => {
    const step = searchParams.get('step');
    if (!step) return;
    const stepData = steps.find((val) => val.key === step);
    if (!stepData) return;
    setCurrentStep(stepData.id);
  }, [searchParams, steps]);

  useEffect(() => {
    const keys = steps.map(step => step.key);
    keys.forEach((key) => {
      const stepData = localStorage.getItem(key)
      if (!stepData) return;
      const parsedData = JSON.parse(stepData);
      Object.keys(parsedData).forEach((key) => {
        form.setValue(key as FieldName, parsedData[key]);
      })
    })
  }, [currentStep, form])


  const handleSubmit = async () => {
    const values = form.getValues();
    try {
      toast.promise(
        createTest({
          name: values.name,
          description: values.description || undefined,
          subCategoryId: values.subCategoryId as Id<"subCategories">,
          duration: values.duration,
          totalQuestions: values.totalQuestions
        }),
        {
          loading: "Creating test...",
          success: () => {
            router.push("/dashboard/tests")
            return "Test created successfully"
          },
          error: "Failed to create test"
        }
      )
      router.push("/dashboard/tests")
    } catch (error) {
      console.error("Failed to create test:", error)
    }
  }

  const handleNext = async () => {
    const fields = steps[currentStep]?.fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true
    })
    if (!output) return;
    if (currentStep <= steps.length - 1) {
      if (currentStep === steps.length - 1) {
        await handleSubmit();
        return;
      }
      const currentStepKey = steps[currentStep]?.key;
      if (!currentStepKey) return;
      const currentStepFields = steps[currentStep]?.fields;

      const currentStepData: Record<string, any> = {};

      currentStepFields?.forEach((field) => {
        currentStepData[field] = form.getValues(field as FieldName);
      })
      localStorage.setItem(currentStepKey, JSON.stringify(currentStepData))
      router.push(pathname + `?step=${steps[currentStep + 1]?.key}`)
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      router.push(pathname + `?step=${steps[currentStep - 1]?.key}`);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  })

  const toggleSection = (index: number) => {
    setOpenSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Test</CardTitle>
        <CardDescription>Create a new test under a sub category</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <StepsHeader steps={steps} currentStepId={currentStep} />

            {currentStep === 0 && (
              <div className="space-y-4">
                <SelectElement
                  name="subCategoryId"
                  label="Sub Category"
                  placeholder="Select a sub category"
                  className="w-full"
                  options={subCategories?.map((subCategory: { name: string, _id: string }) => ({
                    label: subCategory.name,
                    value: subCategory._id,
                  })) ?? []}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputElement
                    name="name"
                    label="Test Name"
                    placeholder="Enter test name"
                  />
                  <NumberInputElement
                    name="duration"
                    label="Duration (minutes)"
                    placeholder="Enter test duration (optional)"
                  />
                </div>
                <TextareaElement
                  name="description"
                  label="Description"
                  placeholder="Enter test description"
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="overflow-hidden p-2">
                        <Collapsible open={openSections.includes(index)} onOpenChange={() => toggleSection(index)} className="p-2">
                          <CollapsibleTrigger className="w-full mb-4" asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between border-b rounded-none pb-4">
                              <CardTitle className="text-sm font-medium">
                                {form.watch(`sections.${index}.name`) || `Section ${index + 1}`}
                              </CardTitle>
                              {openSections.includes(index) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-0">
                            <CardContent className="p-2">
                              <div className="grid gap-5">
                                <div className="grid grid-cols-2 gap-2">
                                  <InputElement
                                    name={`sections.${index}.name`}
                                    label="Name"

                                    placeholder="Enter section name"
                                  />
                                  <NumberInputElement
                                    name={`sections.${index}.duration`}
                                    label="Duration (min)"
                                    placeholder="Enter section duration"
                                  />

                                  {/* <NumberInputElement
                                    name={`sections.${index}.totalQuestions`}
                                    label="Questions"
                                    placeholder="Enter total questions"
                                  /> */}
                                </div>

                                <TextAreaElement
                                  name={`sections.${index}.description`}
                                  label="Description"
                                  placeholder="Enter section description"
                                />
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end p-2 pt-2">
                              {fields.length > 1 && (
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </CardFooter>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar />
                </ScrollArea>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newIndex = fields.length
                    append({
                      name: "",
                      description: "",
                      duration: undefined,
                      totalQuestions: undefined,
                    })
                    setOpenSections([...openSections, newIndex])
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            )}



            <div
              className={cn('!mt-10 grid grid-cols-1 md:grid-cols-4 gap-y-2 md:gap-x-2 flex-col-reverse sm:flex-row w-full')}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="w-full col-span-1"
              >
                <span className="">Prev Step</span>
              </Button>
              <Button
                onClick={handleNext}
                type="button"
                className={cn(
                  'w-full col-span-3',
                )}
              >
                {currentStep === steps.length - 1 ? 'Add Test' : 'Next Step'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

const StepsHeader = ({ steps, currentStepId = 0 }: StepsHeaderProps) => {
  return (
    <div className="w-full py-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStepId
            const isCurrent = step.id === currentStepId
            const isUpcoming = step.id > currentStepId

            return (
              <li key={step.id} className="relative flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary text-primary"
                          : "border-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <CheckIcon className="h-5 w-5" aria-hidden="true" /> : <span>{step.id + 1}</span>}
                  </div>
                  <span
                    className={cn(
                      "hidden text-center text-sm font-medium md:block",
                      isCurrent ? "text-primary" : isUpcoming ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}

export default AddTestForm
