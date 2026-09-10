import { describe, it, expect } from "vitest";
import { SafeFormulaEvaluator } from "@/lib/formula-lab/safe-evaluator";

describe("Safe Formula Evaluator — AST & Mathematical Whitelist Engine", () => {
  it("should evaluate Torque equation τ = r * F * sin(θ_rad) safely without eval()", () => {
    const expr = "r * F * sin(theta * pi / 180)";
    const res = SafeFormulaEvaluator.evaluate(expr, { r: 1.5, F: 10, theta: 90 });
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(15.0, 4);
  });

  it("should evaluate Pendulum Period T = 2 * pi * sqrt(L / g)", () => {
    const expr = "2 * pi * sqrt(L / g)";
    const res = SafeFormulaEvaluator.evaluate(expr, { L: 1.0, g: 9.8 });
    expect(res.isValid).toBe(true);
    expect(res.value).toBeCloseTo(2.007, 2);
  });

  it("should detect division by zero and return explicit error", () => {
    const expr = "(m * (v ^ 2)) / r";
    const res = SafeFormulaEvaluator.evaluate(expr, { m: 2, v: 5, r: 0 });
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Division by zero");
  });

  it("should detect negative square root arguments and return explicit domain error", () => {
    const expr = "sqrt(x)";
    const res = SafeFormulaEvaluator.evaluate(expr, { x: -4 });
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("square root of a negative value");
  });

  it("should reject malicious identifiers or code injection attempts", () => {
    const disallowedExpr = "unauthorized_func(x) + 1";
    const res1 = SafeFormulaEvaluator.evaluate(disallowedExpr, { x: 5 });
    expect(res1.isValid).toBe(false);
    expect(res1.error).toContain("Undefined variable or disallowed identifier");

    const punctuationInjection = "process.exit() + 1";
    const res2 = SafeFormulaEvaluator.evaluate(punctuationInjection, {});
    expect(res2.isValid).toBe(false);
    expect(res2.error).toBeTruthy();
  });

  it("should enforce variable domain bounds", () => {
    const expr = "r * F";
    const res = SafeFormulaEvaluator.evaluate(
      expr,
      { r: 15, F: 10 },
      { r: { min: 0.1, max: 10 } }
    );
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("above maximum bound");
  });
});
