import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Global search across published entities only.
 * Uses search indexes (full-text) and returns typed results.
 */
export const globalSearch = query({
  args: {
    searchText: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { searchText, limit = 5 }) => {
    const q = searchText.trim();
    if (!q) return [];

    // Topics
    const topics = await ctx.db
      .query("topics")
      .withSearchIndex("search_name", (s) =>
        s.search("name", q).eq("isPublished", true)
      )
      .take(limit);

    // Categories
    const categories = await ctx.db
      .query("categories")
      .withSearchIndex("search_name", (s) =>
        s.search("name", q).eq("isPublished", true)
      )
      .take(limit);

    // Sub-categories
    const subCategories = await ctx.db
      .query("subCategories")
      .withSearchIndex("search_name", (s) =>
        s.search("name", q).eq("isPublished", true)
      )
      .take(limit);

    // Tests
    const tests = await ctx.db
      .query("tests")
      .withSearchIndex("search_name", (s) =>
        s.search("name", q).eq("isPublished", true)
      )
      .take(limit);

    return [
      ...topics.map((t) => ({
        type: "topic" as const,
        id: t._id,
        name: t.name,
      })),
      ...categories.map((c) => ({
        type: "category" as const,
        id: c._id,
        name: c.name,
      })),
      ...subCategories.map((s) => ({
        type: "subCategory" as const,
        id: s._id,
        name: s.name,
      })),
      ...tests.map((t) => ({
        type: "test" as const,
        id: t._id,
        name: t.name,
      })),
    ];
  },
});
