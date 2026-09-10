export type AttemptStatus = 'unattempted' | 'wrong_1' | 'wrong_2_plus' | 'correct';

export interface QuestionAttemptState {
  questionId: string;
  selectedIndex: number | null;
  status: AttemptStatus;
  attemptCount: number;
  isCompleted: boolean;
  history: { selectedIndex: number; isCorrect: boolean; timestamp: string }[];
}
