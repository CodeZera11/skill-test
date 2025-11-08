"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProgressRing } from "@/components/ui/progress-ring"
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel"
import { fadeIn, staggerContainer } from "@/constants/animations"
import { format } from "date-fns"
import { formatSeconds } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


const ResultPageContainer = ({ testAttemptId }: { testAttemptId: Id<"testAttempts">, testId: Id<"tests"> }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Fetch test attempt details from Convex
  const data = useQuery(api.testAttempts.getTestAttemptForResultPage, { id: testAttemptId });


  const test = data?.test;
  const sections = data?.sections;
  const testAttempt = data?.testAttempt;

  useEffect(() => {
    if (testAttempt && test && sections) {
      setIsLoading(false);
    }
  }, [testAttempt, test, sections]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg mb-8" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    )
  }

  if (!testAttempt || !test) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-medium mb-2">Test result not found</h3>
          <p className="text-muted-foreground mb-6">{`We couldn't find the test result you're looking for.`}</p>
          <Button asChild>
            <Link href="/tests">View All Tests</Link>
          </Button>
        </div>
      </div>
    )
  }

  const score = testAttempt?.score || 0
  const totalMarks = test?.totalMarks || 0
  const isDistinction = score >= totalMarks * 0.7
  const isAverage = score >= totalMarks * 0.5
  const correctAnswers = testAttempt?.correctAnswers || 0
  const totalQuestions = test?.totalQuestions || 1
  const timeTakenInSeconds = testAttempt?.timeTakenInSeconds || 0
  const durationInSeconds = test?.durationInSeconds || 0
  const detailedAnswers = testAttempt.answers;



  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">Test Result</h1>
            <Badge
              variant={isDistinction ? "success" : isAverage ? "warning" : "danger"}
              className="text-sm"
            >
              {isDistinction ? "Distinction" : isAverage ? "Average" : "Below Average"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {test.name} • Completed on {format(new Date(testAttempt?.endTime || ""), "dd MMMM yy")} at {format(new Date(testAttempt?.endTime || ""), "hh:mm a")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button> */}
          {/* <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button> */}
        </div>
      </motion.div >

      {/* Score Summary */}
      <motion.div
        className="flex flex-col lg:flex-row w-full items-stretch gap-6 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeIn} className="w-full h-full">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={score}
                label="Your Score"
                max={totalMarks}
                color={
                  isDistinction
                    ? "#10b981" // emerald-500
                    : score >= totalMarks * 0.5
                      ? "#3b82f6" // blue-500
                      : score >= totalMarks * 0.3
                        ? "#f59e0b" // amber-500
                        : "#ef4444" // red-500
                }
              />
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>
                  Score: {score}
                </span>
                <span>
                  Percentage: {((score / totalMarks) * 100).toFixed(2)}%
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="w-full h-full">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={(correctAnswers / totalQuestions) * 100}
                label="Correct Answers"
                color="#3b82f6" // blue-500
              />
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Correct: {testAttempt.correctAnswers}</span>
                <span>Incorrect: {testAttempt.incorrectAnswers}</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="w-full h-full">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Time Taken
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={timeTakenInSeconds > durationInSeconds ? durationInSeconds : timeTakenInSeconds}
                max={durationInSeconds}
                label="Time Taken"
                color="#f59e0b"
              />
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Your Time:{` `}
                  {formatSeconds(timeTakenInSeconds)}
                </span>
                <span>
                  Allowed:{` `}
                  {formatSeconds(durationInSeconds)}
                </span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detailed Answer Review</CardTitle>
            <CardDescription>Review each question, your answer, and the correct answer.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="">
              <div className="space-y-6 max-h-[600px] pr-4">
                {detailedAnswers?.map((answer, index) => {
                  if (!answer || !answer?.question || answer?.question.correctAnswer === undefined || answer?.question?.negativeMarks === undefined) return null;

                  const isUnattempted = answer.selectedOption == null;

                  return (
                    <div key={answer.questionId || index} className="border p-4 rounded-lg bg-background shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-md">
                          Question {index + 1}: {answer?.question?.question}
                        </h4>
                        {isUnattempted ? (
                          <Badge variant="warning" className="shrink-0">
                            <XCircle className="h-4 w-4 mr-0.5" /> Unattempted
                          </Badge>
                        ) : answer.isCorrect ? (
                          <Badge variant="success" className="shrink-0">
                            <CheckCircle className="h-4 w-4 mr-0.5" /> Correct
                          </Badge>
                        ) : (
                          <Badge variant="danger" className="shrink-0">
                            <XCircle className="h-4 w-4 mr-0.5" /> Incorrect
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        {answer?.question?.options.map((option, optionIndex) => {
                          const isSelected = optionIndex === answer.selectedOption
                          const isCorrectOption = optionIndex === answer?.question?.correctAnswer
                          let optionClass = "border-slate-300 dark:border-slate-700"
                          let indicatorIcon = null

                          if (isSelected) {
                            optionClass = answer.isCorrect
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            indicatorIcon = answer.isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                            )
                          } else if (isCorrectOption) {
                            optionClass =
                              "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            // Show correct tick only if user didn't select this and it's the right one
                            if (!isSelected) {
                              indicatorIcon = <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto" />
                            }
                          }

                          return (
                            <div
                              key={optionIndex}
                              className={`p-3 border rounded-md flex items-center text-sm transition-colors ${optionClass}`}
                            >
                              <span className="mr-2 font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span>{option}</span>
                              {indicatorIcon}
                            </div>
                          )
                        })}
                      </div>

                      {!answer.isCorrect && (
                        <div className="text-sm p-3 rounded-md bg-emerald-50 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800">
                          <p className="font-medium text-emerald-700 dark:text-emerald-300">
                            Correct Answer: {String.fromCharCode(65 + answer?.question?.correctAnswer || 0)}.{" "}
                            {answer?.question?.options[answer.question.correctAnswer]}
                          </p>
                        </div>
                      )}
                      {answer?.question.explanation && (
                        <div className="mt-3 text-xs p-3 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-muted-foreground">
                          <p className="font-medium mb-1">Explanation:</p>
                          <p>{answer.question.explanation}</p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground flex justify-end space-x-4">
                        <span>Marks: +{answer.question.marks}</span>
                        {answer?.question?.negativeMarks > 0 && <span>Negative: -{answer.question.negativeMarks}</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            {(detailedAnswers === undefined || detailedAnswers?.length === 0) && (
              <p className="text-muted-foreground text-center py-4">
                Detailed answer review is not available for this attempt.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div >
  )
}

export default ResultPageContainer