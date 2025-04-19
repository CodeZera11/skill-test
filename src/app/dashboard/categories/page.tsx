import CategoriesTable from "./_components/categories-table";
import AddCategoryDialog from "./_components/add-category-dialog";

export default function CategoriesPage() {

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <AddCategoryDialog />
        {/* <Link href="/dashboard/categories/add">
          <Button className="w-full">Add New Category</Button>
        </Link> */}
      </div>
      <CategoriesTable />
    </div>
  );
}
