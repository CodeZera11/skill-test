"use server";

import { fetchMutation } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { revalidatePath } from "next/cache";
import { PageRoutes } from "@/constants/page-routes";

export async function deleteTopic(id: Id<"topics">) {
  await fetchMutation(api.topics.remove, {
    id,
  });

  revalidatePath(PageRoutes.DASHBOARD.TOPICS);
}
