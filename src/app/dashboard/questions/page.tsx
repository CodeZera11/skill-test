"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function QuestionsPage() {
  const questions = useQuery(api.questions.list);
  const tests = useQuery(api.tests.list);

  const getTestName = (testId: string) => {
    return tests?.find((t) => t._id === testId)?.name || 'Unknown Test';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <div className="grid gap-4">
        {questions?.map((question) => (
          <div key={question._id} className="p-4 border rounded">
            <div className="text-sm text-gray-500 mb-2">
              Test: {getTestName(question.testId)}
            </div>
            <div className="mb-3">
              <h2 className="font-semibold mb-2">{question.question}</h2>
              <div className="pl-4">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`mb-1 ${index === question.correctAnswer ? 'text-green-600 font-medium' : ''}`}
                  >
                    {index + 1}. {option}
                  </div>
                ))}
              </div>
            </div>
            {question.explanation && (
              <div className="text-sm text-gray-600 mt-2 pt-2 border-t">
                <strong>Explanation:</strong> {question.explanation}
              </div>
            )}
            <div className="text-sm text-gray-500 mt-2">
              {question.marks && <span className="mr-3">Marks: {question.marks}</span>}
              {question.negativeMarks && (
                <span>Negative Marks: {question.negativeMarks}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
