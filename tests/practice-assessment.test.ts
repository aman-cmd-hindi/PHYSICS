import { describe, it, expect } from "vitest";
import { evaluateTopicMastery } from "@/features/mastery/mastery-engine";
import {
  analyzeAssessmentHistory,
  getVerifiedQuestionsForPractice,
  QuestionAttemptRecord,
} from "@/features/practice/assessment-engine";

describe("Phase 7 — Practice, Assessment & Deterministic Mastery", () => {
  it("should advance mastery status through defined states: NOT_STARTED -> LEARNING -> PRACTICED -> MASTERED", () => {
    // 1. Initial State: NOT_STARTED
    const res0 = evaluateTopicMastery({}, {});
    expect(res0.state).toBe("NOT_STARTED");
    expect(res0.isMastered).toBe(false);

    // 2. Single incorrect attempt: LEARNING
    const res1 = evaluateTopicMastery(
      { q1: { answer: 0, isCorrect: false, attempts: 1, timestamp: new Date().toISOString() } },
      {}
    );
    expect(res1.state).toBe("LEARNING");

    // 3. Multiple attempts with 50% accuracy: PRACTICED
    const res2 = evaluateTopicMastery(
      {
        q1: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
        q2: { answer: 1, isCorrect: false, attempts: 2, timestamp: new Date().toISOString() },
      },
      {}
    );
    expect(res2.state).toBe("PRACTICED");

    // 4. 80%+ accuracy with numerical completed: MASTERED
    const res3 = evaluateTopicMastery(
      {
        q1: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
        q2: { answer: 1, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
        q3: { answer: 2, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
        q4: { answer: 0, isCorrect: true, attempts: 1, timestamp: new Date().toISOString() },
        q5: { answer: 3, isCorrect: false, attempts: 2, timestamp: new Date().toISOString() },
      },
      { num1: { stepIndex: 2, mode: "guided" as const, isCompleted: true } },
      { minMcqAccuracyPercent: 80, minNumericalsCompleted: 1 }
    );
    expect(res3.state).toBe("MASTERED");
    expect(res3.isMastered).toBe(true);
  });

  it("should analyze question attempt history and deterministically detect weak/strong topics", () => {
    const attempts: QuestionAttemptRecord[] = [
      { questionId: "q1", topicId: "topic_rotational", chapterId: "ch_01", isCorrect: true, timeSpentSeconds: 40, attemptsCount: 1, timestamp: new Date().toISOString() },
      { questionId: "q2", topicId: "topic_rotational", chapterId: "ch_01", isCorrect: true, timeSpentSeconds: 50, attemptsCount: 1, timestamp: new Date().toISOString() },
      { questionId: "q3", topicId: "topic_fluids", chapterId: "ch_02", isCorrect: false, timeSpentSeconds: 60, attemptsCount: 2, timestamp: new Date().toISOString() },
      { questionId: "q4", topicId: "topic_fluids", chapterId: "ch_02", isCorrect: false, timeSpentSeconds: 70, attemptsCount: 2, timestamp: new Date().toISOString() },
    ];

    const analysis = analyzeAssessmentHistory(attempts);

    expect(analysis.overallAccuracy).toBe(50);
    expect(analysis.strongTopics).toContain("topic_rotational");
    expect(analysis.weakTopics).toContain("topic_fluids");
    expect(analysis.retryQuestionIds).toContain("q3");
    expect(analysis.retryQuestionIds).toContain("q4");
  });

  it("should filter verified questions for chapter, topic, mixed, and revision practice modes without AI", () => {
    const chapterQuestions = getVerifiedQuestionsForPractice("chapter", "ch_01_rotational_dynamics");
    expect(chapterQuestions.length).toBeGreaterThan(0);
    expect(chapterQuestions.every((q) => q.chapterId === "ch_01_rotational_dynamics")).toBe(true);

    const revisionQuestions = getVerifiedQuestionsForPractice("revision");
    expect(revisionQuestions.length).toBeGreaterThan(0);
    expect(revisionQuestions.every((q) => q.difficulty === "medium" || q.difficulty === "hard")).toBe(true);
  });
});
