import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// This would normally fetch from your Convex database based on the testId
const getTestDetails = (testId: string) => {
  const mockTests = {
    test1: {
      id: "test1",
      name: "General Knowledge Test",
      description: "Test your knowledge on various general topics",
      totalQuestions: 100, // Updated to match our mock data
      duration: 120, // Increased duration for more questions
      totalMarks: 200,
      sections: [
        { id: "section1", name: "Current Affairs", totalQuestions: 50 },
        { id: "section2", name: "History", totalQuestions: 50 },
      ],
    },
    test2: {
      id: "test2",
      name: "Mathematics Aptitude",
      description: "Test your mathematical skills and problem-solving abilities",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
      sections: [
        { id: "section3", name: "Algebra", totalQuestions: 35 },
        { id: "section4", name: "Geometry", totalQuestions: 35 },
        { id: "section5", name: "Arithmetic", totalQuestions: 30 },
      ],
    },
    test3: {
      id: "test3",
      name: "Logical Reasoning",
      description: "Assess your logical reasoning and analytical thinking",
      totalQuestions: 100,
      duration: 120,
      totalMarks: 200,
      sections: [
        { id: "section6", name: "Verbal Reasoning", totalQuestions: 50 },
        { id: "section7", name: "Non-verbal Reasoning", totalQuestions: 50 },
      ],
    },
  }

  return mockTests[testId as keyof typeof mockTests]
}

export default function TestDetailsPage({ params }: { params: { testId: string } }) {
  const test = getTestDetails(params.testId)

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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{test.name}</h1>
        <Link href="/tests">
          <Button variant="outline">Back to Tests</Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Duration</h3>
              <p className="text-2xl font-bold">{test.duration} minutes</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Questions</h3>
              <p className="text-2xl font-bold">{test.totalQuestions}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Total Marks</h3>
              <p className="text-2xl font-bold">{test.totalMarks}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/tests/${params.testId}/instructions`} className="w-full">
            <Button className="w-full">Start Test</Button>
          </Link>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Test Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {test.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Questions: {section.totalQuestions}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
