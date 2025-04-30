import { Id } from "../../../../../convex/_generated/dataModel"
import SubCategoryDetailsContainer from "./sub-category-details-container"

async function SubCategoryDetailPage(props: { params: Promise<{ id: string }> }) {
  const id = (await props.params).id

  return <SubCategoryDetailsContainer id={id as Id<"subCategories">} />
}

export default SubCategoryDetailPage;