"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertTriangle, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

export interface NumericalMCQConfig {
  id: string;
  question: string;
  options: { label: string; value: number; unit: string; isTrap?: boolean; trapExplanation?: string }[];
  correctOptionIndex: number;
  formulaLatex: string;
  explanation: string;
  hint: string;
}

export function NumericalMCQBlock({ config }: { config: NumericalMCQConfig }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedIndex !== null) setSubmitted(true);
  };

  const selectedOpt = selectedIndex !== null ? config.options[selectedIndex] : null;
  const isCorrect = selectedIndex === config.correctOptionIndex;

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="warning" className="gap-1">
            <Calculator className="h-3.5 w-3.5" />
            <span>Numerical MCQ Challenge</span>
          </Badge>
          <Badge variant="outline" className="font-mono">{config.formulaLatex}</Badge>
        </div>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2 leading-snug">
          {config.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2.5">
          {config.options.map((opt, idx) => {
            const isSel = selectedIndex === idx;
            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                  submitted && idx === config.correctOptionIndex
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                    : submitted && isSel && !isCorrect
                    ? "border-destructive bg-destructive/10 text-destructive font-bold"
                    : isSel
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border bg-card hover:bg-secondary/50 text-foreground"
                }`}
              >
                <span>
                  {String.fromCharCode(65 + idx)}. {opt.label}
                </span>
                {submitted && idx === config.correctOptionIndex && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                )}
                {submitted && isSel && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <Button disabled={selectedIndex === null} onClick={handleSubmit} size="sm" className="rounded-xl">
            Submit Calculation
          </Button>
        ) : (
          <div className="space-y-3 animate-fadeIn">
            {isCorrect ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Correct Calculation!</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Common Calculation Trap Detected</span>
                </div>
                {selectedOpt?.isTrap && (
                  <p className="mt-1 font-medium">{selectedOpt.trapExplanation}</p>
                )}
              </div>
            )}

            <div className="p-4 rounded-xl bg-secondary border border-border text-xs space-y-1">
              <span className="font-bold text-primary block">Stepwise Explanation:</span>
              <p className="text-muted-foreground leading-relaxed">{config.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
