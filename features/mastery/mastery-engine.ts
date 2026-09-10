import { QuestionAnswerState, NumericalState } from "@/lib/storage/types";

export type MasteryState = "NOT_STARTED" | "LEARNING" | "PRACTICED" | "MASTERED";

export interface MasteryCriteria {
  minMcqAccuracyPercent: number;
  minNumericalsCompleted: number;
}

export interface MasteryEvaluation {
  masteryScore: number; // 0 to 100
  mcqAccuracyPercent: number;
  numericalsCompletedCount: number;
  isMastered: boolean;
  state: MasteryState;
}

/**
 * Deterministic Mastery State Machine:
 * - NOT_STARTED: No question attempts and no numerical attempts.
 * - LEARNING: At least 1 attempt made, but accuracy or numerical count below practiced thresholds.
 * - PRACTICED: Has attempted multiple questions with at least 50% accuracy or completed 1 numerical.
 * - MASTERED: >= minMcqAccuracyPercent (typically 80%) AND >= minNumericalsCompleted (typically 1).
 */
export function evaluateTopicMastery(
  questionAnswers: Record<string, QuestionAnswerState>,
  numericalStates: Record<string, NumericalState>,
  criteria: MasteryCriteria = { minMcqAccuracyPercent: 80, minNumericalsCompleted: 1 }
): MasteryEvaluation {
  const answersList = Object.values(questionAnswers);
  const totalQuestions = answersList.length;

  let correctCount = 0;
  for (const ans of answersList) {
    if (ans.isCorrect) correctCount++;
  }

  const mcqAccuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let numericalsCompletedCount = 0;
  for (const num of Object.values(numericalStates)) {
    if (num.isCompleted) numericalsCompletedCount++;
  }

  // Mastery score weighted: 60% MCQ accuracy + 40% Numerical completion
  const mcqWeight = Math.min(100, mcqAccuracyPercent) * 0.6;
  const numWeight =
    criteria.minNumericalsCompleted > 0
      ? Math.min(100, (numericalsCompletedCount / criteria.minNumericalsCompleted) * 100) * 0.4
      : 40;

  const masteryScore = Math.round(mcqWeight + numWeight);

  const isMastered =
    totalQuestions > 0 &&
    mcqAccuracyPercent >= criteria.minMcqAccuracyPercent &&
    numericalsCompletedCount >= criteria.minNumericalsCompleted;

  let state: MasteryState = "NOT_STARTED";
  if (isMastered) {
    state = "MASTERED";
  } else if (totalQuestions >= 2 && (mcqAccuracyPercent >= 50 || numericalsCompletedCount >= 1)) {
    state = "PRACTICED";
  } else if (totalQuestions > 0 || numericalsCompletedCount > 0) {
    state = "LEARNING";
  }

  return {
    masteryScore,
    mcqAccuracyPercent,
    numericalsCompletedCount,
    isMastered,
    state,
  };
}
