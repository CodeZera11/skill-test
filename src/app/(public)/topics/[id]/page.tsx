import { Id } from "~/convex/_generated/dataModel"
import TopicDetailsPageContainer from "./topic-details-container"


interface TopicDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const topicId = (await params).id as Id<"topics">


  return (
    <TopicDetailsPageContainer id={topicId} />
  )
}
