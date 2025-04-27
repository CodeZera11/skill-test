

// // Mock data - in a real app, this would come from your Convex database
// const getMockQuestions = (testId: string) => {
//   // Generate a larger set of questions for demonstration
//   const baseQuestions = [
//     {
//       id: "q1",
//       question: "What is the capital of France?",
//       options: ["London", "Paris", "Berlin", "Madrid"],
//       correctAnswer: 1,
//       sectionId: "section1",
//     },
//     {
//       id: "q2",
//       question: "Which planet is known as the Red Planet?",
//       options: ["Venus", "Jupiter", "Mars", "Saturn"],
//       correctAnswer: 2,
//       sectionId: "section1",
//     },
//     {
//       id: "q3",
//       question: "Who painted the Mona Lisa?",
//       options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
//       correctAnswer: 2,
//       sectionId: "section2",
//     },
//     {
//       id: "q4",
//       question: "What is the largest ocean on Earth?",
//       options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
//       correctAnswer: 3,
//       sectionId: "section2",
//     },
//     {
//       id: "q5",
//       question: "Which element has the chemical symbol 'O'?",
//       options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
//       correctAnswer: 1,
//       sectionId: "section1",
//     },
//   ]

import { Id } from "../../../../../../convex/_generated/dataModel";
import TestPageContainer from "./test-page-container";

//   // For demo purposes, duplicate the base questions to simulate a larger set
//   // In a real app, you would fetch the actual questions from your database
//   const questions = []
//   const totalQuestions = 100 // Simulate 100 questions

//   for (let i = 0; i < totalQuestions; i++) {
//     const baseQuestion = baseQuestions[i % baseQuestions.length]
//     questions.push({
//       ...baseQuestion,
//       id: `q${i + 1}`,
//       question: `${baseQuestion.question} (Question ${i + 1})`,
//     })
//   }

//   return questions
// }

// const getTestDetails = (testId: string) => {
//   const mockTests = {
//     test1: {
//       id: "test1",
//       name: "General Knowledge Test",
//       totalQuestions: 5, // Matching our mock questions
//       duration: 10, // 10 minutes for demo
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

export default async function TestAttemptPage(props: Promise<
  {
    params: { testId: string; questionNumber: string }
  }>) {

  const parsed = await props;
  const questionNumber = Number(parsed.params.questionNumber);
  const testId = parsed.params.testId as Id<"tests">;

  return <TestPageContainer questionNumber={questionNumber} testId={testId} />
}
