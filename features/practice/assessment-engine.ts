import { QuestionAnswerState, NumericalState } from "@/lib/storage/types";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";
import { PYQModel } from "@/content/types/pyq";

export interface QuestionAttemptRecord {
  questionId: string;
  topicId: string;
  chapterId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  attemptsCount: number;
  timestamp: string;
}

export interface TopicAssessmentMetrics {
  topicId: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercent: number;
  averageTimeSeconds: number;
  status: "WEAK" | "AVERAGE" | "STRONG";
}

/**
 * Deterministic assessment analysis:
 * - Detects weak topics (< 65% accuracy) and strong topics (>= 80% accuracy)
 * - Identifies questions requiring retry
 * - Recommends deterministic revision packages without AI
 */
export function analyzeAssessmentHistory(
  attempts: QuestionAttemptRecord[]
): {
  overallAccuracy: number;
  topicBreakdown: Record<string, TopicAssessmentMetrics>;
  weakTopics: string[];
  strongTopics: string[];
  retryQuestionIds: string[];
} {
  const breakdown: Record<string, { total: number; correct: number; totalTime: number }> = {};
  const retryIds = new Set<string>();

  let totalCorrect = 0;

  for (const record of attempts) {
    if (!breakdown[record.topicId]) {
      breakdown[record.topicId] = { total: 0, correct: 0, totalTime: 0 };
    }
    breakdown[record.topicId].total += 1;
    breakdown[record.topicId].totalTime += record.timeSpentSeconds;

    if (record.isCorrect) {
      totalCorrect += 1;
      breakdown[record.topicId].correct += 1;
    } else {
      retryIds.add(record.questionId);
    }
  }

  const topicMetrics: Record<string, TopicAssessmentMetrics> = {};
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  for (const [topicId, data] of Object.entries(breakdown)) {
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const avgTime = data.total > 0 ? Math.round(data.totalTime / data.total) : 0;
    const status = accuracy < 65 ? "WEAK" : accuracy >= 80 ? "STRONG" : "AVERAGE";

    topicMetrics[topicId] = {
      topicId,
      totalAttempts: data.total,
      correctAttempts: data.correct,
      accuracyPercent: accuracy,
      averageTimeSeconds: avgTime,
      status,
    };

    if (status === "WEAK") weakTopics.push(topicId);
    if (status === "STRONG") strongTopics.push(topicId);
  }

  const overallAccuracy = attempts.length > 0 ? Math.round((totalCorrect / attempts.length) * 100) : 0;

  return {
    overallAccuracy,
    topicBreakdown: topicMetrics,
    weakTopics,
    strongTopics,
    retryQuestionIds: Array.from(retryIds),
  };
}

/**
 * Deterministic question set generator for practice modes
 */
export function getVerifiedQuestionsForPractice(
  mode: "chapter" | "topic" | "mixed" | "revision",
  targetId?: string
): PYQModel[] {
  switch (mode) {
    case "chapter":
      return VERIFIED_PYQS_CATALOG.filter((q) => !targetId || q.chapterId === targetId);
    case "topic":
      return VERIFIED_PYQS_CATALOG.filter((q) => !targetId || q.topicId === targetId);
    case "mixed":
      // Deterministic round-robin sample from catalog
      return [...VERIFIED_PYQS_CATALOG].sort((a, b) => a.year - b.year);
    case "revision":
      // Focus on medium and hard questions from earlier years
      return VERIFIED_PYQS_CATALOG.filter((q) => q.difficulty === "medium" || q.difficulty === "hard");
    default:
      return VERIFIED_PYQS_CATALOG;
  }
}
