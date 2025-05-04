"use client"

import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatSeconds } from "@/lib/utils"

interface TestContainerProps {
  testId: Id<"tests">
}

const TestContainer: React.FC<TestContainerProps> = ({ testId }) => {
  const test = useQuery(api.tests.getByIdWithSections, { id: testId })

  if (test === undefined) {
    return <div>
      Loading...
    </div>
  }

  console.log("test", test)

  if (test === null) {
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
              <p className="text-2xl font-bold">{formatSeconds(test.durationInSeconds)}</p>
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
          <Link href={`/tests/${testId}/instructions`} className="w-full">
            <Button className="w-full">Start Test</Button>
          </Link>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Test Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {test.sections.map((section) => (
          <Card key={section._id}>
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

export default TestContainer