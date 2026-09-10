import { describe, it, expect } from "vitest";
import { generateTestConfig, calculateTestResult } from "@/features/tests/test-engine";

describe("Test Engine — Config Generation & Scoring Calculation", () => {
  it("should generate a valid test config with correct total marks", () => {
    const config = generateTestConfig("chapter_test", "Chapter 1 Test", [1], 45);
    expect(config.title).toBe("Chapter 1 Test");
    expect(config.durationMinutes).toBe(45);
    expect(config.questions.length).toBeGreaterThan(0);
    expect(config.totalMarks).toBeGreaterThan(0);
  });

  it("should accurately calculate test scores and section breakdowns", () => {
    const config = generateTestConfig("chapter_test", "Sample Test", [1], 45);

    // Simulate correct answers for all questions
    const answers: Record<string, { selectedOptionIndex?: number; textAnswer?: string }> = {};
    for (const q of config.questions) {
      if (q.options && q.correctOptionIndex !== undefined) {
        answers[q.id] = { selectedOptionIndex: q.correctOptionIndex };
      } else {
        answers[q.id] = { textAnswer: "Full model solution attempted" };
      }
    }

    const result = calculateTestResult(config, answers);
    expect(result.totalMarksEarned).toBe(config.totalMarks);
    expect(result.accuracyPercent).toBe(100);
  });
});
