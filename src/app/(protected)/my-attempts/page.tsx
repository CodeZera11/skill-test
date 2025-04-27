import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

// This would normally fetch from your Convex database
const mockAttempts = [
  {
    id: "attempt1",
    testId: "test1",
    testName: "General Knowledge Test",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    score: 8,
    totalMarks: 10,
    correctAnswers: 4,
    incorrectAnswers: 1,
    timeTaken: 15 * 60, // 15 minutes in seconds
  },
  {
    id: "attempt2",
    testId: "test2",
    testName: "Mathematics Aptitude",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    score: 6,
    totalMarks: 10,
    correctAnswers: 3,
    incorrectAnswers: 2,
    timeTaken: 20 * 60, // 20 minutes in seconds
  },
]

export default function MyAttemptsPage() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Test Attempts</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {mockAttempts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">{`You haven't attempted any tests yet.`}</p>
            <Link href="/tests" className="mt-4 inline-block">
              <Button>Browse Tests</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {mockAttempts.map((attempt) => (
            <Card key={attempt.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{attempt.testName}</CardTitle>
                    <CardDescription>Attempted on {formatDate(attempt.startTime)}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {attempt.score}/{attempt.totalMarks}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={(attempt.score / attempt.totalMarks) * 100} className="h-2 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Correct Answers</p>
                    <p className="font-medium">{attempt.correctAnswers} questions</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Incorrect Answers</p>
                    <p className="font-medium">{attempt.incorrectAnswers} questions</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-muted-foreground">Time Taken</p>
                    <p className="font-medium">{formatTime(attempt.timeTaken)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/tests/${attempt.testId}/result`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Detailed Results
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
