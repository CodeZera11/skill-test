"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { formatSeconds } from "@/lib/utils"
import { toast } from "sonner"

const TestSectionsContainer = ({ testId, testAttemptId }: { testId: Id<"tests">, testAttemptId: Id<"testAttempts"> }) => {
  const router = useRouter()
  const test = useQuery(api.tests.getByIdWithSections, { id: testId })
  const updateCurrentSection = useMutation(api.testAttempts.updateCurrentSection)

  if (test === undefined) {
    return <div className="h-[calc(100vh-75px)] flex items-center justify-center">Loading...</div>
  }

  if (!test) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Test not found</h1>
        <Button onClick={() => router.push("/tests")}>Back to Tests</Button>
      </div>
    )
  }

  const sections = test.sections || []

  const startSection = async (sectionId: Id<"sections">) => {
    toast.promise(
      updateCurrentSection({
        testAttemptId: testAttemptId, // Ensure this is passed correctly
        newSectionId: sectionId,
        timeSpentInSeconds: 0, // Initialize with 0 time spent
      }),
      {
        loading: "Starting section...",
        success: () => {
          router.push(`/tests/${testId}/${testAttemptId}/sections/${sectionId}/q/1`)
          return "Section started successfully"
        },
        error: (err) => `Error starting section: ${err}`,
      }
    )
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Test Sections: {test.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="border rounded-md p-4">
              <h3 className="text-lg font-medium">{section.name}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Duration: {formatSeconds(section.durationInSeconds)} minutes</li>
                <li>Total Questions: {section.totalQuestions}</li>
              </ul>
              <Button
                className="mt-4"
                onClick={() => startSection(section._id)}
              >
                Start Section
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push(`/tests/${testId}`)}>
            Back to Instructions
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TestSectionsContainer