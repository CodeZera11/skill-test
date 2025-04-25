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

// Mock data - in a real app, this would come from your Convex database
const getMockQuestions = (testId: string) => {
  // Generate a larger set of questions for demonstration
  const baseQuestions = [
    {
      id: "q1",
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: 1,
      sectionId: "section1",
    },
    {
      id: "q2",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctAnswer: 2,
      sectionId: "section1",
    },
    {
      id: "q3",
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2,
      sectionId: "section2",
    },
    {
      id: "q4",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      sectionId: "section2",
    },
    {
      id: "q5",
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: 1,
      sectionId: "section1",
    },
  ]

  // For demo purposes, duplicate the base questions to simulate a larger set
  // In a real app, you would fetch the actual questions from your database
  const questions = []
  const totalQuestions = 100 // Simulate 100 questions

  for (let i = 0; i < totalQuestions; i++) {
    const baseQuestion = baseQuestions[i % baseQuestions.length]
    questions.push({
      ...baseQuestion,
      id: `q${i + 1}`,
      question: `${baseQuestion.question} (Question ${i + 1})`,
    })
  }

  return questions
}

const getTestDetails = (testId: string) => {
  const mockTests = {
    test1: {
      id: "test1",
      name: "General Knowledge Test",
      totalQuestions: 5, // Matching our mock questions
      duration: 10, // 10 minutes for demo
      totalMarks: 10,
    },
    test2: {
      id: "test2",
      name: "Mathematics Aptitude",
      totalQuestions: 5,
      duration: 10,
      totalMarks: 10,
    },
    test3: {
      id: "test3",
      name: "Logical Reasoning",
      totalQuestions: 5,
      duration: 10,
      totalMarks: 10,
    },
  }

  return mockTests[testId as keyof typeof mockTests]
}

export default function TestAttemptPage({
  params,
}: {
  params: { testId: string; questionNumber: string }
}) {
  const router = useRouter()
  const questionNumber = Number.parseInt(params.questionNumber)
  const questions = getMockQuestions(params.testId)
  const test = getTestDetails(params.testId)

  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})

  // Add this function after the useState declarations
  const saveAnswerToLocalStorage = (questionId: string, answerIndex: number | null) => {
    // Get existing answers from localStorage
    const savedAnswers = localStorage.getItem(`test_${params.testId}_answers`)
    const allAnswers = savedAnswers ? JSON.parse(savedAnswers) : {}

    // Update just this answer
    allAnswers[questionId] = answerIndex

    // Save back to localStorage
    localStorage.setItem(`test_${params.testId}_answers`, JSON.stringify(allAnswers))

    // Update state
    setAnswers(allAnswers)
  }

  const saveMarkedForReviewToLocalStorage = (questionId: string, isMarked: boolean) => {
    // Get existing marked questions from localStorage
    const savedMarked = localStorage.getItem(`test_${params.testId}_marked`)
    const allMarked = savedMarked ? JSON.parse(savedMarked) : {}

    // Update just this question
    allMarked[questionId] = isMarked

    // Save back to localStorage
    localStorage.setItem(`test_${params.testId}_marked`, JSON.stringify(allMarked))

    // Update state
    setMarkedForReview(allMarked)
  }

  // Initialize from localStorage on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`test_${params.testId}_answers`)
    const savedMarkedForReview = localStorage.getItem(`test_${params.testId}_marked`)

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    if (savedMarkedForReview) {
      setMarkedForReview(JSON.parse(savedMarkedForReview))
    }
  }, [params.testId])

  const handleAnswerChange = (value: string) => {
    saveAnswerToLocalStorage(currentQuestion.id, Number.parseInt(value))
  }

  const handleMarkForReview = (checked: boolean) => {
    saveMarkedForReviewToLocalStorage(currentQuestion.id, checked)
  }

  const navigateToQuestion = (number: number) => {
    router.push(`/tests/${params.testId}/attempt/${number}`)
  }

  const handleTimeUp = () => {
    // Submit the test when time is up
    router.push(`/tests/${params.testId}/result`)
  }

  const submitTest = () => {
    // In a real app, you would save the answers to your database here
    router.push(`/tests/${params.testId}/result`)
  }

  const currentQuestion = questions[questionNumber - 1]

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Question {questionNumber} of {questions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                {markedForReview[currentQuestion.id] && (
                  <Badge variant="outline" className="bg-yellow-100">
                    Marked for Review
                  </Badge>
                )}
                <TestTimer durationInMinutes={test.duration} onTimeUp={handleTimeUp} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">{currentQuestion.question}</div>

              <RadioGroup
                value={answers[currentQuestion.id]?.toString() || ""}
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
                  checked={markedForReview[currentQuestion.id] || false}
                  onCheckedChange={(checked) => handleMarkForReview(!!checked)}
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

              {questionNumber < questions.length ? (
                <Button onClick={() => navigateToQuestion(questionNumber + 1)}>Next</Button>
              ) : (
                <Button onClick={submitTest}>Submit Test</Button>
              )}
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
                  <span className="font-medium">Question {questionNumber}</span> of {questions.length}
                </div>

                {/* Pagination for large question sets */}
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-10 gap-1 max-h-[300px] overflow-y-auto p-1">
                    {questions.map((_, index) => {
                      const qNum = index + 1
                      const qId = questions[index].id
                      let bgColor = "bg-muted"

                      if (answers[qId] !== undefined && answers[qId] !== null) {
                        bgColor = "bg-green-100"
                      }

                      if (markedForReview[qId]) {
                        bgColor = "bg-yellow-100"
                      }

                      if (qNum === questionNumber) {
                        bgColor = "bg-primary text-primary-foreground"
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

                  {/* Jump to question input for very large question sets */}
                  <div className="flex items-center space-x-2 mt-4">
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
                  </div>
                </div>

                <div className="mt-6 space-y-2">
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
              <Button onClick={submitTest} className="w-full">
                Submit Test
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
