"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Id } from "~/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { useCurrentUser } from "@/hooks/use-current-user"
import { toast } from "sonner"
import { formatSeconds } from "@/lib/utils"
import { useRouter } from "next/navigation"

const TestInstructionsContainer = ({ testId }: { testId: Id<"tests"> }) => {
  const router = useRouter();
  const test = useQuery(api.tests.getByIdWithSections, { id: testId })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const attemptTest = useMutation(api.testAttempts.startTestAttempt)

  const { user, isLoading, isAuthenticated } = useCurrentUser()

  // const startTest = () => {
  //   if (isLoading || !isAuthenticated || !user) return

  //   if (agreedToTerms) {
  //     toast.promise(attemptTest({ testId, userId: user._id }), {
  //       loading: "Starting test...",
  //       success: (testAttemptId) => {
  //         if (!test) return;

  //         localStorage.clear() // Clear local storage to remove any previous test data

  //         const firstSectionId = test.sections[0]._id // Get the first section ID

  //         // navigate to test page on a new window like a real test
  //         const win = window.open(`/tests/${testId}/${testAttemptId}?sectionId=${firstSectionId}`, "examWindow",
  //           "popup=yes,width=1200,height=800")

  //         if (!win) {
  //           alert("Popup blocked! Please allow popups to start the test.");
  //         }


  //         return "Test started successfully"
  //       },
  //       error: (err) => `Error starting test: ${err}`,
  //     })
  //   }
  // }

  const startTest = async () => {
    console.log("🚀 startTest clicked")

    console.log("Auth state:", {
      isLoading,
      isAuthenticated,
      user,
    })

    if (isLoading) {
      console.log("⛔ Blocked: isLoading is true")
      return
    }

    if (!isAuthenticated) {
      console.log("⛔ Blocked: not authenticated")
      toast.error("You are not authenticated")
      return
    }

    if (!user) {
      console.log("⛔ Blocked: user is null")
      toast.error("User not loaded")
      return
    }

    if (!agreedToTerms) {
      console.log("⛔ Blocked: terms not agreed")
      return
    }

    if (!test) {
      console.log("⛔ Blocked: test not loaded")
      return
    }

    console.log("✅ Preconditions passed")

    try {
      console.log("🧪 Starting test attempt mutation…")

      const testAttemptId = await attemptTest({
        testId,
        userId: user._id,
      })

      console.log("✅ Mutation resolved:", testAttemptId)

      console.log("🧹 Clearing localStorage")
      localStorage.clear()

      const firstSectionId = test.sections[0]?._id
      console.log("📌 First section ID:", firstSectionId)

      const url = `/tests/${testId}/${testAttemptId}?sectionId=${firstSectionId}`
      console.log("➡️ Navigating to:", url)

      toast.success("Test started successfully")

      router.push(url)

      console.log("✅ router.push called")
    } catch (err) {
      console.error("🔥 Error starting test:", err)
      toast.error("Error starting test")
    }
  }


  if (test === undefined) {
    return (
      <div className="h-[calc(100vh-75px)] flex items-center justify-center">
        Loading...
      </div>
    )
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

  const totalDurationInSeconds = test.sections.reduce(
    (total, section) => total + (section?.durationInSeconds || 0),
    0
  )

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
              <li>Duration: {formatSeconds(totalDurationInSeconds)} minutes</li>
              <li>Total Marks: {test.totalMarks}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Sections Overview</h3>
            <ul className="list-disc pl-5 space-y-1">
              {test.sections.map((section, index) => (
                <li key={index}>
                  {section.name}: {formatSeconds(section.durationInSeconds)}, {section.totalQuestions} questions
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Important Instructions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each question has only one correct answer.</li>
              <li>You can navigate between sections using the dropdown menu.</li>
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