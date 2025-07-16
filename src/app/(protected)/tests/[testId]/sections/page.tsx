import { Id } from "~/convex/_generated/dataModel";
import TestSectionsContainer from "./test-sections-container";

const TestSectionsPage = async ({ params }: { params: Promise<{ testId: string }> }) => {

  const parsed = await params;

  return (
    <TestSectionsContainer testId={parsed.testId as Id<"tests">} />
  )
}

export default TestSectionsPage