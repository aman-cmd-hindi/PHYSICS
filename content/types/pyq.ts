export type PYQDifficulty = 'easy' | 'medium' | 'hard';
export type PYQMarks = 1 | 2 | 3 | 4;

export interface PYQMarkingPoint {
  point: string;
  marks: number;
}

export interface PYQModel {
  id: string;
  year: number;
  marks: PYQMarks;
  chapterId: string;
  chapterNumber: number;
  topicId: string;
  topicTitle: string;
  difficulty: PYQDifficulty;
  question: string;
  options?: string[]; // For 1-Mark MCQ PYQs
  correctOptionIndex?: number;
  boardSolution: string;
  markingScheme: PYQMarkingPoint[];
  explanation: string;
  relatedConcept: string;
}
