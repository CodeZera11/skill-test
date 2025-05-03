import { Id } from "~/convex/_generated/dataModel";
import TestPageContainer from "./test-page-container";

export default async function TestAttemptPage(props:
  {
    params: Promise<{ testId: string; questionNumber: string, attemptId: string }>
  }) {

  const parsed = await (props.params);
  const questionNumber = Number(parsed.questionNumber);
  const attemptId = parsed.attemptId as Id<"testAttempts">;
  const testId = parsed.testId as Id<"tests">;

  return <TestPageContainer questionNumber={questionNumber} testId={testId} attemptId={attemptId} />
}