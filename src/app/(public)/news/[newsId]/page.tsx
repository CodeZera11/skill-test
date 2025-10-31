import NewsContainer from './news-container';
import { Id } from '~/convex/_generated/dataModel';

const NewsDetailPage = async ({ params }: { params: Promise<{ newsId: string }> }) => {
  const newsId = (await params).newsId;

  return (
    <NewsContainer newsId={newsId as Id<"news">} />
  )
}

export default NewsDetailPage