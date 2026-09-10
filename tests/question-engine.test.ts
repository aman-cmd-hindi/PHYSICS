import { describe, it, expect } from "vitest";
import { MCQQuestionBlock } from "@/content/types/course";

describe("Question Engine — MCQ Data Validation & Attempt Rules", () => {
  const sampleMCQ: MCQQuestionBlock = {
    id: "q_test_01",
    type: "mcq",
    order: 1,
    question: "What is the unit of moment of inertia?",
    options: ["kg·m²", "N·m", "kg/m²", "J·s"],
    correctOptionIndex: 0,
    hint: "Recall I = m * r².",
    explanation: "SI unit of mass is kg and radius is m, so I is measured in kg·m².",
  };

  it("should correctly identify the correct option index", () => {
    expect(sampleMCQ.correctOptionIndex).toBe(0);
    expect(sampleMCQ.options[sampleMCQ.correctOptionIndex]).toBe("kg·m²");
  });

  it("should contain pre-authored hint and explanation without requiring AI", () => {
    expect(sampleMCQ.hint).toBeTruthy();
    expect(sampleMCQ.explanation).toBeTruthy();
  });
});
