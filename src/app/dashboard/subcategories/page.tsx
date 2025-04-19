import SubCategoriesTable from "./_components/subcategories-table";
import AddSubCategoryDialog from "./_components/add-subcategory-dialog";

export default function SubCategoriesPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sub Categories</h1>
        <AddSubCategoryDialog />
      </div>
      <SubCategoriesTable />
    </div>
  );
}
