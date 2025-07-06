"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ClockIcon, BarChart3Icon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { formatSeconds } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

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
      <div className="container mx-auto p-10 w-full flex items-center justify-center border rounded-md h-40 ">
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
                  {/* let just show till 2 decimal places */}
                  {((score / totalMarks) * 100).toFixed(2)}%
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