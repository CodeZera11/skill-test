

// This would normally fetch from your Convex database based on the testId
// const getTestDetails = (testId: string) => {
//   const mockTests = {
//     test1: {
//       id: "test1",
//       name: "General Knowledge Test",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//     },
//     test2: {
//       id: "test2",
//       name: "Mathematics Aptitude",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//     },
//     test3: {
//       id: "test3",
//       name: "Logical Reasoning",
//       totalQuestions: 100,
//       duration: 120,
//       totalMarks: 200,
//     },
//   }

import { Id } from "../../../../../convex/_generated/dataModel";
import TestInstructionsContainer from "./test-instructions-container";

//   return mockTests[testId as keyof typeof mockTests]
// }

export default async function TestInstructionsPage(props: Promise<{ params: { testId: string } }>) {
  const testId = (await props).params.testId;
  return <TestInstructionsContainer testId={testId as Id<"tests">} />
}
