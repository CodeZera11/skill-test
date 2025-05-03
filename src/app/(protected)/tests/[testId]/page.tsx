import TestContainer from "./test-container"
import { Id } from "~/convex/_generated/dataModel"

export default async function TestDetailsPage({ params }: { params: Promise<{ testId: string }> }) {
  const testId = (await params).testId;

  return <TestContainer testId={testId as Id<"tests">} />
}
