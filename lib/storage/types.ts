export type TopicStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestionAnswerState {
  answer: any;
  isCorrect: boolean;
  attempts: number;
  timestamp: string;
}

export interface NumericalState {
  stepIndex: number;
  mode: 'guided' | 'semi-guided' | 'exam';
  isCompleted: boolean;
  savedValues?: Record<string, any>;
}

export interface TopicProgress {
  topicId: string;
  chapterId: string;
  status: TopicStatus;
  completedBlocks: string[];
  questionAnswers: Record<string, QuestionAnswerState>;
  numericalProgress: Record<string, NumericalState>;
  masteryScore: number;
  lastAccessedAt: string;
}

export interface ResumePosition {
  chapterId: string;
  topicId: string;
  blockId?: string;
  updatedAt: string;
}

export interface ProgressStorageAdapter {
  getTopicProgress(topicId: string): Promise<TopicProgress | null>;
  saveTopicProgress(progress: TopicProgress): Promise<void>;
  getAllProgress(): Promise<Record<string, TopicProgress>>;
  getResumePosition(): Promise<ResumePosition | null>;
  saveResumePosition(pos: ResumePosition): Promise<void>;
  clearProgress(): Promise<void>;
}
