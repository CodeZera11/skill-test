import { Id } from "../../../../../convex/_generated/dataModel"
import CategoryDetailsContainer from "./category-details-container"

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <CategoryDetailsContainer id={id as Id<"categories">} />
}
