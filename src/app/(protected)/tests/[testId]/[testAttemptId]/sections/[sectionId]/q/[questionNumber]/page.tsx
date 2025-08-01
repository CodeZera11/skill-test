import { Id } from "~/convex/_generated/dataModel";
import TestPageContainer from "./test-page-container";

export default async function TestAttemptPage(props: {
  params: Promise<{ testId: string; questionNumber: string; testAttemptId: string; sectionId: string }>;
}) {
  const parsed = await props.params;
  const questionNumber = Number(parsed.questionNumber);
  const attemptId = parsed.testAttemptId as Id<"testAttempts">;
  const testId = parsed.testId as Id<"tests">;
  const sectionId = parsed.sectionId as Id<"sections">;

  // http://localhost:3000/tests/jn7ady3n891te43gsd2gdh5eyn7kvayp/sections/js78cwmsgwg8nrf0wdbcdmgvx17kvht8/q/1

  return (
    <TestPageContainer
      questionNumber={questionNumber}
      testId={testId}
      attemptId={attemptId}
      sectionId={sectionId} // Pass sectionId to TestPageContainer
    />
  );
}