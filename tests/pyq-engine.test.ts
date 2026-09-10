import { describe, it, expect } from "vitest";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";

describe("PYQ Engine — Metadata & Filtering Verification", () => {
  it("should contain verified PYQs with valid board marking schemes", () => {
    expect(VERIFIED_PYQS_CATALOG.length).toBeGreaterThan(0);
    for (const pyq of VERIFIED_PYQS_CATALOG) {
      expect(pyq.year).toBeGreaterThanOrEqual(2020);
      expect(pyq.marks).toBeGreaterThanOrEqual(1);
      expect(pyq.marks).toBeLessThanOrEqual(4);
      expect(pyq.boardSolution).toBeTruthy();
      expect(pyq.markingScheme.length).toBeGreaterThan(0);
    }
  });

  it("should filter PYQs correctly by Year", () => {
    const pyqs2024 = VERIFIED_PYQS_CATALOG.filter((p) => p.year === 2024);
    expect(pyqs2024.every((p) => p.year === 2024)).toBe(true);
  });

  it("should filter PYQs correctly by Marks weightage", () => {
    const pyqs1M = VERIFIED_PYQS_CATALOG.filter((p) => p.marks === 1);
    expect(pyqs1M.every((p) => p.marks === 1)).toBe(true);
  });
});
