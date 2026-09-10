import {
  ContentLifecycleStatus,
  ContentPackageMetadata,
  ContentReviewRecord,
} from "./types";
import { TopicPackage } from "@/content/types/course";
import { validateTopicPackage } from "./validation";

export class ContentLifecycleService {
  /**
   * Allowed sequential lifecycle transitions:
   * DRAFT -> VALIDATION -> HUMAN_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED
   */
  private static readonly ALLOWED_TRANSITIONS: Record<ContentLifecycleStatus, ContentLifecycleStatus[]> = {
    DRAFT: ["VALIDATION", "ARCHIVED"],
    VALIDATION: ["HUMAN_REVIEW", "DRAFT"],
    HUMAN_REVIEW: ["APPROVED", "DRAFT"],
    APPROVED: ["PUBLISHED", "DRAFT"],
    PUBLISHED: ["ARCHIVED"],
    ARCHIVED: ["DRAFT"],
  };

  /**
   * Validate and transition package to next lifecycle stage
   */
  public static transitionLifecycle(
    pkg: ContentPackageMetadata,
    targetStatus: ContentLifecycleStatus,
    topicPackages: TopicPackage[],
    reviewDetails?: {
      reviewerId: string;
      reviewerEmail: string;
      reviewerRole: ContentReviewRecord["reviewerRole"];
      changeReason: string;
    }
  ): { success: boolean; error?: string; updatedPackage?: ContentPackageMetadata } {
    const allowed = this.ALLOWED_TRANSITIONS[pkg.status];
    if (!allowed || !allowed.includes(targetStatus)) {
      return {
        success: false,
        error: `Invalid transition from ${pkg.status} to ${targetStatus}`,
      };
    }

    // Step 1: Automated Validation Gate
    if (targetStatus === "VALIDATION" || targetStatus === "HUMAN_REVIEW") {
      for (const topic of topicPackages) {
        const errors = validateTopicPackage(topic);
        if (errors.length > 0) {
          return {
            success: false,
            error: `Validation failed for topic ${topic.title}: ${errors[0].message}`,
          };
        }
      }
    }

    // Step 2: Mandatory Human Verification Gate for APPROVED and PUBLISHED
    if (targetStatus === "APPROVED" || targetStatus === "PUBLISHED") {
      if (!reviewDetails) {
        return {
          success: false,
          error: "Mandatory human review record with reviewer credentials and change reason is required to approve or publish content.",
        };
      }

      if (!reviewDetails.changeReason || reviewDetails.changeReason.trim().length < 5) {
        return {
          success: false,
          error: "A valid explanatory change reason is required for human verification.",
        };
      }
    }

    // Record review audit log
    const reviewRecord: ContentReviewRecord = {
      id: `rev_${Date.now()}`,
      packageId: pkg.chapterId,
      version: pkg.version,
      status: targetStatus,
      humanVerified: targetStatus === "APPROVED" || targetStatus === "PUBLISHED",
      reviewerId: reviewDetails?.reviewerId || "system_validator",
      reviewerEmail: reviewDetails?.reviewerEmail || "system@local",
      reviewerRole: reviewDetails?.reviewerRole || "content_manager",
      reviewedAt: new Date().toISOString(),
      changeReason: reviewDetails?.changeReason || `Automated transition to ${targetStatus}`,
      checksum: `chk_${pkg.chapterId}_${targetStatus}_${Date.now()}`,
    };

    const updatedPackage: ContentPackageMetadata = {
      ...pkg,
      status: targetStatus,
      humanVerified: reviewRecord.humanVerified,
      lastUpdated: new Date().toISOString(),
      reviewHistory: [...(pkg.reviewHistory || []), reviewRecord],
    };

    return {
      success: true,
      updatedPackage,
    };
  }
}
