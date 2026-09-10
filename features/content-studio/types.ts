export type ContentLifecycleStatus =
  | "DRAFT"
  | "VALIDATION"
  | "HUMAN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

export interface ContentReviewRecord {
  id: string;
  packageId: string;
  version: string;
  status: ContentLifecycleStatus;
  humanVerified: boolean;
  reviewerId: string;
  reviewerEmail: string;
  reviewerRole: "admin" | "content_manager" | "physics_expert";
  reviewedAt: string;
  changeReason: string;
  checksum: string;
}

export interface ContentPackageMetadata {
  chapterId: string;
  chapterNumber: number;
  version: string; // e.g. v1.0.0
  status: ContentLifecycleStatus;
  authorEmail: string;
  humanVerified: boolean;
  lastUpdated: string;
  reviewHistory: ContentReviewRecord[];
}

export interface ContentValidationError {
  blockId: string;
  field: string;
  message: string;
}
