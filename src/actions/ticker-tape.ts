"use server"

import { fetchMutation } from "convex/nextjs";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

export async function removeTickerTapeItem(id: Id<"tickerTapeItems">) {
  await fetchMutation(api.tickerTape.deleteTickerTapeItem, {
    id,
  });
}

export async function toggleTickerTapePublishStatus(
  id: Id<"tickerTapeItems">,
  publishStatus: boolean
) {
  await fetchMutation(api.tickerTape.toggleTickerTapePublishStatus, {
    id,
    publishStatus,
  });
}
