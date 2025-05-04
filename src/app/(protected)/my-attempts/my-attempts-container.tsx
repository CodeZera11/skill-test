"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, BarChart3Icon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { formatSeconds } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Mock data for test attempts
// const testAttempts = [
//   {
//     id: "attempt-1",
//     testId: "test-1",
//     testName: "Basic Mathematics",
//     category: "Mathematics",
//     date: "2023-05-10T14:30:00",
//     score: 85,
//     totalQuestions: 30,
//     correctAnswers: 26,
//     timeTaken: "45 minutes",
//   },
//   {
//     id: "attempt-2",
//     testId: "test-2",
//     testName: "English Grammar",
//     category: "English",
//     date: "2023-05-15T10:15:00",
//     score: 92,
//     totalQuestions: 40,
//     correctAnswers: 37,
//     timeTaken: "55 minutes",
//   },
//   {
//     id: "attempt-3",
//     testId: "test-3",
//     testName: "Science Fundamentals",
//     category: "Science",
//     date: "2023-05-20T16:45:00",
//     score: 78,
//     totalQuestions: 35,
//     correctAnswers: 27,
//     timeTaken: "50 minutes",
//   },
//   {
//     id: "attempt-4",
//     testId: "test-4",
//     testName: "History Concepts",
//     category: "History",
//     date: "2023-05-25T09:30:00",
//     score: 88,
//     totalQuestions: 25,
//     correctAnswers: 22,
//     timeTaken: "40 minutes",
//   },
// ]

const MyAttemptsContainer = ({ clerkUserId }: { clerkUserId: string }) => {

  const testAttempts = useQuery(api.testAttempts.getTestAttemptsByUser, { clerkUserId })

  if (testAttempts === undefined) {
    return (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
                <div className="flex items-center text-sm">
                  <BarChart3Icon className="mr-2 h-4 w-4 opacity-70" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div >
    )
  }

  if (testAttempts === null || testAttempts?.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-muted-foreground">No test attempts found.</p>
      </div>
    )
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {testAttempts.map((attempt) => {
        const score = attempt?.score || 0;
        const timeTaken = attempt?.timeTakenInSeconds;
        const formattedTimeTaken = formatSeconds(timeTaken);
        const totalMarks = attempt.test?.totalMarks || 1;

        return (
          <Card key={attempt._id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{attempt?.test?.name}</CardTitle>
                <Badge
                  className={
                    score >= totalMarks * 0.9
                      ? "bg-green-500"
                      : score >= totalMarks * 0.7
                        ? "bg-blue-500"
                        : score >= totalMarks * 0.5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }
                >
                  {score / totalMarks * 100}%
                </Badge>
              </div>
              {/* <CardDescription>{attempt.category}</CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>
                    {new Date(attempt.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>{formattedTimeTaken}</span>
                </div>
                <div className="flex items-center text-sm">
                  <BarChart3Icon className="mr-2 h-4 w-4 opacity-70" />
                  <span>
                    {attempt.correctAnswers} / {attempt.test.totalQuestions} correct
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/tests/${attempt.testId}/attempt/${attempt._id}/result`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Detailed
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

export default MyAttemptsContainer;