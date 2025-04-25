"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

const TestAttemptContainer = ({ testId }: { testId: Id<"tests"> }) => {
  const router = useRouter()
  const test = useQuery(api.tests.getById, { id: testId })


  if (test === undefined) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading Test...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please wait while we prepare your test.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Test not found</h1>
        <Button onClick={() => router.push("/tests")}>Back to Tests</Button>
      </div>
    )
  }

  // const handleSectionChange = (sectionId: string) => {
  //   setCurrentSection(sectionId)

  //   // Find the first question number of the selected section
  //   const section = test.sections.find((s) => s.id === sectionId)
  //   if (section) {
  //     router.push(`/tests/${params.testId}/attempt/${section.firstQuestionNumber}`)
  //   }
  // }

  // const handleQuestionNavigate = (questionNumber: number) => {
  //   router.push(`/tests/${params.testId}/attempt/${questionNumber}`)
  // }

  // const handleTimeUp = () => {
  //   router.push(`/tests/${params.testId}/result`)
  // }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Loading Test...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please wait while we prepare your test.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestAttemptContainer