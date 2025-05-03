import { Id } from "~/convex/_generated/dataModel";
import ResultPageContainer from "./result-page-container";

const TestResultPage = async ({ params }: { params: Promise<{ testId: string, attemptId: string }> }) => {
  const parsed = await params;

  return <ResultPageContainer testAttemptId={parsed.attemptId as Id<"testAttempts">} />
}

export default TestResultPage;