"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Id } from "~/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toast } from "sonner"
import { formatSeconds } from "@/lib/utils"

const TestInstructionsContainer = ({ testId }: { testId: Id<"tests"> }) => {
  const router = useRouter()
  const test = useQuery(api.tests.getById, { id: testId })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const attemptTest = useMutation(api.testAttempts.startTestAttempt)

  const { user, isLoading, isAuthenticated } = useCurrentUser();

  const startTest = () => {

    if (isLoading || !isAuthenticated || !user) return;

    if (agreedToTerms) {
      toast.promise(attemptTest({ testId, userId: user._id }), {
        loading: "Starting test...",
        success: (testAttemptId) => {
          router.push(`/tests/${testId}/attempt/${testAttemptId}/q/1`)
          return "Test started successfully"
        },
        error: (err) => `Error starting test: ${err}`,
      })

    }
  }


  if (test === undefined) {
    return <div className="h-[calc(100vh-75px)] flex items-center justify-center ">
      Loading...
    </div>
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
              <li>Duration: {formatSeconds(test.durationInSeconds)} minutes</li>
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
          <Link href={`/tests/${testId}`}>
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

export default TestInstructionsContainer