"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { FormulaLabConfig } from "@/features/formula-lab/types";
import { SafeFormulaEvaluator } from "@/lib/formula-lab/safe-evaluator";
import { drawTorqueDiagram, drawCentripetalDiagram } from "@/lib/graphics/canvas-helpers";
import { CanvasGraph } from "@/components/simulations/CanvasGraph";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, RotateCcw, Activity, AlertTriangle } from "lucide-react";

interface FormulaLabProps {
  config: FormulaLabConfig;
}

export function FormulaLab({ config }: FormulaLabProps) {
  // Initialize slider state map from config defaultValues
  const initialValues = useMemo(
    () =>
      config.variables.reduce((acc, v) => {
        acc[v.id] = v.defaultValue;
        return acc;
      }, {} as Record<string, number>),
    [config.variables]
  );

  const [variables, setVariables] = useState<Record<string, number>>(initialValues);
  const [graphHistory, setGraphHistory] = useState<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Variable domains for safe evaluation
  const domains = useMemo(() => {
    return config.variables.reduce((acc, v) => {
      acc[v.id] = { min: v.min, max: v.max };
      return acc;
    }, {} as Record<string, { min: number; max: number }>);
  }, [config.variables]);

  // Safe evaluation calculation: prioritize expression through SafeFormulaEvaluator, fallback to calculateFn
  const evalResult = useMemo(() => {
    if (config.expression) {
      return SafeFormulaEvaluator.evaluate(config.expression, variables, domains);
    }
    try {
      const val = config.calculateFn(variables);
      return { value: val, isValid: true };
    } catch (e: any) {
      return { value: 0, isValid: false, error: e.message || "Calculation failed" };
    }
  }, [config, variables, domains]);

  const outputValue = evalResult.value;

  // Draw 2D canvas visualizer whenever variables update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (config.visualizerType === "torque") {
      drawTorqueDiagram(
        ctx,
        canvas.width,
        canvas.height,
        variables.r || 1,
        variables.F || 10,
        variables.theta || 90
      );
    } else if (config.visualizerType === "centripetal") {
      drawCentripetalDiagram(
        ctx,
        canvas.width,
        canvas.height,
        variables.m || 2,
        variables.v || 5,
        variables.r || 1.5
      );
    }

    if (evalResult.isValid) {
      setGraphHistory((prev) => [
        ...prev.slice(-30),
        { x: variables[config.variables[0]?.id] || 0, y: Number(outputValue.toFixed(2)) },
      ]);
    }
  }, [variables, config, outputValue, evalResult.isValid]);

  const handleSliderChange = (varId: string, value: number) => {
    setVariables((prev) => ({ ...prev, [varId]: value }));
  };

  const handleReset = () => {
    setVariables(initialValues);
    setGraphHistory([]);
  };

  return (
    <Card className="border-physics-accent/30 bg-card shadow-md rounded-2xl my-8 overflow-hidden">
      <CardHeader className="bg-physics-accent/10 border-b border-physics-accent/20 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="sky" className="gap-1">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Interactive Formula Lab</span>
            </Badge>
            <Badge variant="outline" className="text-[10px]">Deterministic Evaluator</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs rounded-xl">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </div>

        <CardTitle className="text-lg font-bold text-foreground mt-2">
          {config.title} — <span className="font-mono text-primary">{config.equationLatex}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sliders & Numerical Calculation Output */}
          <div className="space-y-5">
            {/* Live Calculation Result Banner or Domain Error */}
            {evalResult.isValid ? (
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Calculated {config.targetVariableSymbol}
                </span>
                <span className="text-3xl font-extrabold text-primary">
                  {outputValue.toFixed(2)} <span className="text-base font-semibold">{config.targetVariableUnit}</span>
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-center text-destructive flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">{evalResult.error}</span>
              </div>
            )}

            {/* Parameter Sliders */}
            <div className="space-y-4">
              {config.variables.map((v) => {
                const val = variables[v.id] ?? v.defaultValue;
                return (
                  <div key={v.id} className="space-y-1.5 p-3 rounded-xl bg-secondary/40 border border-border">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-foreground">
                        {v.name} ({v.symbol})
                      </span>
                      <span className="font-mono text-primary font-bold">
                        {val} {v.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={val}
                      onChange={(e) => handleSliderChange(v.id, parseFloat(e.target.value))}
                      className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{v.min} {v.unit}</span>
                      <span>{v.max} {v.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2D Canvas Diagram Visualizer & Graph */}
          <div className="space-y-4 flex flex-col items-center justify-between">
            <div className="w-full bg-secondary/30 rounded-2xl border border-border p-3 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Activity className="h-3 w-3 text-sky-500" />
                <span>2D Vector Visualizer</span>
              </span>
              <canvas
                ref={canvasRef}
                width={360}
                height={160}
                className="w-full max-w-full h-auto rounded-xl border bg-background"
              />
            </div>

            {/* Real-time Line Graph */}
            <div className="w-full flex justify-center">
              <CanvasGraph
                dataPoints={graphHistory}
                xLabel={config.variables[0]?.symbol || "X"}
                yLabel={config.targetVariableSymbol}
                width={360}
                height={140}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
