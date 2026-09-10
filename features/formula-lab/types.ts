export interface FormulaLabVariableConfig {
  id: string;
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export type VisualizerType = 'torque' | 'centripetal' | 'fluid_pressure' | 'pendulum';

export interface FormulaLabConfig {
  id: string;
  title: string;
  equationLatex: string;
  targetVariableSymbol: string;
  targetVariableUnit: string;
  variables: FormulaLabVariableConfig[];
  visualizerType: VisualizerType;
  /** Safe mathematical expression string evaluated via SafeFormulaEvaluator without eval() */
  expression?: string;
  calculateFn: (variables: Record<string, number>) => number;
}
