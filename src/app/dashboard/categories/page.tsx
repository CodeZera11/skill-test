"use client";

import { Button } from "@/components/ui/button";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/dashboard/categories/add">
          <Button className="w-full">Add New Category</Button>
        </Link>
      </div>
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
