export type ContentStatus = 'draft' | 'review' | 'approved' | 'published';

export interface ContentPackageMetadata {
  chapterId: string;
  chapterNumber: number;
  version: string; // e.g. v1.0.0
  status: ContentStatus;
  authorEmail: string;
  humanVerified: boolean;
  lastUpdated: string;
}

export interface ContentValidationError {
  blockId: string;
  field: string;
  message: string;
}
