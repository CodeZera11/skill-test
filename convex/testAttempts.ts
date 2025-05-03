import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Test } from "./tests";
import { Question, Section } from "./sections";

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

export type TestAttempt = {
  _id: Id<"testAttempts">;
  userId: Id<"users">;
  testId: Id<"tests">;
  startTime: number;
  endTime?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  score?: number;
  timeTaken?: number;
  performancePercentile?: number;
  createdAt: number;
  updatedAt: number;
};

export type TestAttemptWithDetails = TestAttempt & {
  test: Test;
  sections: Section[];
  questions: Question[];
};  

export const getTestAttempt = query({
  args: {
    id: v.id("testAttempts"),
  },
  handler: async (ctx, { id }) => {
    try {
      const testAttempt = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("_id"), id))
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

      // lets get everything in this query

      const test = await ctx.db.get(testAttempt.testId);
      if (!test) {
        throw new Error("Test not found");
      }

      const sections = await ctx.db
        .query("sections")
        .filter((s) => s.eq(s.field("testId"), testAttempt.testId))
        .collect();

      const questionsData = await Promise.all(
        sections.map(async (section) => {
          return await ctx.db
            .query("questions")
            .filter((q) => q.eq(q.field("sectionId"), section._id))
            .collect();
        })
      );

      if (!questionsData) {
        throw new Error("No questions found for this test");
      }

      const questions = questionsData.flatMap((questions) => questions);

      return {
        testAttempt,
        test,
        sections,
        questions,
      };
    } catch (error) {
      console.error("Error fetching test attempt:", error);
      return null;
    }
  },
});
