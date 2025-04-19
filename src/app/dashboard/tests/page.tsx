"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function TestsPage() {
  const tests = useQuery(api.tests.list);
  const subcategories = useQuery(api.subCategories.list);

  const getSubCategoryName = (subCategoryId: string) => {
    return subcategories?.find((s) => s._id === subCategoryId)?.name || 'Unknown SubCategory';
  };

  if (tests === undefined || subcategories === undefined) return <div className="p-4">Loading...</div>;

  if (tests === null) return <div className="p-4">No tests found</div>;

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Tests</h1>
      <div className="grid gap-4">
        {tests?.map((test) => (
          <div key={test._id} className="p-4 border rounded">
            <div className="text-sm text-gray-500 mb-1">
              {getSubCategoryName(test.subCategoryId)}
            </div>
            <h2 className="font-semibold">{test.name}</h2>
            {test.description && (
              <p className="text-gray-600 mb-2">{test.description}</p>
            )}
            <div className="text-sm text-gray-500">
              <span className="mr-4">Questions: {test.totalQuestions}</span>
              {test.duration && <span>Duration: {test.duration} minutes</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
