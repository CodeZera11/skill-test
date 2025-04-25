

// This would normally fetch from your Convex database based on the testId
// const getTestDetails = (testId: string) => {
//   const mockTests = {
//     test1: {
//       id: "test1",
//       name: "General Knowledge Test",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//       sections: [
//         { id: "section1", name: "Current Affairs", totalQuestions: 50, firstQuestionNumber: 1 },
//         { id: "section2", name: "History", totalQuestions: 50, firstQuestionNumber: 51 },
//       ],
//     },
//     test2: {
//       id: "test2",
//       name: "Mathematics Aptitude",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//       sections: [
//         { id: "section3", name: "Algebra", totalQuestions: 35, firstQuestionNumber: 1 },
//         { id: "section4", name: "Geometry", totalQuestions: 35, firstQuestionNumber: 36 },
//         { id: "section5", name: "Arithmetic", totalQuestions: 30, firstQuestionNumber: 71 },
//       ],
//     },
//     test3: {
//       id: "test3",
//       name: "Logical Reasoning",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//       sections: [
//         { id: "section6", name: "Verbal Reasoning", totalQuestions: 50, firstQuestionNumber: 1 },
//         { id: "section7", name: "Non-verbal Reasoning", totalQuestions: 50, firstQuestionNumber: 51 },
//       ],
//     },
//   }

import { Id } from "../../../../../convex/_generated/dataModel";
import TestInstructionsContainer from "../instructions/test-instructions-container";

//   return mockTests[testId as keyof typeof mockTests]
// }

export default async function TestAttemptPage(props: Promise<{ params: { testId: string } }>) {
  const testId = (await props).params.testId;

  return <TestInstructionsContainer testId={testId as Id<"tests">} />

}
