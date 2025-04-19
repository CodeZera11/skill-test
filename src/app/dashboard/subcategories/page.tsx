"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function SubCategoriesPage() {
  const subcategories = useQuery(api.subCategories.list);
  const categories = useQuery(api.categories.list);

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c._id === categoryId)?.name || 'Unknown Category';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sub Categories</h1>
      <div className="grid gap-4">
        {subcategories?.map((subcategory) => (
          <div key={subcategory._id} className="p-4 border rounded">
            <div className="text-sm text-gray-500 mb-1">
              {getCategoryName(subcategory.categoryId)}
            </div>
            <h2 className="font-semibold">{subcategory.name}</h2>
            {subcategory.description && (
              <p className="text-gray-600">{subcategory.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
