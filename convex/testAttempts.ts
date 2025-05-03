import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Question } from "./sections";

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
    answers: v.record(v.string(), v.union(v.null(), v.number())),
  },
  handler: async (ctx, { testAttemptId, answers }) => {
    try {
      const endTime = Date.now();

      const testAttempt = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("_id"), testAttemptId))
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

      const test = await ctx.db.get(testAttempt.testId);
      if (!test) {
        throw new Error("Test not found");
      }

      const duration = test.duration;

      if (!duration || duration <= 0) {
        throw new Error("Test duration is not set or invalid.");
      }

      const allowedEndTime =
        testAttempt.startTime + duration * 60 * 1000 + 3600 * 1000; // 1 hour buffer

      if (endTime > allowedEndTime) {
        throw new Error("Test duration exceeded. Possible cheating detected.");
      }

      const questions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("testId"), testAttempt.testId))
        .collect();

      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let score = 0;

      questions.forEach((question) => {
        const userAnswer = answers[question._id];
        if (userAnswer !== undefined) {
          if (userAnswer === question.correctAnswer) {
            correctAnswers++;
            score += question.marks || 1;
          } else {
            incorrectAnswers++;
            score -= question.negativeMarks || 0;
          }
        }
      });

      const timeTaken = (endTime - testAttempt.startTime) / 1000; // in seconds

      await ctx.db.patch(testAttemptId, {
        endTime,
        correctAnswers,
        incorrectAnswers,
        score,
        timeTaken,
        updatedAt: endTime,
      });

      return {
        score,
        correctAnswers,
        incorrectAnswers,
        timeTaken,
      };
    } catch (error) {
      console.error("Error submitting test attempt:", error);
      return null;
    }
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

export type TestAttemptWithDetails = {
  testAttempt: TestAttempt;
  test: {
    _id: Id<"tests">;
    name: string;
    description?: string;
    duration?: number;
    attempts?: number;
    createdAt: number;
    updatedAt: number;
  };
  sections: {
    _id: Id<"sections">;
    name: string;
    description?: string;
    duration?: number;
    testId: Id<"tests">;
    createdAt: number;
    updatedAt: number;
  }[];
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
        .order("desc")
        .first();

      if (!testAttempt) {
        throw new Error("Test attempt not found");
      }

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
