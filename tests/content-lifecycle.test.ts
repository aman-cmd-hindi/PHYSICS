import { describe, it, expect } from "vitest";
import { ContentLifecycleService } from "@/features/content-studio/lifecycle-service";
import { ContentPackageMetadata } from "@/features/content-studio/types";

describe("Content Studio Lifecycle & Human Verification Audit", () => {
  const initialPkg: ContentPackageMetadata = {
    chapterId: "ch_01_rotational_dynamics",
    chapterNumber: 1,
    version: "v1.0.0",
    status: "DRAFT",
    authorEmail: "author@boardphysics.internal",
    humanVerified: false,
    lastUpdated: new Date().toISOString(),
    reviewHistory: [],
  };

  it("should transition from DRAFT to VALIDATION cleanly", () => {
    const res = ContentLifecycleService.transitionLifecycle(initialPkg, "VALIDATION", []);
    expect(res.success).toBe(true);
    expect(res.updatedPackage?.status).toBe("VALIDATION");
  });

  it("should reject transitions that skip lifecycle stages (e.g. DRAFT to PUBLISHED)", () => {
    const res = ContentLifecycleService.transitionLifecycle(initialPkg, "PUBLISHED", []);
    expect(res.success).toBe(false);
    expect(res.error).toContain("Invalid transition");
  });

  it("should require mandatory human review details to transition to APPROVED or PUBLISHED", () => {
    const reviewPkg: ContentPackageMetadata = {
      ...initialPkg,
      status: "HUMAN_REVIEW",
    };

    // Attempt approve without review details
    const resWithoutDetails = ContentLifecycleService.transitionLifecycle(
      reviewPkg,
      "APPROVED",
      []
    );
    expect(resWithoutDetails.success).toBe(false);
    expect(resWithoutDetails.error).toContain("Mandatory human review record");

    // Approve with human reviewer details
    const resWithDetails = ContentLifecycleService.transitionLifecycle(
      reviewPkg,
      "APPROVED",
      [],
      {
        reviewerId: "usr_prof_patil",
        reviewerEmail: "patil@hscboard.ac.in",
        reviewerRole: "physics_expert",
        changeReason: "Verified with Maharashtra State Board 2024 syllabus p. 1-25",
      }
    );

    expect(resWithDetails.success).toBe(true);
    expect(resWithDetails.updatedPackage?.status).toBe("APPROVED");
    expect(resWithDetails.updatedPackage?.humanVerified).toBe(true);
    expect(resWithDetails.updatedPackage?.reviewHistory.length).toBe(1);
    expect(resWithDetails.updatedPackage?.reviewHistory[0].reviewerEmail).toBe("patil@hscboard.ac.in");
  });
});
