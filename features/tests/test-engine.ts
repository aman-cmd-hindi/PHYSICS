import { TestConfig, TestAttemptState, TestQuestionItem, TestType } from "./types";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";

export function generateTestConfig(
  type: TestType,
  title: string,
  chapterNumbers: number[] = [1],
  durationMinutes = 45
): TestConfig {
  const sampleQuestions: TestQuestionItem[] = VERIFIED_PYQS_CATALOG.map((p) => ({
    id: `tq_${p.id}`,
    section:
      p.marks === 1
        ? "Section A (MCQs)"
        : p.marks === 2
        ? "Section B (2M)"
        : p.marks === 3
        ? "Section C (3M)"
        : "Section D (4M)",
    marks: p.marks,
    question: p.question,
    options: p.options,
    correctOptionIndex: p.correctOptionIndex,
    expectedAnswer: p.boardSolution,
    markingScheme: p.markingScheme,
    topicId: p.topicId,
    chapterNumber: p.chapterNumber,
  }));

  const totalMarks = sampleQuestions.reduce((sum, q) => sum + q.marks, 0);

  return {
    id: `test_${type}_${Date.now()}`,
    title,
    testType: type,
    durationMinutes,
    totalMarks,
    chapterNumbers,
    questions: sampleQuestions,
  };
}

export function calculateTestResult(
  config: TestConfig,
  answers: TestAttemptState["answers"]
) {
  let earnedMarks = 0;
  const sectionBreakdown: Record<string, { earned: number; max: number }> = {};

  for (const q of config.questions) {
    if (!sectionBreakdown[q.section]) {
      sectionBreakdown[q.section] = { earned: 0, max: 0 };
    }
    sectionBreakdown[q.section].max += q.marks;

    const userAns = answers[q.id];
    if (userAns) {
      if (q.options && q.correctOptionIndex !== undefined) {
        if (userAns.selectedOptionIndex === q.correctOptionIndex) {
          earnedMarks += q.marks;
          sectionBreakdown[q.section].earned += q.marks;
        }
      } else if (userAns.textAnswer && userAns.textAnswer.trim().length > 0) {
        // Full score simulation for attempted notebook solution in self-evaluation
        earnedMarks += q.marks;
        sectionBreakdown[q.section].earned += q.marks;
      }
    }
  }

  const accuracyPercent = config.totalMarks > 0 ? Math.round((earnedMarks / config.totalMarks) * 100) : 0;

  return {
    totalMarksEarned: earnedMarks,
    maxMarks: config.totalMarks,
    accuracyPercent,
    sectionBreakdown,
  };
}
