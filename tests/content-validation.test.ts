import { describe, it, expect } from "vitest";
import { validateTopicPackage } from "@/features/content-studio/validation";
import { TopicPackage } from "@/content/types/course";

describe("Content Studio — Content Package Validation", () => {
  it("should return validation errors if topic ID or title is missing", () => {
    const invalidTopic: TopicPackage = {
      id: "",
      title: "",
      chapterId: "ch_01",
      sequenceOrder: 1,
      learningObjectives: [],
      masteryCriteria: { minMcqAccuracyPercent: 80, minNumericalsCompleted: 2 },
      blocks: [],
    };

    const errors = validateTopicPackage(invalidTopic);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.field === "id")).toBe(true);
    expect(errors.some((e) => e.field === "title")).toBe(true);
    expect(errors.some((e) => e.field === "blocks")).toBe(true);
  });

  it("should validate MCQ block fields (question, options, hint, explanation)", () => {
    const invalidMCQTopic: TopicPackage = {
      id: "topic_test",
      title: "Test Topic",
      chapterId: "ch_01",
      sequenceOrder: 1,
      learningObjectives: [],
      masteryCriteria: { minMcqAccuracyPercent: 80, minNumericalsCompleted: 2 },
      blocks: [
        {
          id: "b_mcq_1",
          type: "mcq",
          order: 1,
          question: "",
          options: ["Opt 1"],
          correctOptionIndex: 0,
          hint: "",
          explanation: "",
        },
      ],
    };

    const errors = validateTopicPackage(invalidMCQTopic);
    expect(errors.some((e) => e.field === "question")).toBe(true);
    expect(errors.some((e) => e.field === "options")).toBe(true);
    expect(errors.some((e) => e.field === "hint")).toBe(true);
    expect(errors.some((e) => e.field === "explanation")).toBe(true);
  });

  it("should pass validation for a fully formed valid topic package", () => {
    const validTopic: TopicPackage = {
      id: "topic_rotational_dynamics_01",
      title: "Characteristics of Circular Motion",
      chapterId: "rotational_dynamics",
      sequenceOrder: 1,
      learningObjectives: ["Understand circular motion"],
      masteryCriteria: { minMcqAccuracyPercent: 80, minNumericalsCompleted: 2 },
      blocks: [
        {
          id: "b_mcq_01",
          type: "mcq",
          order: 1,
          question: "What is the relation between angular speed ω and time period T?",
          options: ["ω = 2π/T", "ω = 2πT", "ω = T/2π", "ω = π/T"],
          correctOptionIndex: 0,
          hint: "Think about full revolution angle of 2π radians.",
          explanation: "Angular speed is angular displacement per unit time: ω = 2π/T.",
        },
      ],
    };

    const errors = validateTopicPackage(validTopic);
    expect(errors.length).toBe(0);
  });
});
