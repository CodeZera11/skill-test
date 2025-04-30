import { Id } from "../../../../../../convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import TestInstructionsContainer from "./test-instructions-container";

const TestInstructionsPage = async (props: { params: Promise<{ testId: string }> }) => {
  const testId = (await props.params).testId;
  const user = await fetchQuery(api.users.current);

  console.log("getting user")
  console.log({ user })
  return <TestInstructionsContainer testId={testId as Id<"tests">} />
}

export default TestInstructionsPage;