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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const STATUS = {
  NOT_VISITED: "not_visited",
  NOT_ANSWERED: "not_answered",
  ANSWERED: "answered",
  MARKED_FOR_REVIEW: "marked_for_review",
  ANSWERED_AND_MARKED: "answered_and_marked",
  CURRENT: "current",
}

const DELAY_MS = 1500 // 1.5 seconds delay for timer initialization

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
  const [remainingSectionTime, setRemainingSectionTime] = useState<number | null>(null)
  const [remainingTotalTime, setRemainingTotalTime] = useState<number | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<number>(questionNumber)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [lockedSections, setLockedSections] = useState<Set<Id<"sections">>>(new Set())
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [visited, setVisited] = useState<Record<string, boolean>>({})

  const submitTestMutation = useMutation(api.testAttempts.submitTestAttempt)

  // Get sections and current section index
  const sections = attempt?.sections || []
  useEffect(() => {
    if (sections.length > 0 && sectionId) {
      const idx = sections.findIndex(s => s._id === sectionId)
      setCurrentSectionIndex(idx === -1 ? 0 : idx)
    }
  }, [sections, sectionId])

  // Section timer logic (defensive: fallback to default if missing/zero)
  useEffect(() => {
    if (sections.length > 0 && sectionId) {
      const section = sections.find(s => s._id === sectionId)
      if (section) {
        if (section.durationInSeconds && section.durationInSeconds > 0) {
          const timeout = setTimeout(() => {
            setRemainingSectionTime(section.durationInSeconds || null)
            console.log("Section timer set to", section.durationInSeconds)
          }, DELAY_MS)
          return () => clearTimeout(timeout)
        } else {
          setRemainingSectionTime(null) // No timer, show warning
          console.log("Section timer not set, durationInSeconds:", section.durationInSeconds)
        }
      }
    }
  }, [sectionId, sections])

  // Total timer logic with delay
  const totalTestDurationInSeconds = sections.reduce(
    (total, section) => total + (section.durationInSeconds || 0),
    0
  )
  useEffect(() => {
    if (sections.length > 0 && totalTestDurationInSeconds > 0) {
      const timeout = setTimeout(() => {
        setRemainingTotalTime(totalTestDurationInSeconds)
        console.log("Total timer set to", totalTestDurationInSeconds)
      }, DELAY_MS)
      return () => clearTimeout(timeout)
    }
  }, [totalTestDurationInSeconds, sections])

  // Section timer countdown
  useEffect(() => {
    console.log("Section timer countdown effect. remainingSectionTime:", remainingSectionTime)
    if (remainingSectionTime === null) return
    if (remainingSectionTime <= 0) {
      console.log("Section timer reached zero, calling handleSectionTimeUp")
      handleSectionTimeUp()
      return
    }
    const interval = setInterval(() => {
      setRemainingSectionTime(t => (t !== null ? t - 1 : t))
    }, 1000)
    return () => clearInterval(interval)
  }, [remainingSectionTime])

  // Total timer countdown
  useEffect(() => {
    console.log("Total timer countdown effect. remainingTotalTime:", remainingTotalTime)
    if (remainingTotalTime === null) return
    if (remainingTotalTime <= 0) {
      console.log("Total timer reached zero, calling handleTotalTimeUp")
      handleTotalTimeUp()
      return
    }
    const interval = setInterval(() => {
      setRemainingTotalTime(t => (t !== null ? t - 1 : t))
    }, 1000)
    return () => clearInterval(interval)
  }, [remainingTotalTime])

  // LocalStorage logic (optional, can be removed if not needed)
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test_${testId}_answers`)
    const savedMarkedForReview = localStorage.getItem(`test_${testId}_markedForReview`)
    const savedVisited = localStorage.getItem(`test_${testId}_visited`)
    const savedLockedSections = localStorage.getItem(`test_${testId}_lockedSections`)
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
    if (savedMarkedForReview) setMarkedForReview(JSON.parse(savedMarkedForReview))
    if (savedVisited) setVisited(JSON.parse(savedVisited))
    if (savedLockedSections) setLockedSections(new Set(JSON.parse(savedLockedSections)))
  }, [testId])

  useEffect(() => {
    localStorage.setItem(`test_${testId}_answers`, JSON.stringify(answers))
  }, [answers, testId])
  useEffect(() => {
    localStorage.setItem(`test_${testId}_markedForReview`, JSON.stringify(markedForReview))
  }, [markedForReview, testId])
  useEffect(() => {
    localStorage.setItem(`test_${testId}_visited`, JSON.stringify(visited))
  }, [visited, testId])
  useEffect(() => {
    localStorage.setItem(`test_${testId}_lockedSections`, JSON.stringify(Array.from(lockedSections)))
  }, [lockedSections, testId])

  // Section questions
  const sectionQuestions = attempt?.questions?.filter((q) => q.sectionId === sectionId) || []
  const currentQuestionData = sectionQuestions[currentQuestion - 1]

  // Navigator status logic
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

  // Section navigation is locked except for current
  const handleSectionChange = (newSectionId: Id<"sections">) => {
    if (lockedSections.has(newSectionId) || newSectionId !== sections[currentSectionIndex]._id) return
    router.push(`/tests/${testId}/${attemptId}?sectionId=${newSectionId}&questionNumber=1`)
  }

  // Question navigation
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

  // Mark for review
  const handleMarkForReview = () => {
    const questionId = currentQuestionData?._id
    if (!questionId) return
    setMarkedForReview(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  // Clear response
  const handleClearResponse = () => {
    const questionId = currentQuestionData?._id
    if (!questionId) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: null
    }))
  }

  // Section submit logic
  const handleSubmitSection = () => {
    setIsDialogOpen(true)
  }
  const confirmSubmitSection = async () => {
    setLockedSections(prev => new Set(prev).add(sections[currentSectionIndex]._id))
    setIsDialogOpen(false)
    if (currentSectionIndex + 1 < sections.length) {
      const nextSectionId = sections[currentSectionIndex + 1]._id
      router.push(`/tests/${testId}/${attemptId}?sectionId=${nextSectionId}&questionNumber=1`)
    } else {
      handleTotalTimeUp()
    }
  }

  // Section timer up
  const handleSectionTimeUp = () => {
    console.log("handleSectionTimeUp called")
    confirmSubmitSection()
  }

  // Total timer up
  const handleTotalTimeUp = () => {
    console.log("handleTotalTimeUp called")
    toast.promise(
      submitTestMutation({
        testAttemptId: attemptId,
        answers,
      }),
      {
        loading: "Submitting test...",
        success: () => {
          localStorage.removeItem(`test_${testId}_answers`)
          localStorage.removeItem(`test_${testId}_markedForReview`)
          localStorage.removeItem(`test_${testId}_visited`)
          localStorage.removeItem(`test_${testId}_lockedSections`)
          router.push(`/tests/${testId}/attempt/${attemptId}/result`)
          return "Test submitted successfully!"
        },
        error: (error) => `Error: ${error.message}`,
      }
    )
  }

  const handleAnswerChange = (value: string) => {
    const questionId = currentQuestionData?._id
    if (!questionId) return
    setAnswers(prev => ({
      ...prev,
      [questionId]: Number(value)
    }))
  }

  if (attempt === undefined) {
    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>Loading Attempt...</CardTitle>
          </CardHeader>
          <CardContent>
            Please wait while we prepare your test attempt.
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
            The test attempt you are looking for does not exist.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (sectionQuestions.length === 0) {
    return (
      <div className="container mx-auto py-10 px-2">
        <Card>
          <CardHeader>
            <CardTitle>No Questions found</CardTitle>
            <CardDescription>
              Sorry for the inconvenience the selected section does not have any questions. We are working to add questions as soon as possible.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (remainingSectionTime === null || remainingTotalTime === null) return <div className="h-screen flex items-center justify-center">Loading...</div>

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
                  {sections.map((section, idx) => (
                    <Button
                      key={section._id}
                      onClick={() => handleSectionChange(section._id)}
                      disabled={lockedSections.has(section._id) || idx !== currentSectionIndex}
                      className={`px-4 py-2 rounded-md font-medium
                        ${idx === currentSectionIndex
                          ? "bg-black text-white"
                          : lockedSections.has(section._id)
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                    >
                      {section.name}
                      {/* {lockedSections.has(section._id) && (
                        <span className="ml-2 text-xs">(Locked)</span>
                      )} */}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse md:flex-row justify-between w-full md:justify-end">
                {/* Section Timer */}
                <TestTimer
                  remainingTime={remainingSectionTime}
                  onTimeUp={handleSectionTimeUp}
                  updateRemainingTime={setRemainingSectionTime}
                  label="Section Timer"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question number */}
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
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {/* Buttons below question */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant={markedForReview[currentQuestionData._id] ? "secondary" : "outline"}
                  onClick={handleMarkForReview}
                >
                  {markedForReview[currentQuestionData._id] ? "Unmark Review" : "Mark for Review"}
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
              <Button
                className="ml-auto"
                onClick={handleSubmitSection}
                disabled={lockedSections.has(sections[currentSectionIndex]._id)}
              >
                {currentSectionIndex === sections.length - 1 ? "Submit Test" : "Submit Section"}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {currentSectionIndex === sections.length - 1 ? "Submit Test" : "Submit Section"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <DialogDescription>
                      {currentSectionIndex === sections.length - 1
                        ? "Are you sure you want to submit the test? You cannot undo this action."
                        : "Are you sure you want to submit this section? You cannot undo this action."}
                    </DialogDescription>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={confirmSubmitSection}>
                      {currentSectionIndex === sections.length - 1 ? "Submit Test" : "Submit Section"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                {/* Total Timer */}
                <div className="mb-2">
                  <TestTimer
                    remainingTime={remainingTotalTime}
                    onTimeUp={handleTotalTimeUp}
                    updateRemainingTime={setRemainingTotalTime}
                    label="Total Timer"
                  />
                </div>
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
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TestPageContainer