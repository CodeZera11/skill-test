import { Id } from "~/convex/_generated/dataModel";
import TestPageContainer from "./sections/[sectionId]/q/[questionNumber]/test-page-container";

export default async function TestAttemptPage(props: {
  params: Promise<{ testId: string; testAttemptId: string; }>;
  searchParams: Promise<{ sectionId: string, questionNumber: string }>;
}) {
  const parsed = await props.params;
  const searchParams = await props.searchParams;
  // const questionNumber = Number(parsed.questionNumber);
  const attemptId = parsed.testAttemptId as Id<"testAttempts">;
  const testId = parsed.testId as Id<"tests">;
  const sectionId = searchParams.sectionId as Id<"sections">;
  const questionNumber = Number(searchParams.questionNumber);

  // http://localhost:3000/tests/jn7ady3n891te43gsd2gdh5eyn7kvayp/sections/js78cwmsgwg8nrf0wdbcdmgvx17kvht8/q/1

  return (
    <TestPageContainer
      testId={testId}
      attemptId={attemptId}
      sectionId={sectionId as Id<"sections">}
      questionNumber={questionNumber}
    />
  );
}