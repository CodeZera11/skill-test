"use server"

import { PageRoutes } from "@/constants/page-routes";
import { Id } from "../../convex/_generated/dataModel";
import { revalidatePath } from "next/cache";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function deleteSubCategory(id: Id<"subCategories">) {
  await fetchMutation(api.subCategories.remove, {
    id,
  });

  revalidatePath(PageRoutes.DASHBOARD.SUB_CATEGORIES);
}