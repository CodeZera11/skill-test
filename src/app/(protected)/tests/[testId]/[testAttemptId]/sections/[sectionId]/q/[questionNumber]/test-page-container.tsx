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

const STATUS = {
  NOT_VISITED: "not_visited",
  NOT_ANSWERED: "not_answered",
  ANSWERED: "answered",
  MARKED_FOR_REVIEW: "marked_for_review",
  ANSWERED_AND_MARKED: "answered_and_marked",
  CURRENT: "current",
}

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
  const [sectionTimer, setSectionTimer] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number>(questionNumber)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New states for review and visited
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [visited, setVisited] = useState<Record<string, boolean>>({})

  const submitTestMutation = useMutation(api.testAttempts.submitTestAttempt)

  const currentSectionDurationInSeconds = attempt?.sections.find(s => s._id === sectionId)?.durationInSeconds || 0;
  const totalTestDurationInSeconds = attempt?.sections.reduce(
    (total, section) => total + (section.durationInSeconds || 0),
    0
  )

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test_${testId}_answers`);
    const savedCurrentQuestion = localStorage.getItem(`test_${testId}_currentQuestion`);
    const savedMarkedForReview = localStorage.getItem(`test_${testId}_markedForReview`);
    const savedVisited = localStorage.getItem(`test_${testId}_visited`);

    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedCurrentQuestion) setCurrentQuestion(Number(savedCurrentQuestion));
    if (savedMarkedForReview) setMarkedForReview(JSON.parse(savedMarkedForReview));
    if (savedVisited) setVisited(JSON.parse(savedVisited));
  }, [testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(answers));
  }, [answers, testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_currentQuestion`, currentQuestion.toString());
  }, [currentQuestion, testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_markedForReview`, JSON.stringify(markedForReview));
  }, [markedForReview, testId]);

  useEffect(() => {
    localStorage.setItem(`test_${testId}_visited`, JSON.stringify(visited));
  }, [visited, testId]);


  useEffect(() => {
    if (currentSectionDurationInSeconds) {
      // setSectionTimer(currentSectionDurationInSeconds);
      const savedSectionTime = localStorage.getItem(`test_${testId}_section_${sectionId}_remainingTime`);
      if (savedSectionTime) {
        setSectionTimer(Number(savedSectionTime));
      } else {
        setSectionTimer(currentSectionDurationInSeconds);
      }
    }
  }, [testId, sectionId, currentSectionDurationInSeconds])

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

  const updateSectionTime = (time: number) => {
    setSectionTimer(time)
    localStorage.setItem(`test_${testId}_section_${sectionId}_remainingTime`, time.toString())
  }

  const updateRemainingTime = (time: number) => {
    setRemainingTime(time)
    localStorage.setItem(`test_${testId}_remainingTime`, time.toString())
  }

  const handleSectionTimeUp = () => {
    // Auto-navigate to next section or submit test if last section

  }

  const handleTimeUp = () => {
    submitTest()
  }

  const handleAnswerChange = (value: string) => {
    const questionId = currentQuestionData?._id
    if (!questionId) {
      console.error("Question ID is undefined.")
      return
    }
    setAnswers(prev => ({ ...prev, [questionId]: Number(value) }))
    setVisited(prev => ({
      ...prev,
      [questionId]: true
    }))
  }

  const handleMarkForReview = () => {
    const questionId = currentQuestionData?._id
    if (!questionId) return
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const handleClearResponse = () => {
    const questionId = currentQuestionData?._id
    if (!questionId) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: null
    }))
  }

  const submitSection = () => {
    const currentSectionIndex = attempt?.sections.findIndex(val => val._id === sectionId);

    if (currentSectionIndex === undefined || currentSectionIndex === -1) {
      console.error("Current section index is undefined or invalid.");
      return;
    }

    setCurrentQuestion(1)
    setIsDialogOpen(false);

    if (currentSectionIndex === (attempt?.sections.length || 0) - 1) {
      submitTest();
    } else {
      const nextSectionId = attempt?.sections[currentSectionIndex + 1]._id;
      const nextSectionDuration = attempt?.sections[currentSectionIndex + 1].durationInSeconds || 0;

      if (nextSectionId) {
        localStorage.removeItem(`test_${testId}_section_${nextSectionId}_remainingTime`);
        setSectionTimer(nextSectionDuration);
        router.push(`/tests/${testId}/${attemptId}?sectionId=${nextSectionId}&questionNumber=1`);
      }
    }
  }

  const submitTest = () => {
    toast.promise(
      submitTestMutation({
        testAttemptId: attemptId,
        answers,
        // markedForReview,
      }),
      {
        loading: "Submitting test...",
        success: () => {
          localStorage.removeItem(`test_${testId}_remainingTime`);
          localStorage.removeItem(`test_${testId}_answers`);
          localStorage.removeItem(`test_${testId}_currentQuestion`);
          localStorage.removeItem(`test_${testId}_markedForReview`);
          localStorage.removeItem(`test_${testId}_visited`);
          router.push(`/tests/${testId}/attempt/${attemptId}/result`)
          return "Test submitted successfully!"
        },
        error: (error) => `Error: ${error.message}`,
      }
    )
  }

  const handleSectionChange = (newSectionId: Id<"sections">) => {
    router.push(`/tests/${testId}/${attemptId}?sectionId=${newSectionId}&questionNumber=1`)
  }

  const navigateToQuestion = (number: number) => {
    if (number < 1 || number > sectionQuestions.length) return
    setCurrentQuestion(number)
    // Mark as visited
    const questionId = sectionQuestions[number - 1]?._id
    if (questionId) {
      setVisited(prev => ({
        ...prev,
        [questionId]: true
      }))
    }
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

  const sectionQuestions = attempt?.questions?.filter((q) => q.sectionId === sectionId) || []
  if (sectionQuestions.length === 0) {
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

  if (!remainingTime || !sectionTimer) return <div>Loading...</div>

  const currentQuestionData = sectionQuestions[currentQuestion - 1]

  // Helper to get status for navigator
  const getQuestionStatus = (qId: string, qNum: number) => {
    if (currentQuestion === qNum) return STATUS.CURRENT
    if (!visited[qId]) return STATUS.NOT_VISITED
    if (answers[qId] !== undefined && answers[qId] !== null) {
      if (markedForReview[qId]) return STATUS.ANSWERED_AND_MARKED
      return STATUS.ANSWERED
    }
    if (markedForReview[qId]) return STATUS.MARKED_FOR_REVIEW
    return STATUS.NOT_ANSWERED
  }

  // Helper to get color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case STATUS.ANSWERED: return "bg-green-100 text-black dark:bg-green-200 dark:text-black dark:hover:bg-green-300"
      case STATUS.NOT_ANSWERED: return "bg-red-300 text-black dark:bg-red-400"
      case STATUS.ANSWERED_AND_MARKED: return "bg-yellow-300 text-black dark:bg-yellow-400"
      case STATUS.MARKED_FOR_REVIEW: return "bg-purple-300 text-black dark:bg-purple-400"
      case STATUS.NOT_VISITED: return "bg-gray-300 text-black dark:bg-gray-400"
      case STATUS.CURRENT: return "bg-black text-white"
      default: return "bg-muted"
    }
  }

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
                      disabled={section._id !== sectionId}
                    >
                      {section.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse md:flex-row justify-between w-full md:justify-end">
                <TestTimer
                  remainingTime={sectionTimer}
                  onTimeUp={handleSectionTimeUp}
                  updateRemainingTime={updateSectionTime}
                  label="Section Time Remaining"
                  totalTime={currentSectionDurationInSeconds}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* lets show question number here */}
              <div className="space-y-2">
                <div className="text-sm">
                  Question {currentQuestion} of {sectionQuestions.length}
                </div>
                <div className="text-lg font-medium">{currentQuestionData?.question}</div>
              </div>
              <RadioGroup
                value={answers[currentQuestionData?._id]?.toString() || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestionData?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {/* New buttons below question */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant={markedForReview[currentQuestionData?._id] ? "secondary" : "outline"}
                  onClick={handleMarkForReview}
                >
                  {markedForReview[currentQuestionData?._id] ? "Unmark Review" : "Mark for Review"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearResponse}
                >
                  Clear Response
                </Button>
              </div>
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
            <CardHeader className="space-y-5">
              <TestTimer
                remainingTime={remainingTime}
                onTimeUp={handleTimeUp}
                updateRemainingTime={updateRemainingTime}
                label="Total Time Remaining"
                totalTime={totalTestDurationInSeconds || 0}
              />
              <CardTitle>Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="text-sm mb-2">
                  <span className="font-medium">Question {currentQuestion}</span> of {sectionQuestions.length}
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center flex-wrap gap-2 max-h-[300px] overflow-y-auto p-1">
                    {sectionQuestions.map((_, index) => {
                      const qNum = index + 1
                      const qId = sectionQuestions[index]?._id || `index + test`
                      const status = getQuestionStatus(qId, qNum)
                      const bgColor = getStatusColor(status)
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

                {/* Legend */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span className="text-sm">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-300 rounded"></div>
                    <span className="text-sm">Not Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span className="text-sm">Answered & Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-300 rounded"></div>
                    <span className="text-sm">Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <span className="text-sm">Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black rounded"></div>
                    <span className="text-sm text-black">Current Question</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={remainingTime === 0}>
                    Submit Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Section</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {hasUnansweredQuestions() ? (
                      <DialogDescription>
                        Are you sure you want to submit this section?
                      </DialogDescription>
                    ) : (
                      <DialogDescription>
                        Are you sure you want to submit this section? Once submitted, you cannot make changes.
                      </DialogDescription>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={submitSection}>Submit</Button>
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