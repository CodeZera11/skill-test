import TestContainer from "./test-container"
import { Id } from "../../../../convex/_generated/dataModel"

// // This would normally fetch from your Convex database based on the testId
// const getTestDetails = (testId: string) => {
//   const mockTests = {
//     test1: {
//       id: "test1",
//       name: "General Knowledge Test",
//       description: "Test your knowledge on various general topics",
//       totalQuestions: 100, // Updated to match our mock data
//       duration: 120, // Increased duration for more questions
//       totalMarks: 200,
//       sections: [
//         { id: "section1", name: "Current Affairs", totalQuestions: 50 },
//         { id: "section2", name: "History", totalQuestions: 50 },
//       ],
//     },
//     test2: {
//       id: "test2",
//       name: "Mathematics Aptitude",
//       description: "Test your mathematical skills and problem-solving abilities",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//       sections: [
//         { id: "section3", name: "Algebra", totalQuestions: 35 },
//         { id: "section4", name: "Geometry", totalQuestions: 35 },
//         { id: "section5", name: "Arithmetic", totalQuestions: 30 },
//       ],
//     },
//     test3: {
//       id: "test3",
//       name: "Logical Reasoning",
//       description: "Assess your logical reasoning and analytical thinking",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//       sections: [
//         { id: "section6", name: "Verbal Reasoning", totalQuestions: 50 },
//         { id: "section7", name: "Non-verbal Reasoning", totalQuestions: 50 },
//       ],
//     },
//   }

//   return mockTests[testId as keyof typeof mockTests]
// }

export default async function TestDetailsPage(props: Promise<{ params: { testId: string } }>) {
  const testId = (await props).params.testId;
  return <TestContainer testId={testId as Id<"tests">} />
}
