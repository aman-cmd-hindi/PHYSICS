import { TopicProgress } from "@/lib/storage/types";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";

export interface SpacedRepetitionItem {
  topicId: string;
  chapterTitle: string;
  topicTitle: string;
  daysOverdue: number;
  intervalDays: number;
  masteryScore: number;
}

export interface WeakTopicItem {
  topicId: string;
  chapterId: string;
  chapterTitle: string;
  topicTitle: string;
  accuracyPercent: number;
  weakConcept: string;
  recommendedSteps: string[];
}

export function calculateSpacedRepetitionSchedule(
  progressMap: Record<string, TopicProgress>
): SpacedRepetitionItem[] {
  const dueItems: SpacedRepetitionItem[] = [];
  const now = new Date().getTime();

  for (const [topicId, prog] of Object.entries(progressMap)) {
    if (!prog.lastAccessedAt) continue;

    const lastAccessTime = new Date(prog.lastAccessedAt).getTime();
    const daysSinceAccess = Math.floor((now - lastAccessTime) / (1000 * 60 * 60 * 24));

    // Intervals: 1 day, 3 days, 7 days
    if (daysSinceAccess >= 1) {
      dueItems.push({
        topicId,
        chapterTitle: prog.chapterId,
        topicTitle: `Topic ${topicId}`,
        daysOverdue: daysSinceAccess,
        intervalDays: daysSinceAccess >= 7 ? 7 : daysSinceAccess >= 3 ? 3 : 1,
        masteryScore: prog.masteryScore || 0,
      });
    }
  }

  return dueItems.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export function detectWeakTopics(
  progressMap: Record<string, TopicProgress>
): WeakTopicItem[] {
  const weakTopics: WeakTopicItem[] = [];

  for (const chapter of OFFICIAL_CHAPTERS_MANIFEST) {
    const topicId = `topic_${chapter.id}_01`;
    const prog = progressMap[topicId];

    if (prog && (prog.masteryScore < 80 || prog.status === "in_progress")) {
      weakTopics.push({
        topicId,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        topicTitle: `${chapter.title} — Key Quantitative Concept`,
        accuracyPercent: prog.masteryScore || 50,
        weakConcept: `Mastery below minimum 80% threshold (${prog.masteryScore || 50}%)`,
        recommendedSteps: [
          "1. Review Concept Re-explanation",
          "2. Inspect Vector Diagram Visual",
          "3. Solve 3 Topic Practice MCQs",
          "4. Complete Guided Numerical Step-by-Step",
          "5. Solve Stage 3 Exam Numerical",
          "6. Retest Mastery Gate",
        ],
      });
    }
  }

  return weakTopics;
}
