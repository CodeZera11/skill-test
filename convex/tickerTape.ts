import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const DEFAULT_TICKER_SPEED = 40;
const DEFAULT_TICKER_ITEMS_TO_SHOW = 10;

const getDefaultConfig = () => ({
  speed: DEFAULT_TICKER_SPEED,
  itemsToShow: DEFAULT_TICKER_ITEMS_TO_SHOW,
});

const sortByPublishedDate = <
  T extends { createdAt: number; publishedAt?: number }
>(
  items: T[]
) =>
  items.sort(
    (a, b) => (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt)
  );

export const getAllTickerTapeItems = query({
  args: {
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchQuery) {
      const searchData = await ctx.db
        .query("tickerTapeItems")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.searchQuery!)
        )
        .collect();

      return searchData.sort((a, b) => b.createdAt - a.createdAt);
    }

    const items = await ctx.db.query("tickerTapeItems").order("desc").collect();
    return items.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getPublishedTickerTapeItems = query({
  args: {},
  handler: async (ctx) => {
    const configDoc = await ctx.db.query("tickerTapeConfig").first();
    const config = configDoc || getDefaultConfig();

    const items = await ctx.db
      .query("tickerTapeItems")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    return sortByPublishedDate(items).slice(0, config.itemsToShow);
  },
});

export const getTickerTapeConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("tickerTapeConfig").first();
    if (!config) {
      return getDefaultConfig();
    }

    return config;
  },
});

export const createTickerTapeItem = mutation({
  args: {
    title: v.string(),
    link: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("tickerTapeItems", {
      title: args.title,
      link: args.link,
      isPublished: args.isPublished,
      publishedAt: args.isPublished ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTickerTapeItem = mutation({
  args: {
    id: v.id("tickerTapeItems"),
    title: v.string(),
    link: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Ticker tape item not found");
    }

    const now = Date.now();
    const publishedAt =
      args.isPublished && !existing.isPublished ? now : existing.publishedAt;

    return await ctx.db.patch(args.id, {
      title: args.title,
      link: args.link,
      isPublished: args.isPublished,
      publishedAt,
      updatedAt: now,
    });
  },
});

export const deleteTickerTapeItem = mutation({
  args: { id: v.id("tickerTapeItems") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const toggleTickerTapePublishStatus = mutation({
  args: {
    id: v.id("tickerTapeItems"),
    publishStatus: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Ticker tape item not found");
    }

    const now = Date.now();
    const publishedAt =
      args.publishStatus && !existing.isPublished ? now : existing.publishedAt;

    return await ctx.db.patch(args.id, {
      isPublished: args.publishStatus,
      publishedAt,
      updatedAt: now,
    });
  },
});

export const upsertTickerTapeConfig = mutation({
  args: {
    speed: v.number(),
    itemsToShow: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("tickerTapeConfig").first();
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        speed: args.speed,
        itemsToShow: args.itemsToShow,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("tickerTapeConfig", {
      speed: args.speed,
      itemsToShow: args.itemsToShow,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export type TickerTapeItem = {
  _id: Id<"tickerTapeItems">;
  title: string;
  link?: string;
  isPublished: boolean;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};
