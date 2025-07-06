import AddNewsDialog from "./_components/add-news-dialog";
import NewsTable from "./_components/news-table";

export default function NewsPage() {

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">News</h1>
        <AddNewsDialog />
      </div>
      <NewsTable />
    </div>
  );
}
