import { Id } from "../../../../../convex/_generated/dataModel";
import TestInstructionsContainer from "./test-instructions-container";

export default async function TestInstructionsPage(props: Promise<{ params: { testId: string } }>) {
  const testId = (await props).params.testId;
  return <TestInstructionsContainer testId={testId as Id<"tests">} />
}
