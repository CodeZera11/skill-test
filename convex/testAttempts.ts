import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { Question } from "./sections";

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

    if (!test) {
      throw new Error("Test not found");
    }

    const sections = await db
      .query("sections")
      .filter((q) => q.eq(q.field("testId"), testId))
      .order("asc") // Ensure sections are ordered
      .collect();

    if (!sections || sections.length === 0) {
      throw new Error("No sections found for this test");
    }

    const firstSection = sections[0];

    await db.patch(testId, {
      attempts: test?.attempts ? test.attempts + 1 : 1,
    });

    const testAttemptId = await db.insert("testAttempts", {
      userId,
      testId,
      startTime,
      currentSection: firstSection._id, // Initialize with the first section
      sectionTimes: [], // Empty array to track time spent on each section
      createdAt: startTime,
      updatedAt: startTime,
    });

    return testAttemptId;
  },
});

export const updateCurrentSection = mutation({
  args: {
    testAttemptId: v.id("testAttempts"),
    newSectionId: v.id("sections"),
    timeSpentInSeconds: v.number(),
  },
  handler: async (
    { db },
    { testAttemptId, newSectionId, timeSpentInSeconds }
  ) => {
    const testAttempt = await db
      .query("testAttempts")
      .filter((q) => q.eq(q.field("_id"), testAttemptId))
      .first();

    if (!testAttempt) {
      throw new Error("Test attempt not found");
    }

    const updatedSectionTimes = [
      ...(testAttempt.sectionTimes || []),
      {
        sectionId: newSectionId,
        timeSpentInSeconds,
      },
    ];

    await db.patch(testAttemptId, {
      currentSection: newSectionId, // Update to the new section
      sectionTimes: updatedSectionTimes, // Update the time spent on sections
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

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

      const duration = test.durationInSeconds;

      if (!duration || duration <= 0) {
        throw new Error("Test duration is not set or invalid.");
      }
      const durationInMinutes = duration / 60;
      const allowedEndTime =
        testAttempt.startTime + durationInMinutes + 3600000;

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

      const detailedAnswers = questions.map((question) => {
        const userAnswer = answers[question._id];
        const isCorrect = userAnswer === question.correctAnswer;

        if (userAnswer !== undefined) {
          if (isCorrect) {
            correctAnswers++;
            score += question.marks || 1;
          } else {
            incorrectAnswers++;
            score -= question.negativeMarks || 0;
          }
        }

        return {
          questionId: question._id,
          selectedOption: userAnswer ?? undefined,
          isCorrect,
        };
      });

      const startTime = testAttempt.startTime;
      const timeTaken = (endTime - startTime) / 1000; // in seconds

      await ctx.db.patch(testAttemptId, {
        endTime,
        correctAnswers,
        incorrectAnswers,
        score,
        timeTakenInSeconds: timeTaken,
        answers: detailedAnswers, // Store detailed answers
        updatedAt: endTime,
      });

      return {
        score,
        correctAnswers,
        incorrectAnswers,
        timeTaken,
        detailedAnswers,
      };
    } catch (error) {
      console.error("Error submitting test attempt:", error);
      return null;
    }
  },
});

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

      const currentSection = sections.find(
        (section) => section._id === testAttempt.currentSection
      );

      const questions = await ctx.db
        .query("questions")
        .filter((q) => q.eq(q.field("sectionId"), testAttempt.currentSection))
        .collect();

      return {
        testAttempt: {
          ...testAttempt,
          currentSection, // Include current section details
          sectionTimes: testAttempt.sectionTimes || [], // Include section times
        },
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

// Updated types for TestAttempt and TestAttemptWithDetails
export type TestAttempt = {
  _id: Id<"testAttempts">;
  userId: Id<"users">;
  testId: Id<"tests">;
  startTime: number;
  endTime?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  score?: number;
  timeTakenInSeconds?: number;
  performancePercentile?: number;
  answers?: {
    questionId: Id<"questions">;
    selectedOption?: number;
    isCorrect: boolean;
  }[];
  createdAt: number;
  updatedAt: number;
};

export type TestAttemptWithDetails = {
  testAttempt: TestAttempt;
  test: {
    _id: Id<"tests">;
    name: string;
    description?: string;
    durationInSeconds?: number;
    attempts?: number;
    createdAt: number;
    updatedAt: number;
  };
  sections: {
    _id: Id<"sections">;
    name: string;
    description?: string;
    durationInSeconds?: number;
    testId: Id<"tests">;
    createdAt: number;
    updatedAt: number;
  }[];
  questions: Question[];
};

export const getTestAttemptsByUser = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), args.clerkUserId))
        .first();
      if (!user) {
        throw new Error("User not found");
      }

      const testAttempts = await ctx.db
        .query("testAttempts")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .order("desc")
        .collect();
      if (!testAttempts) {
        throw new Error("No test attempts found for this user");
      }

      const testWithDetails = await Promise.all(
        testAttempts.map(async (testAttempt) => {
          const test = await ctx.db.get(testAttempt.testId);
          if (!test) {
            throw new Error("Test not found");
          }

          return {
            ...testAttempt,
            test,
          };
        })
      );

      return testWithDetails;
    } catch (error) {
      console.log("Error fetching test attempts:", error);
      return null;
    }
  },
});
