/**
 * Complete Maharashtra State Board Curriculum Content Hierarchy
 *
 * Board
 * → Class
 * → Stream
 * → Exam
 * → Subject
 * → Chapter
 * → Topic
 * → Lesson
 * → Lesson Blocks
 */

import { LessonBlock } from "./course";

export type BoardName = "Maharashtra State Board of Secondary and Higher Secondary Education";
export type ClassGrade = "Class 12" | "Class 11";
export type AcademicStream = "Science";
export type ExamTarget = "HSC Board Examination" | "MHT-CET" | "NEET" | "JEE Main";
export type SubjectName = "Physics";

export interface CurriculumScope {
  board: BoardName;
  classGrade: ClassGrade;
  stream: AcademicStream;
  exam: ExamTarget;
  subject: SubjectName;
  academicYear: "2024-2025" | "2025-2026";
}

export const OFFICIAL_CURRICULUM_SCOPE: CurriculumScope = {
  board: "Maharashtra State Board of Secondary and Higher Secondary Education",
  classGrade: "Class 12",
  stream: "Science",
  exam: "HSC Board Examination",
  subject: "Physics",
  academicYear: "2025-2026",
};

export interface AuthoritativeLesson {
  id: string;
  topicId: string;
  chapterId: string;
  lessonNumber: number;
  title: string;
  learningObjectives: string[];
  textbookPageReference?: {
    startPage: number;
    endPage: number;
  };
  blocks: LessonBlock[];
  status: "DRAFT" | "CONTENT_REQUIRED" | "VERIFIED" | "PUBLISHED";
}

export interface AuthoritativeTopic {
  id: string;
  chapterId: string;
  sequenceOrder: number;
  title: string;
  lessons: AuthoritativeLesson[];
}

export interface AuthoritativeChapter {
  id: string;
  chapterNumber: number;
  title: string;
  weightageMarks: number;
  scope: CurriculumScope;
  topics: AuthoritativeTopic[];
}
