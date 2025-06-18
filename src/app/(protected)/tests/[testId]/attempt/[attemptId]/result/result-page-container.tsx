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
  const data = useQuery(api.testAttempts.getTestAttempt, { id: testAttemptId });

  // const testId = data?.test?._id;
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

  console.log("Detailed Answers:", detailedAnswers);



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
                return (
                  <div key={answer.questionId || index} className="border p-4 rounded-lg bg-background shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-md">
                        Question {index + 1}: {answer?.question?.question}
                      </h4>
                      {answer.isCorrect ? (
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0">
                          <CheckCircle className="h-4 w-4 mr-1.5" /> Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0">
                          <XCircle className="h-4 w-4 mr-1.5" /> Incorrect
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

      {/* <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={answersData} innerRadius={60} outerRadius={80} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Time Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComp
              chartData={answersData}
              xAxisDataKey="name"
              yAxisDataKey="value"
            // className="h-80"
            />
          </CardContent>
        </Card>
      </motion.div> */}

      {/* < Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab} >
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex mb-8">
          <TabsTrigger value="overview" className="gap-2">
            <BarChartIcon className="h-4 w-4 hidden md:inline" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sections" className="gap-2">
            <PieChartIcon className="h-4 w-4 hidden md:inline" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="time" className="gap-2">
            <Clock className="h-4 w-4 hidden md:inline" />
            Time Analysis
          </TabsTrigger>
          <TabsTrigger value="improvement" className="gap-2">
            <TrendingUp className="h-4 w-4 hidden md:inline" />
            Improvement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart data={answersData} title="Correct vs Incorrect Answers" innerRadius={60} outerRadius={80} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Percentile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <ProgressRing
                  value={performancePercentile}
                  size={150}
                  strokeWidth={10}
                  label="Percentile Rank"
                  color="#8b5cf6" // violet-500
                />
                <p className="text-center mt-4 text-muted-foreground">
                  You performed better than {testAttempt.performancePercentile}% of test takers
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Across Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <RadarChart
                  data={radarData}
                  radars={[
                    { dataKey: "score", color: "#10b981", name: "Your Score" }, // emerald-500
                    { dataKey: "average", color: "#6b7280", name: "Average Score" }, // gray-500
                  ]}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mt-0.5">
                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Strengths</h4>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {strengthsWeaknesses.strengths.map((strength, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mt-0.5">
                        <Brain className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Areas for Improvement</h4>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          {strengthsWeaknesses.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mt-0.5">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Recommended Next Steps</h4>
                        <ul className="mt-2 space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                            Practice more {strengthsWeaknesses.weaknesses[0]} questions
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                            Review incorrect answers in detail
                          </li>
                          <li className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                            Take a focused test on {strengthsWeaknesses.weaknesses[1]}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mt-0.5">
                        <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Performance Trend</h4>
                        <p className="mt-2 text-muted-foreground">
                          Your performance is {testAttempt.score > averagePerformance?.averageScore ? "above" : "below"}{" "}
                          the average by{" "}
                          {Math.abs(testAttempt.score - (averagePerformance?.averageScore || 0)).toFixed(1)}%.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="sections" className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Section-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={sectionScoreData}
                  bars={[
                    { dataKey: "score", color: "#10b981", name: "Your Score" }, // emerald-500
                    { dataKey: "average", color: "#6b7280", name: "Average Score" }, // gray-500
                  ]}
                  xAxisLabel="Sections"
                  yAxisLabel="Score (%)"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Section Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sectionPerformance.map((section, index) => {
                    const sectionInfo = sections.find((s) => s._id === section.sectionId)
                    return (
                      <div key={section.sectionId} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-medium">{sectionInfo?.name || "Unknown Section"}</h3>
                            <p className="text-muted-foreground text-sm">{sectionInfo?.description}</p>
                          </div>
                          <Badge
                            variant={section.score >= 80 ? "default" : section.score >= 60 ? "outline" : "destructive"}
                          >
                            {section.score}% Score
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Correct Answers</div>
                            <div className="text-xl font-medium flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                              {section.correctAnswers} / {sectionInfo?.totalQuestions}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Incorrect Answers</div>
                            <div className="text-xl font-medium flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-500" />
                              {section.incorrectAnswers} / {sectionInfo?.totalQuestions}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">Time Taken</div>
                            <div className="text-xl font-medium flex items-center gap-2">
                              <Clock className="h-5 w-5 text-amber-500" />
                              {formatDuration(section.timeTaken)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="time" className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={timeDistributionData}
                  bars={[
                    { dataKey: "actual", color: "#3b82f6", name: "Time Spent (minutes)" }, // blue-500
                    { dataKey: "expected", color: "#6b7280", name: "Expected Time (minutes)" }, // gray-500
                  ]}
                  xAxisLabel="Sections"
                  yAxisLabel="Time (minutes)"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time Management Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mt-0.5">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Overall Time Usage</h4>
                      <p className="mt-2 text-muted-foreground">
                        You completed the test in {((testAttempt.timeTaken / (test.duration * 60)) * 100).toFixed(0)}%
                        of the allotted time.{" "}
                        {testAttempt.timeTaken < test.duration * 60
                          ? "Great job managing your time efficiently!"
                          : "You used all the available time, which is good for maximizing your score."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mt-0.5">
                      <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Section Time Analysis</h4>
                      <div className="mt-2 space-y-2">
                        {timeDistribution.map((item) => {
                          const sectionInfo = sections.find((s) => s._id === item.sectionId)
                          const difference = item.timeSpent - item.expectedTime
                          const isOverTime = difference > 0
                          return (
                            <div key={item.sectionId} className="flex justify-between items-center">
                              <span className="text-muted-foreground">{sectionInfo?.name || "Unknown"}</span>
                              <span
                                className={
                                  isOverTime
                                    ? "text-red-500 dark:text-red-400"
                                    : "text-emerald-500 dark:text-emerald-400"
                                }
                              >
                                {isOverTime ? "+" : ""}
                                {formatDuration(difference)} {isOverTime ? "over" : "under"}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mt-0.5">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">Time Management Recommendations</h4>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        {timeDistribution
                          .filter((item) => item.timeSpent > item.expectedTime)
                          .map((item) => {
                            const sectionInfo = sections.find((s) => s._id === item.sectionId)
                            return (
                              <li key={item.sectionId} className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4 text-emerald-500" />
                                Practice {sectionInfo?.name || "Unknown"} questions with timed drills
                              </li>
                            )
                          })}
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-emerald-500" />
                          Set a timer for each section in your next practice test
                        </li>
                        <li className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-emerald-500" />
                          Skip difficult questions and return to them later
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="improvement" className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strengths & Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Top Performing Topics</h3>
                    <div className="space-y-4">
                      {strengthsWeaknesses.topicStrengths.map((topic, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-emerald-500">{topic.score}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div
                              className="bg-emerald-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.score}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Areas for Improvement</h3>
                    <div className="space-y-4">
                      {strengthsWeaknesses.topicWeaknesses.map((topic, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{topic.topic}</span>
                            <span className="text-red-500">{topic.score}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div
                              className="bg-red-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.score}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {strengthsWeaknesses.weaknesses.map((weakness, index) => (
                    <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                      <h3 className="text-lg font-medium mb-4">{weakness}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-50 dark:bg-slate-800">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="h-5 w-5 text-blue-500" />
                              <h4 className="font-medium">Practice Test</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              A focused test on {weakness} topics to improve your skills
                            </p>
                            <Button size="sm" className="w-full" asChild>
                              <Link href="#">
                                Start Practice
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-slate-50 dark:bg-slate-800">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Brain className="h-5 w-5 text-purple-500" />
                              <h4 className="font-medium">Learning Resources</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              Study materials and tutorials focused on {weakness}
                            </p>
                            <Button size="sm" variant="outline" className="w-full" asChild>
                              <Link href="#">
                                View Resources
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs > */}

      {/* <motion.div
        className="flex flex-wrap gap-4 justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button size="lg" asChild>
          <Link href={`/tests/${test._id}`}>Retake Test</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/tests">Browse More Tests</Link>
        </Button>
      </motion.div> */}
    </div >
  )
}

export default ResultPageContainer