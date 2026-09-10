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
  | 'conceptual'
  | 'numerical'
  | 'pyq'
  | 'board_style'
  | 'important_board_point'
  | 'recap'
  | 'mastery_gate';

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
  hint: string;
  workedExample?: {
    title: string;
    steps: string[];
  };
}

export interface ConceptualQuestionBlock extends BaseBlock {
  type: 'conceptual';
  question: string;
  hint: string;
  modelAnswer: string;
  selfCheckPoints: string[];
  explanation: string;
}

export interface PredictionQuestionBlock extends BaseBlock {
  type: 'prediction';
  setup: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  outcomeExplanation: string;
  physicalPrinciple: string;
}

export interface BoardStyleQuestionBlock extends BaseBlock {
  type: 'board_style';
  marks: number;
  year?: number;
  question: string;
  modelAnswer: string;
  markingScheme: { point: string; marks: number }[];
  keyKeywords: string[];
}

export interface NumericalBlock extends BaseBlock {
  type: 'numerical';
  question: string;
  mode: 'guided' | 'semi-guided' | 'exam';
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
  calculateFnBody: string;
}

export interface MasteryGateBlock extends BaseBlock {
  type: 'mastery_gate';
  minMcqAccuracyPercent: number;
  minNumericalsCompleted: number;
}

export type LessonBlock =
  | TextBlock
  | EquationBlock
  | DefinitionBlock
  | MCQQuestionBlock
  | ConceptualQuestionBlock
  | PredictionQuestionBlock
  | BoardStyleQuestionBlock
  | NumericalBlock
  | PYQBlock
  | FormulaLabBlock
  | MasteryGateBlock;

export interface TopicPackage {
  id: string; // Stable ID
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
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  weightageMarks: number;
  topics: TopicPackage[];
}
