import { describe, it, expect } from "vitest";
import { generateAdaptiveRecommendations } from "@/features/practice/adaptive-engine";
import { TopicProgress } from "@/lib/storage/types";

describe("Adaptive Practice Recommendation Engine", () => {
  it("should rank incomplete topics with low accuracy as highest priority", () => {
    const progressMap: Record<string, TopicProgress> = {
      topic_ch_01_rotational_dynamics_01: {
        topicId: "topic_ch_01_rotational_dynamics_01",
        chapterId: "ch_01_rotational_dynamics",
        status: "in_progress",
        completedBlocks: [],
        questionAnswers: {},
        numericalProgress: {},
        masteryScore: 30, // Low accuracy
        lastAccessedAt: new Date().toISOString(),
      },
      topic_ch_02_mechanical_properties_fluids_01: {
        topicId: "topic_ch_02_mechanical_properties_fluids_01",
        chapterId: "ch_02_mechanical_properties_fluids",
        status: "in_progress",
        completedBlocks: [],
        questionAnswers: {},
        numericalProgress: {},
        masteryScore: 90, // High accuracy
        lastAccessedAt: new Date().toISOString(),
      },
    };

    const recommendations = generateAdaptiveRecommendations(progressMap);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].topicId).toBe("topic_ch_01_rotational_dynamics_01");
    expect(recommendations[0].priorityScore).toBe(70); // 100 - 30
  });
});
