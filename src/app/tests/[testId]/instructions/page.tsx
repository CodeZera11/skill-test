"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"

// This would normally fetch from your Convex database based on the testId
const getTestDetails = (testId: string) => {
  const mockTests = {
    test1: {
      id: "test1",
      name: "General Knowledge Test",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
    },
    test2: {
      id: "test2",
      name: "Mathematics Aptitude",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
    },
    test3: {
      id: "test3",
      name: "Logical Reasoning",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
    },
  }

  return mockTests[testId as keyof typeof mockTests]
}

export default function TestInstructionsPage({ params }: { params: { testId: string } }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const test = getTestDetails(params.testId)

  const startTest = () => {
    if (agreedToTerms) {
      // In a real app, you would create a test attempt in your database here
      router.push(`/tests/${params.testId}/attempt/1`)
    }
  }

  if (!test) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Test not found</h1>
        <Link href="/tests">
          <Button>Back to Tests</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Test Instructions: {test.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Test Overview</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Total Questions: {test.totalQuestions}</li>
              <li>Duration: {test.duration} minutes</li>
              <li>Total Marks: {test.totalMarks}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Important Instructions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each question has only one correct answer.</li>
              <li>You can navigate between questions using the next and previous buttons.</li>
              <li>You can mark questions for review and return to them later.</li>
              <li>The timer will start as soon as you begin the test.</li>
              <li>Your test will be automatically submitted when the time expires.</li>
              <li>Do not refresh the page during the test as it may result in loss of answers.</li>
            </ul>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and understood all the instructions and agree to start the test.
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/tests/${params.testId}`}>
            <Button variant="outline">Back</Button>
          </Link>
          <Button onClick={startTest} disabled={!agreedToTerms}>
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
