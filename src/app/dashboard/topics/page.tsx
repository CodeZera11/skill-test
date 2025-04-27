import AddTopicDialog from "./_components/add-topics-dialog";
import TopicsTable from "./_components/topics-table";

export default function TopicsPage() {

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Topics</h1>
        <AddTopicDialog />
      </div>
      <TopicsTable />
    </div>
  );
}
