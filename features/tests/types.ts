export type TestType =
  | 'chapter_test'
  | 'multi_chapter_test'
  | 'full_syllabus_test'
  | 'custom_test'
  | 'adaptive_test';

export type QuestionSection = 'Section A (MCQs)' | 'Section B (2M)' | 'Section C (3M)' | 'Section D (4M)';

export interface TestQuestionItem {
  id: string;
  section: QuestionSection;
  marks: number;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  expectedAnswer: string;
  markingScheme: { point: string; marks: number }[];
  topicId: string;
  chapterNumber: number;
}

export interface TestConfig {
  id: string;
  title: string;
  testType: TestType;
  durationMinutes: number;
  totalMarks: number;
  chapterNumbers: number[];
  questions: TestQuestionItem[];
}

export interface TestAttemptState {
  status: 'not_started' | 'in_progress' | 'submitted' | 'review';
  currentQuestionIndex: number;
  answers: Record<string, { selectedOptionIndex?: number; textAnswer?: string }>;
  flaggedQuestionIds: string[];
  timeRemainingSeconds: number;
  startedAt?: string;
  submittedAt?: string;
  score?: {
    totalMarksEarned: number;
    maxMarks: number;
    accuracyPercent: number;
    sectionBreakdown: Record<string, { earned: number; max: number }>;
  };
}
