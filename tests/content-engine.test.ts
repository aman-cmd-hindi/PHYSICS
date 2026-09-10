import { describe, it, expect } from "vitest";
import { PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC, VERIFIED_TOPIC_PACKAGES } from "@/content/data/curriculum-packages";
import { validateTopicPackage } from "@/features/content-studio/validation";

describe("Phase 6 — Content Engine & Authoritative Curriculum Integrity", () => {
  it("should have valid published topic package with complete provenance metadata", () => {
    const topic = PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC;
    expect(topic.id).toBe("topic_rotational_01");
    expect(topic.chapterId).toBe("ch_01_rotational_dynamics");
    expect(topic.provenance).toBeDefined();
    expect(topic.provenance?.verified).toBe(true);
    expect(topic.provenance?.sourceType).toBe("textbook");
    expect(topic.provenance?.status).toBe("VERIFIED");
  });

  it("should pass content studio validation gate with zero errors", () => {
    const errors = validateTopicPackage(PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC);
    expect(errors.length).toBe(0);
  });

  it("should support diverse educational block types (theory, definition, equation, derivation, formula_lab, mcq, pyq, summary, mastery_gate)", () => {
    const blocks = PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC.blocks;
    const blockTypes = blocks.map((b) => b.type);

    expect(blockTypes).toContain("theory");
    expect(blockTypes).toContain("definition");
    expect(blockTypes).toContain("equation");
    expect(blockTypes).toContain("derivation");
    expect(blockTypes).toContain("formula_lab");
    expect(blockTypes).toContain("mcq");
    expect(blockTypes).toContain("pyq");
    expect(blockTypes).toContain("summary");
    expect(blockTypes).toContain("mastery_gate");
  });

  it("should have textbook page range references mapped without fabrication", () => {
    const topic = PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC;
    expect(topic.textbookPageReference).toBeDefined();
    expect(topic.textbookPageReference?.startPage).toBe(1);
    expect(topic.textbookPageReference?.endPage).toBe(6);
  });

  it("should make topic package retrievable by stable IDs", () => {
    expect(VERIFIED_TOPIC_PACKAGES["topic_rotational_01"]).toBeDefined();
    expect(VERIFIED_TOPIC_PACKAGES["topic-1"]).toBeDefined();
  });
});
