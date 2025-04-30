// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import Link from "next/link"
// import { CheckCircle, XCircle } from "lucide-react"

// // Mock data - in a real app, this would come from your Convex database

// const getTestDetails = (testId: string) => {
//   const mockTests = {
//     test1: {
//       id: "test1",
//       name: "General Knowledge Test",
//       totalQuestions: 5,
//       duration: 10,
//       totalMarks: 10,
//     },
//     test2: {
//       id: "test2",
//       name: "Mathematics Aptitude",
//       totalQuestions: 5,
//       duration: 10,
//       totalMarks: 10,
//     },
//     test3: {
//       id: "test3",
//       name: "Logical Reasoning",
//       totalQuestions: 5,
//       duration: 10,
//       totalMarks: 10,
//     },
//   }

//   return mockTests[testId as keyof typeof mockTests]
// }

// export default function TestResultPage({ params }: { params: { testId: string } }) {
//   const [answers, setAnswers] = useState<Record<string, number | null>>({})
//   const [score, setScore] = useState({
//     correct: 0,
//     incorrect: 0,
//     unattempted: 0,
//     totalScore: 0,
//   })
//   const [currentPage, setCurrentPage] = useState(1) // Initialize currentPage here

//   const questions = getMockQuestions(params.testId)
//   const test = getTestDetails(params.testId)

//   useEffect(() => {
//     // Load answers from localStorage
//     const savedAnswers = localStorage.getItem(`test_${params.testId}_answers`)

//     if (savedAnswers) {
//       const parsedAnswers = JSON.parse(savedAnswers)
//       setAnswers(parsedAnswers)

//       // Calculate score
//       let correct = 0
//       let incorrect = 0
//       let unattempted = 0

//       questions.forEach((question) => {
//         if (parsedAnswers[question.id] === undefined || parsedAnswers[question.id] === null) {
//           unattempted++
//         } else if (parsedAnswers[question.id] === question.correctAnswer) {
//           correct++
//         } else {
//           incorrect++
//         }
//       })

//       const totalScore = correct * 2 // Assuming 2 marks per correct answer

//       setScore({
//         correct,
//         incorrect,
//         unattempted,
//         totalScore,
//       })

//       // Clear test data from localStorage
//       localStorage.removeItem(`test_${params.testId}_answers`)
//       localStorage.removeItem(`test_${params.testId}_marked`)

//       // In a real app, you would save the test result to your database here
//     }
//   }, [params.testId, questions])

//   if (!test) {
//     return (
//       <div className="container mx-auto py-10">
//         <h1 className="text-3xl font-bold mb-6">Test not found</h1>
//         <Link href="/tests">
//           <Button>Back to Tests</Button>
//         </Link>
//       </div>
//     )
//   }

//   const scorePercentage = (score.totalScore / (test.totalMarks || 1)) * 100

//   const renderQuestionAnalysis = () => {
//     // For large question sets, we'll paginate the results
//     const questionsPerPage = 10
//     const totalPages = Math.ceil(questions.length / questionsPerPage)

//     const startIndex = (currentPage - 1) * questionsPerPage
//     const endIndex = Math.min(startIndex + questionsPerPage, questions.length)
//     const currentQuestions = questions.slice(startIndex, endIndex)

//     return (
//       <>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Question Analysis</h2>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <span className="text-sm">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {currentQuestions.map((question, index) => {
//             const actualIndex = startIndex + index
//             const userAnswer = answers[question.id]
//             const isCorrect = userAnswer === question.correctAnswer
//             const isAttempted = userAnswer !== undefined && userAnswer !== null

//             return (
//               <Card
//                 key={question.id}
//                 className={`border-l-4 ${isAttempted ? (isCorrect ? "border-l-green-500" : "border-l-red-500") : "border-l-gray-300"}`}
//               >
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-base">
//                       Question {actualIndex + 1}: {question.question}
//                     </CardTitle>
//                     {isAttempted &&
//                       (isCorrect ? (
//                         <CheckCircle className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <XCircle className="h-5 w-5 text-red-500" />
//                       ))}
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                     {question.options.map((option, optIndex) => (
//                       <div
//                         key={optIndex}
//                         className={`p-2 rounded-md ${optIndex === question.correctAnswer
//                             ? "bg-green-100 border border-green-300"
//                             : optIndex === userAnswer
//                               ? "bg-red-100 border border-red-300"
//                               : "bg-gray-50 border border-gray-200"
//                           }`}
//                       >
//                         {option}
//                         {optIndex === question.correctAnswer && (
//                           <span className="ml-2 text-green-600 text-sm">(Correct)</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   {!isAttempted && <p className="text-sm text-muted-foreground">You did not attempt this question.</p>}
//                 </CardContent>
//               </Card>
//             )
//           })}
//         </div>
//       </>
//     )
//   }

//   return (
//     <div className="container mx-auto py-10 max-w-4xl">
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle className="text-2xl">Test Result: {test.name}</CardTitle>
//           <CardDescription>Your performance summary</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="text-center">
//             <div className="text-5xl font-bold mb-2">{Math.round(scorePercentage)}%</div>
//             <p className="text-muted-foreground">
//               Your Score: {score.totalScore} / {test.totalMarks}
//             </p>
//           </div>

//           <Progress value={scorePercentage} className="h-3" />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Correct</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-green-600">{score.correct}</div>
//                 <p className="text-muted-foreground text-sm">Questions</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Incorrect</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-red-600">{score.incorrect}</div>
//                 <p className="text-muted-foreground text-sm">Questions</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg">Unattempted</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-gray-600">{score.unattempted}</div>
//                 <p className="text-muted-foreground text-sm">Questions</p>
//               </CardContent>
//             </Card>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Link href="/tests" className="w-full">
//             <Button className="w-full">Back to Tests</Button>
//           </Link>
//         </CardFooter>
//       </Card>

//       <h2 className="text-2xl font-bold mb-4">Question Analysis</h2>
//       {renderQuestionAnalysis()}
//     </div>
//   )
// }

import React from 'react'

const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page