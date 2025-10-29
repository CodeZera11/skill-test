"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { TestTimer } from "@/components/test-timer"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const TestPageContainer = ({
  testId,
  attemptId
}: {
  testId: Id<"tests">
  attemptId: Id<"testAttempts">
  questionNumber: number
  sectionId: Id<"sections">
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const sectionId = searchParams.get("sectionId") as Id<"sections"> || ""
  const questionNumber = Number(searchParams.get("questionNumber")) || 1

  const attempt = useQuery(api.testAttempts.getTestAttempt, { id: attemptId })
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number>(questionNumber)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const submitTestMutation = useMutation(api.testAttempts.submitTestAttempt)

  const totalTestDurationInSeconds = attempt?.sections.reduce(
    (total, section) => total + (section.durationInSeconds || 0),
    0
  )

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test_${testId}_answers`);
    const savedCurrentQuestion = localStorage.getItem(`test_${testId}_currentQuestion`);

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
    if (savedCurrentQuestion) {
      setCurrentQuestion(Number(savedCurrentQuestion));
    }
  }, [testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(answers));
  }, [answers, testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_currentQuestion`, currentQuestion.toString());
  }, [currentQuestion, testId]);

  useEffect(() => {
    if (totalTestDurationInSeconds) {
      const savedTime = localStorage.getItem(`test_${testId}_remainingTime`)
      if (savedTime) {
        setRemainingTime(Number(savedTime))
      } else {
        setRemainingTime(totalTestDurationInSeconds)
      }
    }
  }, [testId, totalTestDurationInSeconds])

  const updateRemainingTime = (time: number) => {
    setRemainingTime(time)
    localStorage.setItem(`test_${testId}_remainingTime`, time.toString())
  }

  const handleTimeUp = () => {
    console.log("Time is up, submitting test...")
    submitTest()
  }

  const handleAnswerChange = (value: string) => {
    const questionId = currentQuestionData?._id
    if (!questionId) {
      console.error("Question ID is undefined.")
      return
    }

    const updatedAnswers = { ...answers, [questionId]: Number(value) }
    setAnswers(updatedAnswers)
  }

  const submitTest = () => {
    toast.promise(
      submitTestMutation({
        testAttemptId: attemptId,
        answers,
      }),
      {
        loading: "Submitting test...",
        success: () => {
          localStorage.removeItem(`test_${testId}_remainingTime`);
          localStorage.removeItem(`test_${testId}_answers`);
          localStorage.removeItem(`test_${testId}_currentQuestion`);
          router.push(`/tests/${testId}/attempt/${attemptId}/result`)
          return "Test submitted successfully!"
        },
        error: (error) => `Error: ${error.message}`,
      }
    )
  }

  const handleSectionChange = (newSectionId: Id<"sections">) => {
    router.push(`/tests/${testId}/${attemptId}?sectionId=${newSectionId}&questionNumber=0`)
  }

  const navigateToQuestion = (number: number) => {
    if (number < 1 || number > sectionQuestions.length) return
    setCurrentQuestion(number)
    router.push(`/tests/${testId}/${attemptId}?sectionId=${sectionId}&questionNumber=${number}`)
  }

  const hasUnansweredQuestions = () => {
    return sectionQuestions.some((q) => answers[q._id] === undefined || answers[q._id] === null);
  };

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

    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>No Questions found</CardTitle>
            <CardDescription>
              Sorry for the inconvenience the selection section does not have any questions. We are working to add questions as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 overflow-scroll max-w-[600px] pb-4">
              {attempt.sections.map((section) => (
                <Button
                  key={section._id}
                  onClick={() => handleSectionChange(section._id)}
                  className={`px-4 py-2 rounded-md font-medium ${sectionId === section._id
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                >
                  {section.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!remainingTime) return <div>Loading...</div>

  const currentQuestionData = sectionQuestions[currentQuestion - 1]

  return (
    <div className="container mx-auto py-6 px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Test Content */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-col items-start gap-4 md:gap-0 md:flex-row md:items-center">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-lg">
                  Sections
                  {/* <Select
                  onValueChange={handleSectionChange}
                  value={sectionId}
                >
                  <SelectTrigger>
                    <span className="truncate text-black">
                      {attempt.sections.find((s) => s._id === sectionId)?.name || "Select Section"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {attempt.sections.map((section) => (
                      <SelectItem key={section._id} value={section._id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                  {/* <select
                  value={sectionId}
                  onChange={(e) => handleSectionChange(e.target.value as Id<"sections">)}
                  className="border rounded-md p-1"
                >
                  {attempt.sections.map((section) => (
                    <option key={section._id} value={section._id}>
                      {section.name}
                    </option>
                  ))}
                </select> */}
                </CardTitle>
                <div className="flex gap-2 overflow-scroll max-w-[600px] pb-4">
                  {attempt.sections.map((section) => (
                    <Button
                      key={section._id}
                      onClick={() => handleSectionChange(section._id)}
                      className={`px-4 py-2 rounded-md font-medium ${sectionId === section._id
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                    >
                      {section.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse md:flex-row justify-between w-full md:justify-end">
                <TestTimer
                  remainingTime={remainingTime}
                  onTimeUp={handleTimeUp}
                  updateRemainingTime={updateRemainingTime}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">{currentQuestionData?.question}</div>
              <RadioGroup
                value={answers[currentQuestionData._id]?.toString() || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="w-full flex items-center justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(currentQuestion - 1)}
                disabled={currentQuestion <= 1}
              >
                Previous Question
              </Button>
              <Button
                variant="outline"
                onClick={() => navigateToQuestion(currentQuestion + 1)}
                disabled={currentQuestion >= sectionQuestions.length}
              >
                Next Question
              </Button>
            </CardFooter>
          </Card>
        </div>

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
                        bgColor = "bg-green-100 text-black dark:bg-green-200 dark:text-black dark:hover:bg-green-300";
                      }




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
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Current Question</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {/* <Button className="w-full" onClick={submitTest} disabled={remainingTime === 0}>
                Submit Test
              </Button> */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={remainingTime === 0}>
                    Submit Test
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Test</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {hasUnansweredQuestions() ? (
                      <DialogDescription>
                        Are you sure you want to submit the test?
                      </DialogDescription>
                    ) : (
                      <DialogDescription>
                        Are you sure you want to submit the test? Once submitted, you cannot make changes.
                      </DialogDescription>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitTest}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TestPageContainer