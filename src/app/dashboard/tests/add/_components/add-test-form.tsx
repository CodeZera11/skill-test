"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { useQuery, useMutation } from "convex/react"
import { api } from "~/convex/_generated/api"
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
import { CheckIcon, ChevronDown, ChevronUp, Plus, PlusCircle, Trash, Trash2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import TextAreaElement from "@/components/form-elements/textarea-element"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import ImportQuestionsDialog from "./import-questions-dialog"
import { Id } from "~/convex/_generated/dataModel"
import { PageRoutes } from "@/constants/page-routes"

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
      sections: [{
        name: "",
        description: "",
        duration: undefined,
        totalQuestions: undefined,
      }],
      questions: []
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
    console.log({ values })
    try {
      toast.promise(
        createTest({
          name: values.name,
          description: values.description || undefined,
          subCategoryId: values.subCategoryId as Id<"subCategories">,
          totalQuestions: values.questions.length,
          sections: values.sections,
          questions: values.questions
        }),
        {
          loading: "Creating test...",
          success: () => {

            steps.forEach((step) => {
              localStorage.removeItem(step.key)
            })

            localStorage.removeItem("basic-information")
            localStorage.removeItem("section-configuration")

            router.push(PageRoutes.DASHBOARD.TESTS)
            return "Test created successfully"
          },
          error: "Failed to create test"
        }
      )
      router.push(PageRoutes.DASHBOARD.TESTS)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  const toggleSection = (index: number) => {
    setOpenSections((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const sectionOptions = form.getValues("sections").map((section) => ({
    label: section.name,
    value: section.name.toLowerCase().replace(" ", "_"),
  }))

  const groupedQuestions = form.getValues("questions").reduce((acc, question, index) => {
    const key = question.sectionKey || 'unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push({ question, index });
    return acc;
  }, {} as Record<string, { question: { question: string, options: (string | number)[], correctAnswer: number, sectionKey: string, explanation?: string, marks?: string, negativeMarks?: string }; index: number }[]>);

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Test</CardTitle>
        <CardDescription>Create a new test under a sub category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 ">
        <Form {...form}>
          <form className="space-y-6 ">
            <StepsHeader steps={steps} currentStepId={currentStep} />

            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputElement
                    name="name"
                    label="Test Name"
                    placeholder="Enter test name"
                  />
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
                              <CardTitle className="text-sm font-medium ">
                                {`Section ${index + 1} ->`} {form.watch(`sections.${index}.name`)}
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

            {currentStep === 2 && (
              <div className="space-y-4">
                {form.watch("sections").map((section, sectionIndex) => {
                  const sectionKey = section.name.toLowerCase().replace(" ", "_");
                  const sectionQuestions = groupedQuestions[sectionKey] || []; // Get questions for the current section

                  return (
                    <div key={sectionIndex} className="space-y-4 border rounded-md p-4">
                      <h2 className="text-lg font-semibold">{section.name || `Section ${sectionIndex + 1}`}</h2>
                      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ImportQuestionsDialog
                            onImport={async (questions) => {
                              try {
                                questions.forEach((question) => {
                                  appendQuestion({
                                    ...question,
                                    question: question.question || "",
                                    marks: question.marks?.toString() || "1",
                                    negativeMarks: question.negativeMarks?.toString() || "0",
                                    sectionKey: sectionKey, // Assign sectionKey to imported questions
                                  });
                                });
                              } catch (error) {
                                console.error("Failed to import questions:", error);
                                toast.error("Failed to import questions");
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              form.setValue(
                                "questions",
                                form.watch("questions").filter((q) => q.sectionKey !== sectionKey)
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear Questions
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            appendQuestion({
                              question: "",
                              options: ["", "", "", ""],
                              correctAnswer: 0,
                              explanation: "",
                              sectionKey: sectionKey, // Assign sectionKey to manually added questions
                              marks: `1`,
                              negativeMarks: `0`,
                            });
                          }}
                          className="flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Question to {section.name || `Section ${sectionIndex + 1}`}
                        </Button>
                      </div>
                      <div className="max-h-[30rem] h-full overflow-y-auto">
                        <div className="flex flex-col gap-4">
                          {(!sectionQuestions || !sectionQuestions?.length) && (
                            <div className="text-center text-muted-foreground h-40 flex items-center justify-center rounded-md border border-dashed">
                              {`No questions added yet. Click "Add Question" to start.`}
                            </div>
                          )}
                          {sectionQuestions.map((field, questionIndex) => (
                            <Card key={field.index} className="overflow-hidden">
                              <CardContent className="px-6">
                                <div className="flex items-start justify-between mb-4 flex-col md:flex-row gap-5">
                                  <h3 className="text-xl font-medium">
                                    Question {questionIndex + 1} {/* Numbering starts from 1 for each section */}
                                  </h3>
                                  <div className="flex items-end md:gap-3 flex-wrap md:flex-nowrap gap-10">
                                    <SelectElement
                                      name={`questions.${field.index}.sectionKey`}
                                      label="Section"
                                      placeholder="Select section"
                                      className="w-[80px] md:w-[180px] h-9"
                                      options={sectionOptions}
                                      value={field.question.sectionKey}
                                    />
                                    <SelectElement
                                      name={`questions.${field.index}.marks`}
                                      label="Marks"
                                      placeholder="Enter marks"
                                      className="w-[80px] md:w-[180px] h-9"
                                      options={[
                                        { label: "1", value: `1` },
                                        { label: "2", value: `2` },
                                        { label: "3", value: `3` },
                                      ]}
                                      defaultValue={field.question.marks || "1"}
                                    />
                                    <SelectElement
                                      name={`questions.${field.index}.negativeMarks`}
                                      label="Negative Marks"
                                      placeholder="Select negative marks"
                                      className="w-[120px] md:w-[180px] h-9"
                                      options={[
                                        { label: "0", value: `0` },
                                        { label: "0.25", value: `0.25` },
                                        { label: "0.5", value: `0.5` },
                                        { label: "1", value: `1` },
                                      ]}
                                      defaultValue={field.question.negativeMarks || "0"}
                                    />
                                    {questionFields.length > 1 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeQuestion(field.index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-auto"
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-6 pt-4">
                                  <InputElement
                                    name={`questions.${field.index}.question`}
                                    label="Question"
                                    placeholder="Enter your question here"
                                  />

                                  <div className="space-y-1">
                                    <Label className="text-base">Options</Label>
                                    <Controller
                                      control={form.control}
                                      name={`questions.${field.index}.correctAnswer`}
                                      render={({ field: radioField }) => (
                                        <RadioGroup
                                          onValueChange={(value) => radioField.onChange(Number.parseInt(value))}
                                          value={radioField.value.toString()}
                                          className="space-y-0"
                                        >
                                          {[0, 1, 2, 3].map((optionIndex) => (
                                            <div
                                              key={optionIndex}
                                              className="flex items-center space-x-3 border rounded-md p-3 transition-colors"
                                            >
                                              <RadioGroupItem
                                                value={optionIndex.toString()}
                                                id={`q${field.index}-option${optionIndex}`}
                                              />
                                              <div className="flex-1">
                                                <Input
                                                  {...form.register(`questions.${field.index}.options.${optionIndex}`, {
                                                    required: "Option text is required",
                                                  })}
                                                  placeholder={`Option ${optionIndex + 1}`}
                                                  className="border-0 focus-visible:ring-0 px-2 shadow-none"
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </RadioGroup>
                                      )}
                                    />
                                    {form.formState.errors.questions?.[field.index]?.options && (
                                      <p className="text-sm text-red-500">
                                        {form.formState.errors.questions[field.index]?.options?.message || "All options are required"}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <TextareaElement
                                      name={`questions.${field.index}.explanation`}
                                      label="Explanation (Optional)"
                                      placeholder="Explain the correct answer (optional)"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                      {form.watch(`questions.${field.index}.explanation`)?.length || 0}/500 characters
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </Card >
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
