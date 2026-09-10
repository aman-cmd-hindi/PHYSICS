export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
}

export interface FormulaModel {
  id: string;
  title: string;
  latex: string;
  chapterId: string;
  chapterNumber: number;
  topicId: string;
  variables: FormulaVariable[];
  physicalMeaning: string;
  isImportantBoard: boolean;
  derivationSteps?: string[];
}
