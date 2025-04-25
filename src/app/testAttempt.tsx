import React, { useState, useEffect } from 'react';
import { startTestAttempt, submitTestAttempt } from '@/convex/functions';

export default function TestAttemptPage({ userId, testId }) {
  const [testAttemptId, setTestAttemptId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Start the test attempt
    const initiateTest = async () => {
      const id = await startTestAttempt({ userId, testId });
      setTestAttemptId(id);
      // Start the timer
      const idInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setIntervalId(idInterval);
    };
    initiateTest();

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async () => {
    clearInterval(intervalId);
    const correctAnswers = 10; // Placeholder
    const incorrectAnswers = 5; // Placeholder
    const score = 75; // Placeholder
    const result = await submitTestAttempt({
      testAttemptId,
      correctAnswers,
      incorrectAnswers,
      score,
    });
    console.log('Test submitted:', result);
  };

  return (
    <div>
      <h1>Test Attempt</h1>
      <p>Timer: {timer} seconds</p>
      <button onClick={handleSubmit}>Submit Test</button>
    </div>
  );
}
