"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  BarChartIcon,
  PieChartIcon,
  Share2,
  Download,
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "@/components/charts/pie-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { RadarChart } from "@/components/charts/radar-chart"
import { ProgressRing } from "@/components/ui/progress-ring"
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel"

const ResultPageContainer = ({ testAttemptId }: { testAttemptId: Id<"testAttempts"> }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch test attempt details from Convex
  const testAttempt = useQuery(api.testAttempts.getTestAttempt, { id: testAttemptId });

  // Ensure testAttempt is defined before fetching related data
  const testId = testAttempt?.testId;
  const test = useQuery(api.tests.getById, { id: testId || "" });
  const sections = useQuery(api.sections.getSectionsByTestId, { testId: testId || "" });
  const averagePerformance = useQuery(api.tests.getAveragePerformance, { id: testId || "" });
  const timeDistribution = useQuery(api.testAttempts.getTimeDistribution, { id: testAttemptId });
  const strengthsWeaknesses = useQuery(api.testAttempts.getStrengthsWeaknesses, { id: testAttemptId });

  // Calculate performance metrics
  const sectionPerformance = (sections || []).map((section) => {
    const correctAnswers = (testAttempt?.answers || []).filter(
      (answer) => answer.sectionId === section._id && answer.isCorrect
    ).length;
    const totalQuestions = section.totalQuestions || 1; // Ensure no division by zero
    const score = (correctAnswers / totalQuestions) * 100;
    return {
      sectionName: section.name,
      score,
      average: averagePerformance?.sectionPerformance.find((s) => s.sectionId === section._id)?.averageScore || 0,
    };
  });

  useEffect(() => {
    if (testAttempt && test && sections) {
      setIsLoading(false);
    }
  }, [testAttempt, test, sections]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to format duration in seconds to minutes and seconds
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Function to format duration in minutes
  const formatMinutes = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

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
          <p className="text-muted-foreground mb-6">We couldn't find the test result you're looking for.</p>
          <Button asChild>
            <Link href="/tests">View All Tests</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const answersData = [
    {
      name: "Correct",
      value: testAttempt.correctAnswers,
      color: "#10b981", // emerald-500
    },
    {
      name: "Incorrect",
      value: testAttempt.incorrectAnswers,
      color: "#ef4444", // red-500
    },
  ]

  const sectionScoreData = sectionPerformance.map((section) => {
    return {
      name: section.sectionName,
      score: section.score,
      average: section.average,
    }
  })

  const timeDistributionData = timeDistribution.map((item) => {
    const sectionInfo = sections.find((s) => s._id === item.sectionId)
    return {
      name: sectionInfo?.name || "Unknown",
      actual: Math.round(item.timeSpent / 60), // Convert to minutes
      expected: Math.round(item.expectedTime / 60), // Convert to minutes
    }
  })

  const radarData = sectionPerformance.map((section) => {
    return {
      subject: section.sectionName,
      score: section.score,
      average: section.average,
    }
  })

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
              variant={testAttempt.score >= 70 ? "default" : testAttempt.score >= 50 ? "outline" : "destructive"}
              className="text-sm"
            >
              {testAttempt.score >= 70 ? "Excellent" : testAttempt.score >= 50 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {test.name} • Completed on {formatDate(testAttempt.endTime)} at {formatTime(testAttempt.endTime)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* Score Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-emerald-500" />
                Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={testAttempt.score}
                label="Your Score"
                color={
                  testAttempt.score >= 80
                    ? "#10b981" // emerald-500
                    : testAttempt.score >= 60
                      ? "#3b82f6" // blue-500
                      : testAttempt.score >= 40
                        ? "#f59e0b" // amber-500
                        : "#ef4444" // red-500
                }
              />
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Average: {averagePerformance?.averageScore || 0}%</span>
                <span>Top: {averagePerformance?.topScore || 0}%</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={(testAttempt.correctAnswers / test.totalQuestions) * 100}
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

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Time Taken
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <ProgressRing
                value={(testAttempt.timeTaken / (test.duration * 60)) * 100}
                label={formatDuration(testAttempt.timeTaken)}
                color="#f59e0b" // amber-500
              />
            </CardContent>
            <CardFooter className="pt-0 text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Your Time: {formatMinutes(Math.floor(testAttempt.timeTaken / 60))}</span>
                <span>Allowed: {formatMinutes(test.duration)}</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
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

        {/* Overview Tab */}
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
                  value={testAttempt.performancePercentile}
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

        {/* Sections Tab */}
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

        {/* Time Analysis Tab */}
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

        {/* Improvement Tab */}
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
      </Tabs>

      {/* Action Buttons */}
      <motion.div
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
      </motion.div>
    </div>
  )
}

export default ResultPageContainer