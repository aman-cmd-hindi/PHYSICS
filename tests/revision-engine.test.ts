import { describe, it, expect } from "vitest";
import { calculateSpacedRepetitionSchedule, detectWeakTopics } from "@/features/revision/revision-engine";
import { TopicProgress } from "@/lib/storage/types";

describe("Revision Engine & Weak Topic Recovery", () => {
  it("should calculate spaced repetition schedule based on last accessed date", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const progressMap: Record<string, TopicProgress> = {
      topic_rotational_dynamics_01: {
        topicId: "topic_rotational_dynamics_01",
        chapterId: "rotational_dynamics",
        status: "completed",
        masteryScore: 85,
        lastAccessedAt: twoDaysAgo,
        completedBlocks: [],
        questionAnswers: {},
        numericalProgress: {},
      },
    };

    const schedule = calculateSpacedRepetitionSchedule(progressMap);
    expect(schedule.length).toBe(1);
    expect(schedule[0].daysOverdue).toBeGreaterThanOrEqual(1);
  });

  it("should detect weak topics with mastery score below 80%", () => {
    const progressMap: Record<string, TopicProgress> = {
      topic_ch_01_rotational_dynamics_01: {
        topicId: "topic_ch_01_rotational_dynamics_01",
        chapterId: "ch_01_rotational_dynamics",
        status: "in_progress",
        masteryScore: 65,
        lastAccessedAt: new Date().toISOString(),
        completedBlocks: [],
        questionAnswers: {},
        numericalProgress: {},
      },
    };

    const weakTopics = detectWeakTopics(progressMap);
    expect(weakTopics.length).toBeGreaterThan(0);
    const rotationalWeak = weakTopics.find((t) => t.chapterId === "ch_01_rotational_dynamics");
    expect(rotationalWeak).toBeDefined();
    expect(rotationalWeak?.accuracyPercent).toBe(65);
    expect(rotationalWeak?.recommendedSteps.length).toBe(6);
  });
});
