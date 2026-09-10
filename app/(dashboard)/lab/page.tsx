"use client";

import React, { useState } from "react";
import { FormulaLab } from "@/components/formula/FormulaLab";
import { FormulaLabConfig } from "@/features/formula-lab/types";
import { FlaskConical, Sliders, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabPage() {
  const [activeLabId, setActiveLabId] = useState<"torque" | "centripetal">("torque");

  // Torque Lab Config: τ = r * F * sin(θ)
  const torqueLabConfig: FormulaLabConfig = {
    id: "lab_torque",
    title: "Torque (Moment of Force) Lab",
    equationLatex: "\\tau = r \\cdot F \\cdot \\sin\\theta",
    targetVariableSymbol: "\\tau",
    targetVariableUnit: "N·m",
    visualizerType: "torque",
    variables: [
      { id: "r", name: "Arm Length", symbol: "r", min: 0.2, max: 5.0, step: 0.1, defaultValue: 2.0, unit: "m" },
      { id: "F", name: "Applied Force", symbol: "F", min: 1, max: 50, step: 1, defaultValue: 20, unit: "N" },
      { id: "theta", name: "Angle of Force", symbol: "θ", min: 0, max: 180, step: 5, defaultValue: 90, unit: "°" },
    ],
    calculateFn: (vars) => {
      const r = vars.r || 0;
      const F = vars.F || 0;
      const thetaRad = ((vars.theta || 0) * Math.PI) / 180;
      return r * F * Math.sin(thetaRad);
    },
  };

  // Centripetal Force Lab Config: Fc = (m * v^2) / r
  const centripetalLabConfig: FormulaLabConfig = {
    id: "lab_centripetal",
    title: "Centripetal Force Lab",
    equationLatex: "F_c = \\frac{m \\cdot v^2}{r}",
    targetVariableSymbol: "F_c",
    targetVariableUnit: "N",
    visualizerType: "centripetal",
    variables: [
      { id: "m", name: "Mass of Object", symbol: "m", min: 0.5, max: 10, step: 0.5, defaultValue: 2.0, unit: "kg" },
      { id: "v", name: "Linear Velocity", symbol: "v", min: 1, max: 20, step: 1, defaultValue: 5.0, unit: "m/s" },
      { id: "r", name: "Orbit Radius", symbol: "r", min: 0.5, max: 5, step: 0.2, defaultValue: 1.5, unit: "m" },
    ],
    calculateFn: (vars) => {
      const m = vars.m || 0;
      const v = vars.v || 0;
      const r = vars.r || 1;
      return (m * Math.pow(v, 2)) / r;
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-physics-accent flex items-center gap-2">
          <FlaskConical className="h-6 w-6" />
          <span>Physics Lab</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive Formula Labs with parameter sweeps, 2D vector diagrams, and real-time graph plotting.
        </p>
      </div>

      {/* Lab Switcher Buttons */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeLabId === "torque" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveLabId("torque")}
          className="rounded-xl"
        >
          Torque Lab (τ = r F sinθ)
        </Button>
        <Button
          variant={activeLabId === "centripetal" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveLabId("centripetal")}
          className="rounded-xl"
        >
          Centripetal Force Lab (Fc = mv²/r)
        </Button>
      </div>

      {/* ACTIVE FORMULA LAB RENDERER */}
      {activeLabId === "torque" && <FormulaLab config={torqueLabConfig} />}
      {activeLabId === "centripetal" && <FormulaLab config={centripetalLabConfig} />}
    </div>
  );
}
