"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { TestTimer } from "@/components/test-timer"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { toast } from "sonner"

const TestPageContainer = ({
  testId,
  questionNumber,
  attemptId,
  sectionId,
}: {
  questionNumber: number
  testId: Id<"tests">
  attemptId: Id<"testAttempts">
  sectionId: Id<"sections">
}) => {
  const router = useRouter()

  const attempt = useQuery(api.testAttempts.getTestAttempt, { id: attemptId })

  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [remainingTime, setRemainingTime] = useState<number | null>(null) // Track remaining time


  const submitSectionMutation = useMutation(api.testAttempts.submitSection)

  const currentSectionDurationInMinutes = (attempt?.sections.find(s => s._id === sectionId)?.durationInSeconds || 0) / 60

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test_${testId}_answers`)
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
      console.log("Loaded answers from local storage:", JSON.parse(savedAnswers)) // Debugging
    }
  }, [testId])

  useEffect(() => {
    const savedTime = localStorage.getItem(`test_${testId}_section_${sectionId}_remainingTime`)
    if (savedTime) {
      setRemainingTime(Number(savedTime))
    } else if (currentSectionDurationInMinutes) {
      setRemainingTime(currentSectionDurationInMinutes * 60) // Initialize with total duration in seconds
    }
  }, [testId, sectionId, currentSectionDurationInMinutes])

  useEffect(() => {
    const savedMarkedForReview = localStorage.getItem(`test_${testId}_marked`)
    if (savedMarkedForReview) {
      setMarkedForReview(JSON.parse(savedMarkedForReview))
      console.log("Loaded marked for review from local storage:", JSON.parse(savedMarkedForReview)) // Debugging
    }
  }, [testId])

  const updateRemainingTime = (time: number) => {
    setRemainingTime(time)
    localStorage.setItem(`test_${testId}_section_${sectionId}_remainingTime`, time.toString())
  }

  const handleTimeUp = () => {
    console.log({ submit: "Time is up, submitting section..." })
    submitSection()
  }

  const handleAnswerChange = (value: string) => {
    const questionId = currentQuestion?._id
    if (!questionId) {
      console.error("Question ID is undefined.")
      return
    }

    const updatedAnswers = { ...answers, [questionId]: Number(value) }
    setAnswers(updatedAnswers)

    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(updatedAnswers))
    console.log("Updated answers:", updatedAnswers) // Debugging
  }

  // const submitSection = () => {
  //   const isLastSection = attempt?.sections[attempt.sections.length - 1]._id === sectionId

  //   toast.promise(() => submitTestAttempt({ answers, testAttemptId: attemptId }), {
  //     loading: isLastSection ? "Submitting test..." : "Submitting section...",
  //     success: () => {
  //       localStorage.removeItem(`test_${testId}_answers`)
  //       localStorage.removeItem(`test_${testId}_marked`)
  //       localStorage.removeItem(`test_${testId}_section_${sectionId}_remainingTime`)
  //       if (isLastSection) {
  //         router.push(`/tests/${testId}/attempt/${attemptId}/result`) // Navigate to test result page
  //       } else {
  //         router.push(`/tests/${testId}/${attemptId}/sections`) // Navigate back to section navigation
  //       }
  //       return isLastSection ? "Test submitted successfully!" : "Section submitted successfully!"
  //     },
  //     error: (error) => `Error: ${error.message}`,
  //   })
  // }

  const submitSection = () => {
    toast.promise(
      submitSectionMutation({
        testAttemptId: attemptId,
        sectionId,
        timeSpentInSeconds: currentSectionDurationInMinutes * 60 - (remainingTime || 0), // Calculate time spent
        answers,
      }),
      {
        loading: "Submitting section...",
        success: () => {
          localStorage.removeItem(`test_${testId}_answers`)
          localStorage.removeItem(`test_${testId}_marked`)
          localStorage.removeItem(`test_${testId}_section_${sectionId}_remainingTime`)
          router.push(`/tests/${testId}/${attemptId}/sections`) // Navigate back to sections page
          return "Section submitted successfully!"
        },
        error: (error) => `Error: ${error.message}`,
      }
    )
  }

  const navigateToQuestion = (number: number) => {
    if (number < 1 || number > sectionQuestions.length) return // Ensure valid question number
    localStorage.setItem(`test_${testId}_section_${sectionId}_remainingTime`, remainingTime?.toString() || "")
    router.push(`/tests/${testId}/${attemptId}/sections/${sectionId}/q/${number}`)
  }

  const handleMarkForReview = (checked: boolean) => {
    const questionId = currentQuestion?._id
    if (!questionId) {
      console.error("Question ID is undefined.")
      return
    }

    const updatedMarkedForReview = { ...markedForReview, [questionId]: checked }
    setMarkedForReview(updatedMarkedForReview)

    localStorage.setItem(`test_${testId}_marked`, JSON.stringify(updatedMarkedForReview))
    console.log("Updated marked for review:", updatedMarkedForReview) // Debugging
  }

  useEffect(() => {
    const savedMarkedForReview = localStorage.getItem(`test_${testId}_marked`)
    if (savedMarkedForReview) {
      setMarkedForReview(JSON.parse(savedMarkedForReview))
      console.log("Loaded marked for review from local storage:", JSON.parse(savedMarkedForReview)) // Debugging
    }
  }, [testId])

  if (attempt === undefined) {
    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>Loading Attempt...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we prepare your test attempt.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (attempt === null) {
    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>Attempt not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The test attempt you are looking for does not exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sectionQuestions = attempt?.questions?.filter((q) => q.sectionId === sectionId)
  if (sectionQuestions.length === 0) {
    console.error("No questions found for the current section.")
  }
  const currentQuestion = sectionQuestions[questionNumber - 1]
  if (!currentQuestion) {
    console.error(`Question ${questionNumber} not found in section ${sectionId}.`)
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>Question not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The question you are looking for does not exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!remainingTime) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-6 px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-col items-start gap-4 md:gap-0 md:flex-row md:items-center">
              <CardTitle className="md:text-nowrap">
                Question {questionNumber} of {sectionQuestions.length}
              </CardTitle>
              <div className="flex items-center gap-2 flex-row-reverse md:flex-row justify-between w-full md:justify-end">
                {markedForReview[currentQuestion?._id] && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Marked for Review
                  </Badge>
                )}
                <TestTimer
                  remainingTime={remainingTime}
                  onTimeUp={handleTimeUp}
                  updateRemainingTime={updateRemainingTime}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">{currentQuestion?.question}</div>
              <RadioGroup
                value={answers[currentQuestion._id]?.toString() || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="review"
                  checked={markedForReview[currentQuestion._id] || false}
                  onCheckedChange={(checked) => handleMarkForReview(checked as boolean)}
                />
                <label htmlFor="review" className="text-sm font-medium leading-none">
                  Mark for review
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(questionNumber - 1)}
                disabled={questionNumber === 1}
              >
                Previous
              </Button>

              {questionNumber < sectionQuestions.length ? (
                <Button onClick={() => navigateToQuestion(questionNumber + 1)}>Next</Button>
              ) : (
                <Button onClick={submitSection}>Submit Section</Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Question Navigator */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="text-sm mb-2">
                  <span className="font-medium">Question {questionNumber}</span> of {sectionQuestions.length}
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
                    {sectionQuestions.map((_, index) => {
                      const qNum = index + 1
                      const qId = sectionQuestions[index]?._id || `index + test`
                      let bgColor = "bg-muted"

                      if (answers[qId] !== undefined && answers[qId] !== null) {
                        bgColor = "bg-green-100 text-black dark:bg-green-200 dark:text-black dark:hover:bg-green-300"
                      }

                      if (markedForReview[qId]) {
                        bgColor = "bg-yellow-100 text-black dark:bg-yellow-200 dark:text-black dark:hover:bg-yellow-300"
                      }

                      if (qNum === questionNumber) {
                        bgColor = "bg-primary text-white dark:bg-primary-200 dark:text-black dark:hover:bg-white"
                      }

                      console.log(`Question ${qNum} - Marked for Review:`, markedForReview[qId]) // Debugging

                      return (
                        <Button
                          key={qNum}
                          variant="outline"
                          className={`h-8 w-8 p-0 text-xs font-medium ${bgColor}`}
                          onClick={() => navigateToQuestion(qNum)}
                        >
                          {qNum}
                        </Button>
                      )
                    })}
                  </div>

                  {/* Jump to question input for very large question sets */}
                  {/* <div className="flex items-center space-x-2 mt-4">
                    <div className="text-sm">Jump to:</div>
                    <input
                      type="number"
                      min="1"
                      max={questions.length}
                      className="w-16 h-8 border rounded px-2 text-sm"
                      onChange={(e) => {
                        const num = Number.parseInt(e.target.value)
                        if (num >= 1 && num <= questions.length) {
                          navigateToQuestion(num)
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[type="number"]') as HTMLInputElement
                        const num = Number.parseInt(input.value)
                        if (num >= 1 && num <= questions.length) {
                          navigateToQuestion(num)
                        }
                      }}
                    >
                      Go
                    </Button>
                  </div> */}
                </div>

                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span className="text-sm">Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span className="text-sm">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                    <span className="text-sm">Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Current Question</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={submitSection} className="w-full">
                Submit Section
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TestPageContainer