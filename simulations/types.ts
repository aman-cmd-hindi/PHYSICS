export interface SimulationVariable {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface SimulationConfig {
  id: string;
  title: string;
  description: string;
  variables: SimulationVariable[];
  presetLabels?: string[];
  canvasDimensions: { width: number; height: number };
}

export interface SimulationState {
  isRunning: boolean;
  time: number;
  variables: Record<string, number>;
}

export interface SimulationEngineAdapter {
  id: string;
  config: SimulationConfig;
  init: (canvas: HTMLCanvasElement, state: SimulationState) => void;
  update: (dt: number, state: SimulationState) => void;
  render: (canvas: HTMLCanvasElement, state: SimulationState) => void;
  reset: () => void;
}
