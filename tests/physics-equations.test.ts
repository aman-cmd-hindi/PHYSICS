import { describe, it, expect } from "vitest";

describe("Physics Equation Validation — Maharashtra Board Class 12", () => {
  it("should correctly calculate Torque τ = r * F * sin(θ)", () => {
    const calculateTorque = (r: number, F: number, thetaDeg: number) => {
      const rad = (thetaDeg * Math.PI) / 180;
      return r * F * Math.sin(rad);
    };

    // When θ = 90 deg, sin(90) = 1, τ = r * F
    expect(calculateTorque(2.0, 20.0, 90)).toBeCloseTo(40.0, 5);

    // When θ = 0 deg, sin(0) = 0, τ = 0
    expect(calculateTorque(2.0, 20.0, 0)).toBeCloseTo(0.0, 5);

    // When θ = 30 deg, sin(30) = 0.5, τ = 2 * 20 * 0.5 = 20
    expect(calculateTorque(2.0, 20.0, 30)).toBeCloseTo(20.0, 5);
  });

  it("should correctly calculate Centripetal Force Fc = (m * v^2) / r", () => {
    const calculateFc = (m: number, v: number, r: number) => {
      return (m * Math.pow(v, 2)) / r;
    };

    // m = 2 kg, v = 5 m/s, r = 2 m -> Fc = (2 * 25) / 2 = 25 N
    expect(calculateFc(2.0, 5.0, 2.0)).toBe(25.0);
  });

  it("should correctly calculate Disc Moment of Inertia I = 0.5 * M * R^2", () => {
    const calculateDiscMOI = (M: number, R: number) => {
      return 0.5 * M * Math.pow(R, 2);
    };

    // M = 4 kg, R = 3 m -> I = 0.5 * 4 * 9 = 18 kg·m²
    expect(calculateDiscMOI(4.0, 3.0)).toBe(18.0);
  });

  it("should correctly calculate Hydrostatic Gauge Pressure P = h * ρ * g", () => {
    const calculatePressure = (h: number, rho: number, g = 9.8) => {
      return h * rho * g;
    };

    // h = 10 m, rho = 1000 kg/m³, g = 9.8 m/s² -> P = 98000 Pa
    expect(calculatePressure(10, 1000, 9.8)).toBe(98000);
  });

  it("should correctly calculate Simple Pendulum Period T = 2π * sqrt(L / g)", () => {
    const calculatePendulumPeriod = (L: number, g = 9.8) => {
      return 2 * Math.PI * Math.sqrt(L / g);
    };

    // L = 1 m, g = 9.8 -> T ≈ 2.007 s
    expect(calculatePendulumPeriod(1.0, 9.8)).toBeCloseTo(2.007, 2);
  });
});
