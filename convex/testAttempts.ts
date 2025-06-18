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

// Function to get a test attempt with detailed answers
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

      // Populate detailed answers with full question data
      const populatedAnswers = testAttempt.answers?.map((answer) => {
        const question = questions.find((q) => q._id === answer.questionId);
        return {
          ...answer,
          question: question
            ? {
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                marks: question.marks,
                negativeMarks: question.negativeMarks,
              }
            : null,
        };
      });

      return {
        testAttempt: {
          ...testAttempt,
          answers: populatedAnswers, // Include detailed answers with question data
        },
        test,
        sections,
        questions,
        // answers: testAttempt.answers, // Include detailed answers
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
