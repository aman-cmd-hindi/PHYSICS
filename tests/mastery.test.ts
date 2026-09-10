import { describe, it, expect } from "vitest";
import { evaluateTopicMastery } from "@/features/mastery/mastery-engine";

describe("Mastery Engine Rules", () => {
  it("should return false for mastery when no questions have been attempted (Opening topic rule)", () => {
    const evalResult = evaluateTopicMastery({}, {});
    expect(evalResult.isMastered).toBe(false);
    expect(evalResult.masteryScore).toBe(0); // Opening a topic has 0% mastery
  });

  it("should evaluate topic as mastered when MCQ accuracy >= 80% and numericals completed", () => {
    const qAnswers = {
      q1: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
      q2: { answer: 1, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
      q3: { answer: 2, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
      q4: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
      q5: { answer: 3, isCorrect: false, attempts: 2, timestamp: new Date().toISOString() },
    };

    const numStates = {
      num1: { stepIndex: 2, mode: "guided" as const, isCompleted: true },
    };

    const evalResult = evaluateTopicMastery(qAnswers, numStates, {
      minMcqAccuracyPercent: 80,
      minNumericalsCompleted: 1,
    });

    expect(evalResult.mcqAccuracyPercent).toBe(80);
    expect(evalResult.numericalsCompletedCount).toBe(1);
    expect(evalResult.isMastered).toBe(true);
    expect(evalResult.masteryScore).toBeGreaterThanOrEqual(80);
  });

  it("should fail mastery gate if MCQ accuracy is below 80%", () => {
    const qAnswers = {
      q1: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
      q2: { answer: 1, isCorrect: false, attempts: 2, timestamp: new Date().toISOString() },
    };

    const numStates = {
      num1: { stepIndex: 2, mode: "guided" as const, isCompleted: true },
    };

    const evalResult = evaluateTopicMastery(qAnswers, numStates, {
      minMcqAccuracyPercent: 80,
      minNumericalsCompleted: 1,
    });

    expect(evalResult.mcqAccuracyPercent).toBe(50);
    expect(evalResult.isMastered).toBe(false);
  });
});
