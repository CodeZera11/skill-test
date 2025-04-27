"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

// This would normally fetch from your Convex database
// const mockTests = [
//   {
//     id: "test1",
//     name: "General Knowledge Test",
//     description: "Test your knowledge on various general topics",
//     totalQuestions: 20,
//     duration: 30,
//     totalMarks: 40,
//   },
//   {
//     id: "test2",
//     name: "Mathematics Aptitude",
//     description: "Test your mathematical skills and problem-solving abilities",
//     totalQuestions: 15,
//     duration: 45,
//     totalMarks: 30,
//   },
//   {
//     id: "test3",
//     name: "Logical Reasoning",
//     description: "Assess your logical reasoning and analytical thinking",
//     totalQuestions: 25,
//     duration: 40,
//     totalMarks: 50,
//   },
// ]

export default function TestsPage() {

  const tests = useQuery(api.tests.list);

  if (tests === undefined) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Tests</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test._id}>
            <CardHeader>
              <CardTitle>{test.name}</CardTitle>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-medium">{test.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{test.duration} mins</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Marks</p>
                  <p className="font-medium">{test.totalMarks}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/tests/${test._id}`} className="w-full">
                <Button className="w-full">View Test</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
