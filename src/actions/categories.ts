"use server";

import { fetchMutation } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { revalidatePath } from "next/cache";
import { PageRoutes } from "@/constants/page-routes";

export async function deleteCategory(id: Id<"categories">) {
  await fetchMutation(api.categories.remove, {
    id,
  });

  revalidatePath(PageRoutes.DASHBOARD.CATEGORIES);
}

export async function toggleCategoryPublishStatus(
  id: Id<"categories">,
  publishStatus: boolean
) {
  await fetchMutation(api.categories.togglePublishStatus, {
    id,
    publishStatus,
  });

  revalidatePath(PageRoutes.DASHBOARD.CATEGORIES);
}
