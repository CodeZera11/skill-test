"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid gap-4">
        {categories?.map((category) => (
          <div key={category._id} className="p-4 border rounded">
            <h2 className="font-semibold">{category.name}</h2>
            {category.description && <p className="text-gray-600">{category.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
