import { Id } from "~/convex/_generated/dataModel";
import TestInstructionsContainer from "./test-instructions-container";

const TestInstructionsPage = async (props: { params: Promise<{ testId: string }> }) => {
  const testId = (await props.params).testId;

  return <TestInstructionsContainer testId={testId as Id<"tests">} />
}

export default TestInstructionsPage;