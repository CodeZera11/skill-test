"use client"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusCircle, Trash2 } from "lucide-react"

type QuestionOption = {
  text: string
}

type Question = {
  questionText: string
  options: QuestionOption[]
  correctAnswer: number
}

type FormValues = {
  questions: Question[]
}

export function McqCreationForm() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      questions: Array(5)
        .fill(null)
        .map(() => ({
          questionText: "",
          options: Array(4)
            .fill(null)
            .map(() => ({ text: "" })),
          correctAnswer: 0,
        })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data)
    // Here you would typically send the data to your backend
    alert("Form submitted successfully! Check console for data.")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {fields.map((field, questionIndex) => (
        <Card key={field.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium">Question {questionIndex + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(questionIndex)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor={`questions.${questionIndex}.questionText`} className="text-base">
                  Question
                </Label>
                <Input
                  id={`questions.${questionIndex}.questionText`}
                  {...register(`questions.${questionIndex}.questionText`, {
                    required: "Question text is required",
                  })}
                  placeholder="Enter your question here"
                  className="mt-1"
                />
                {errors.questions?.[questionIndex]?.questionText && (
                  <p className="text-sm text-red-500 mt-1">{errors.questions[questionIndex]?.questionText?.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-base">Options</Label>
                <Controller
                  control={control}
                  name={`questions.${questionIndex}.correctAnswer`}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value.toString()}
                      className="space-y-3"
                    >
                      {[0, 1, 2, 3].map((optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-3 border rounded-md p-3 hover:bg-gray-50 transition-colors"
                        >
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`q${questionIndex}-option${optionIndex}`}
                          />
                          <div className="flex-1">
                            <Input
                              {...register(`questions.${questionIndex}.options.${optionIndex}.text`, {
                                required: "Option text is required",
                              })}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="border-0 focus-visible:ring-0 p-0 shadow-none"
                            />
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.questions?.[questionIndex]?.options && (
                  <p className="text-sm text-red-500">All options are required</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              questionText: "",
              options: Array(4)
                .fill(null)
                .map(() => ({ text: "" })),
              correctAnswer: 0,
            })
          }
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="px-8">
          Save Questions
        </Button>
      </div>
    </form>
  )
}
