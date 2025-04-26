import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Function to start a test attempt
export const startTestAttempt = mutation({
  args: {
    userId: v.id("users"),
    testId: v.id("tests"),
  },
  handler: async ({ db }, { userId, testId }) => {
    const startTime = Date.now();

    const test = await db
      .query("tests")
      .filter((q) => q.eq(q.field("_id"), testId))
      .first();

    await db.patch(testId, {
      attempts: test?.attempts ? test.attempts + 1 : 1,
    });

    const testAttemptId = await db.insert("testAttempts", {
      userId,
      testId,
      startTime,
      createdAt: startTime,
      updatedAt: startTime,
    });
    return testAttemptId;
  },
});

// Function to submit a test attempt
export const submitTestAttempt = mutation({
  args: {
    testAttemptId: v.id("testAttempts"),
    correctAnswers: v.number(),
    incorrectAnswers: v.number(),
    score: v.number(),
  },
  handler: async (
    ctx,
    { testAttemptId, correctAnswers, incorrectAnswers, score }
  ) => {
    const endTime = Date.now();
    // .query("sections")
    //   .filter((q) => q.eq(q.field("testId"), args.testId))
    //   .collect();
    const testAttempt = await ctx.db
      .query("testAttempts")
      .filter((q) => q.eq(q.field("_id"), testAttemptId))
      .first();

    if (!testAttempt) {
      throw new Error("Test attempt not found");
    }

    const timeTaken = (endTime - testAttempt.startTime) / 1000; // in seconds

    // Calculate performance percentile (placeholder logic)
    const performancePercentile = Math.random() * 100;

    await ctx.db.patch(testAttemptId, {
      endTime,
      correctAnswers,
      incorrectAnswers,
      score,
      timeTaken,
      performancePercentile,
      updatedAt: endTime,
    });

    return {
      score,
      correctAnswers,
      incorrectAnswers,
      timeTaken,
      performancePercentile,
    };
  },
});
