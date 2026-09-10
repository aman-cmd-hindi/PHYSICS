export type BlockType =
  | "theory"
  | "definition"
  | "concept"
  | "equation"
  | "derivation"
  | "example"
  | "visual"
  | "formula_lab"
  | "mcq"
  | "conceptual"
  | "numerical"
  | "pyq"
  | "simulation"
  | "summary"
  | "mastery_gate"
  | "text"
  | "prediction"
  | "board_style";

export interface ContentProvenance {
  source: string; // e.g., "Maharashtra State Board Class 12 Physics Textbook"
  sourceType: "textbook" | "board_exam_paper" | "official_syllabus" | "lab_manual";
  sourceReference: string; // e.g., "Chapter 1, Section 1.2, pp. 2-5"
  chapterId: string;
  topicId: string;
  contentVersion: string; // e.g., "v1.0.0"
  verified: boolean;
  verifiedBy?: string; // e.g., "Dr. R. K. Patil (Board Physics Committee)"
  verifiedAt?: string;
  status: "VERIFIED" | "SOURCE_REQUIRED" | "CONTENT_REQUIRED";
}

export interface BaseBlock {
  id: string; // Stable ID
  type: BlockType;
  title?: string;
  order: number;
  provenance?: ContentProvenance;
}

export interface TheoryBlock extends BaseBlock {
  type: "theory" | "text";
  content: string; // Markdown / KaTeX text
}

export interface ConceptBlock extends BaseBlock {
  type: "concept";
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface EquationBlock extends BaseBlock {
  type: "equation";
  latex: string;
  variables: { symbol: string; name: string; unit: string }[];
  explanation?: string;
}

export interface DerivationBlock extends BaseBlock {
  type: "derivation";
  title: string;
  targetFormulaLatex: string;
  steps: {
    stepNumber: number;
    statement: string;
    latex?: string;
    rationale?: string;
  }[];
  finalStatement?: string;
}

export interface ExampleBlock extends BaseBlock {
  type: "example";
  title: string;
  problemStatement: string;
  givenData: Record<string, string>;
  solutionSteps: string[];
  finalAnswer: string;
}

export interface VisualBlock extends BaseBlock {
  type: "visual";
  title: string;
  caption: string;
  diagramType: "vector_diagram" | "circuit" | "schematic" | "graph";
  spec: Record<string, any>;
}

export interface SimulationBlock extends BaseBlock {
  type: "simulation";
  title: string;
  simulationType: "torque" | "centripetal" | "pendulum" | "fluids";
  parameters: Record<string, any>;
}

export interface SummaryBlock extends BaseBlock {
  type: "summary";
  keyTakeaways: string[];
  quickFormulas: { name: string; latex: string }[];
}

export interface DefinitionBlock extends BaseBlock {
  type: "definition";
  term: string;
  statement: string;
  unit?: string;
  symbol?: string;
}

export interface MCQQuestionBlock extends BaseBlock {
  type: "mcq";
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
  type: "conceptual";
  question: string;
  hint: string;
  modelAnswer: string;
  selfCheckPoints: string[];
  explanation: string;
}

export interface PredictionQuestionBlock extends BaseBlock {
  type: "prediction";
  setup: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  outcomeExplanation: string;
  physicalPrinciple: string;
}

export interface BoardStyleQuestionBlock extends BaseBlock {
  type: "board_style";
  marks: number;
  year?: number;
  question: string;
  modelAnswer: string;
  markingScheme: { point: string; marks: number }[];
  keyKeywords: string[];
}

export interface NumericalBlock extends BaseBlock {
  type: "numerical";
  question: string;
  mode: "guided" | "semi-guided" | "exam";
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
  type: "pyq";
  year: number;
  marks: number;
  question: string;
  modelAnswer: string;
  markingScheme: { point: string; marks: number }[];
}

export interface FormulaLabBlock extends BaseBlock {
  type: "formula_lab";
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
  calculateFnBody?: string;
}

export interface MasteryGateBlock extends BaseBlock {
  type: "mastery_gate";
  minMcqAccuracyPercent: number;
  minNumericalsCompleted: number;
}

export type LessonBlock =
  | TheoryBlock
  | ConceptBlock
  | EquationBlock
  | DerivationBlock
  | ExampleBlock
  | VisualBlock
  | SimulationBlock
  | SummaryBlock
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
  provenance?: ContentProvenance;
}

export interface ChapterPackage {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  weightageMarks: number;
  topics: TopicPackage[];
  provenance?: ContentProvenance;
}
