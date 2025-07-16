import { Id } from "~/convex/_generated/dataModel";
import TestSectionsContainer from "./test-sections-container";

const TestSectionsPage = async ({ params }: { params: Promise<{ testId: string, testAttemptId: string }> }) => {

  const parsed = await params;

  return (
    <TestSectionsContainer testId={parsed.testId as Id<"tests">} testAttemptId={parsed.testAttemptId as Id<"testAttempts">} />
  )
}

export default TestSectionsPage