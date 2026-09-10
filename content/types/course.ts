export type BlockType =
  | 'text'
  | 'equation'
  | 'definition'
  | 'image'
  | 'animation'
  | 'simulation'
  | 'formula_lab'
  | 'example'
  | 'prediction'
  | 'mcq'
  | 'numerical'
  | 'pyq'
  | 'important_board_point'
  | 'recap';

export interface BaseBlock {
  id: string; // Stable ID
  type: BlockType;
  title?: string;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Markdown / KaTeX text
}

export interface EquationBlock extends BaseBlock {
  type: 'equation';
  latex: string;
  variables: { symbol: string; name: string; unit: string }[];
  explanation?: string;
}

export interface DefinitionBlock extends BaseBlock {
  type: 'definition';
  term: string;
  statement: string;
  unit?: string;
  symbol?: string;
}

export interface MCQQuestionBlock extends BaseBlock {
  type: 'mcq';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  hint?: string;
}

export interface NumericalBlock extends BaseBlock {
  type: 'numerical';
  question: string;
  given: Record<string, { value: number; unit: string; symbol: string }>;
  toFind: string[];
  formulaIds: string[];
  solutionSteps: {
    stepIndex: number;
    title: string;
    description: string;
    latex: string;
    answerValue: number;
    unit: string;
  }[];
  finalAnswer: { value: number; unit: string; tolerance?: number };
}

export interface PYQBlock extends BaseBlock {
  type: 'pyq';
  year: number;
  marks: number;
  question: string;
  modelAnswer: string;
  markingScheme: { point: string; marks: number }[];
}

export interface FormulaLabBlock extends BaseBlock {
  type: 'formula_lab';
  formulaTitle: string;
  equationLatex: string;
  targetVariable: string;
  variables: {
    id: string;
    name: string;
    symbol: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
  }[];
  calculateFnBody: string; // Math function body string
}

export type LessonBlock =
  | TextBlock
  | EquationBlock
  | DefinitionBlock
  | MCQQuestionBlock
  | NumericalBlock
  | PYQBlock
  | FormulaLabBlock;

export interface TopicPackage {
  id: string; // Stable ID (e.g. topic_rotational_dynamics_01)
  chapterId: string;
  title: string;
  sequenceOrder: number;
  learningObjectives: string[];
  textbookPageReference?: { startPage: number; endPage: number };
  blocks: LessonBlock[];
  masteryCriteria: {
    minMcqAccuracyPercent: number;
    minNumericalsCompleted: number;
  };
}

export interface ChapterPackage {
  id: string; // Stable ID (e.g. ch_01_rotational_dynamics)
  chapterNumber: number;
  title: string;
  description: string;
  weightageMarks: number;
  topics: TopicPackage[];
}
