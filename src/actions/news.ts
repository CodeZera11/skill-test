"use server"

import { PageRoutes } from "@/constants/page-routes";
import { fetchMutation } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export async function removeNews(id: Id<"news">) {
  await fetchMutation(api.news.deleteNews, {
    id,
  });

  revalidatePath(PageRoutes.DASHBOARD.NEWS);
}

export async function toggleNewsPublishStatus(
  id: Id<"news">,
  publishStatus: boolean
) {
  await fetchMutation(api.news.toggleNewsPublishStatus, {
    id,
    publishStatus,
  });

  revalidatePath(PageRoutes.DASHBOARD.TOPICS);
}
