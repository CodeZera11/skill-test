import { mutation } from "./_generated/server";

// Generate an upload URL for a file
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
