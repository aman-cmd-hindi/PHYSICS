import { TopicProgress } from "@/lib/storage/types";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";

export interface AdaptiveRecommendation {
  chapterId: string;
  topicId: string;
  topicTitle: string;
  priorityScore: number; // Higher means higher recommendation priority
  reason: string;
}

export function generateAdaptiveRecommendations(
  progressMap: Record<string, TopicProgress>
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  for (const chapter of OFFICIAL_CHAPTERS_MANIFEST) {
    // Generate simulated topic recommendations based on recorded progress
    const topicId = `topic_${chapter.id}_01`;
    const prog = progressMap[topicId];

    if (!prog) {
      recommendations.push({
        chapterId: chapter.id,
        topicId,
        topicTitle: `${chapter.title} — Topic 1`,
        priorityScore: 50,
        reason: "Not Started Yet",
      });
    } else if (prog.status !== "completed") {
      const accuracy = prog.masteryScore || 0;
      recommendations.push({
        chapterId: chapter.id,
        topicId,
        topicTitle: `${chapter.title} — Topic 1`,
        priorityScore: 100 - accuracy,
        reason: accuracy < 70 ? "Weak MCQ Accuracy" : "In Progress",
      });
    }
  }

  // Sort by priorityScore descending
  return recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
}
