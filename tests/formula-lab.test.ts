import { describe, it, expect } from "vitest";
import { FormulaLabConfig } from "@/features/formula-lab/types";

describe("Formula Lab Engine Configuration & Calculation Tests", () => {
  const torqueLab: FormulaLabConfig = {
    id: "lab_torque_test",
    title: "Torque Test Lab",
    equationLatex: "\\tau = r \\cdot F \\cdot \\sin\\theta",
    targetVariableSymbol: "\\tau",
    targetVariableUnit: "N·m",
    visualizerType: "torque",
    variables: [
      { id: "r", name: "Arm Length", symbol: "r", min: 0.1, max: 10, step: 0.1, defaultValue: 1.5, unit: "m" },
      { id: "F", name: "Force", symbol: "F", min: 1, max: 100, step: 1, defaultValue: 10, unit: "N" },
      { id: "theta", name: "Angle", symbol: "θ", min: 0, max: 180, step: 1, defaultValue: 90, unit: "°" },
    ],
    calculateFn: (vars) => {
      const r = vars.r || 0;
      const F = vars.F || 0;
      const rad = ((vars.theta || 0) * Math.PI) / 180;
      return r * F * Math.sin(rad);
    },
  };

  it("should calculate correct default output", () => {
    const result = torqueLab.calculateFn({ r: 1.5, F: 10, theta: 90 });
    expect(result).toBe(15.0);
  });

  it("should dynamically recalculate when parameters vary", () => {
    const result1 = torqueLab.calculateFn({ r: 2.0, F: 25, theta: 90 });
    expect(result1).toBe(50.0);

    const result2 = torqueLab.calculateFn({ r: 2.0, F: 25, theta: 30 });
    expect(result2).toBeCloseTo(25.0, 4);
  });
});
