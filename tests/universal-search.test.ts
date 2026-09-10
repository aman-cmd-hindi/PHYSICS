import { describe, it, expect } from "vitest";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_PHYSICS_FORMULAS } from "@/content/data/formulas";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";

describe("Universal Search Engine — Offline Local Index", () => {
  it("should index all official chapters, formulas, and PYQs", () => {
    expect(OFFICIAL_CHAPTERS_MANIFEST.length).toBe(16);
    expect(VERIFIED_PHYSICS_FORMULAS.length).toBeGreaterThan(0);
    expect(VERIFIED_PYQS_CATALOG.length).toBeGreaterThan(0);
  });

  it("should find relevant formulas by topic or chapter query", () => {
    const query = "torque";
    const results = VERIFIED_PHYSICS_FORMULAS.filter(
      (f) =>
        f.title.toLowerCase().includes(query) ||
        f.latex.toLowerCase().includes(query) ||
        f.physicalMeaning.toLowerCase().includes(query)
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain("torque");
  });

  it("should find PYQs by year or topic query", () => {
    const query = "rotational";
    const results = VERIFIED_PYQS_CATALOG.filter(
      (p) =>
        p.topicTitle.toLowerCase().includes(query) ||
        p.question.toLowerCase().includes(query)
    );

    expect(results.length).toBeGreaterThan(0);
  });
});
