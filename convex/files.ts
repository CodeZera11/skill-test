import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const getUrl = mutation({
  handler: async (ctx, args: { storageId: Id<"_storage"> }) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Generate an upload URL for a file
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
