"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// This would normally fetch from your Convex database based on the testId
const getTestDetails = (testId: string) => {
  const mockTests = {
    test1: {
      id: "test1",
      name: "General Knowledge Test",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
      sections: [
        { id: "section1", name: "Current Affairs", totalQuestions: 50, firstQuestionNumber: 1 },
        { id: "section2", name: "History", totalQuestions: 50, firstQuestionNumber: 51 },
      ],
    },
    test2: {
      id: "test2",
      name: "Mathematics Aptitude",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
      sections: [
        { id: "section3", name: "Algebra", totalQuestions: 35, firstQuestionNumber: 1 },
        { id: "section4", name: "Geometry", totalQuestions: 35, firstQuestionNumber: 36 },
        { id: "section5", name: "Arithmetic", totalQuestions: 30, firstQuestionNumber: 71 },
      ],
    },
    test3: {
      id: "test3",
      name: "Logical Reasoning",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
      sections: [
        { id: "section6", name: "Verbal Reasoning", totalQuestions: 50, firstQuestionNumber: 1 },
        { id: "section7", name: "Non-verbal Reasoning", totalQuestions: 50, firstQuestionNumber: 51 },
      ],
    },
  }

  return mockTests[testId as keyof typeof mockTests]
}

export default function TestAttemptPage({ params }: { params: { testId: string } }) {
  const router = useRouter()
  const test = getTestDetails(params.testId)
  // const [currentSection, setCurrentSection] = useState(test?.sections[0]?.id || "")

  useEffect(() => {
    // Initialize test attempt if not already started
    const testStarted = localStorage.getItem(`test_${params.testId}_started`)
    if (!testStarted) {
      localStorage.setItem(`test_${params.testId}_started`, "true")
      localStorage.setItem(`test_${params.testId}_answers`, "{}")
      localStorage.setItem(`test_${params.testId}_marked`, "{}")
      localStorage.setItem("test_start_time", Date.now().toString())
    }

    // Redirect to the first question
    router.push(`/tests/${params.testId}/attempt/1`)
  }, [params.testId, router])

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
