"use client";

import React, { useState } from "react";
import { NumericalBlock as NumericalBlockType } from "@/content/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle2, ChevronRight, HelpCircle, RotateCcw } from "lucide-react";

interface NumericalBlockProps {
  block: NumericalBlockType;
  onComplete?: () => void;
}

export function NumericalBlock({ block, onComplete }: NumericalBlockProps) {
  const [activeMode, setActiveMode] = useState<'guided' | 'semi-guided' | 'exam'>(block.mode || 'guided');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleNextStep = () => {
    if (currentStepIndex < block.solutionSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleExamSubmit = () => {
    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    const target = block.finalAnswer.value;
    const tolerance = block.finalAnswer.tolerance || 0.05;
    const diff = Math.abs(val - target);
    const correct = diff <= Math.abs(target * tolerance);

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct && onComplete) onComplete();
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="sky" className="gap-1">
            <Calculator className="h-3.5 w-3.5" />
            <span>Numerical Challenge</span>
          </Badge>
          <div className="flex items-center gap-1 bg-background p-1 rounded-xl border text-xs">
            <button
              onClick={() => setActiveMode("guided")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeMode === "guided" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Guided
            </button>
            <button
              onClick={() => setActiveMode("semi-guided")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeMode === "semi-guided" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Semi-Guided
            </button>
            <button
              onClick={() => setActiveMode("exam")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeMode === "exam" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Stage 3 Exam
            </button>
          </div>
        </div>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2 leading-snug">
          {block.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Given values & To Find */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-secondary/50 border border-border text-xs">
          <div>
            <span className="font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              Given Values:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(block.given).map(([key, item]) => (
                <Badge key={key} variant="outline">
                  {item.symbol} = {item.value} {item.unit}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              To Find:
            </span>
            <span className="font-semibold text-foreground">{block.toFind.join(", ")}</span>
          </div>
        </div>

        {/* GUIDED MODE */}
        {activeMode === "guided" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Step {currentStepIndex + 1} of {block.solutionSteps.length}: {block.solutionSteps[currentStepIndex].title}
              </span>
              <p className="text-sm font-medium text-foreground">
                {block.solutionSteps[currentStepIndex].description}
              </p>
              <div className="p-2.5 rounded-lg bg-card border font-mono text-sm text-center text-foreground">
                {block.solutionSteps[currentStepIndex].latex}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Follow step-by-step notebook calculations
              </span>
              {currentStepIndex < block.solutionSteps.length - 1 ? (
                <Button onClick={handleNextStep} variant="default" size="sm" className="gap-1.5 rounded-xl">
                  <span>Next Step</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Badge variant="success" className="gap-1 py-1 px-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Solution Complete</span>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* EXAM MODE */}
        {activeMode === "exam" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground block">
                Calculate in your notebook and enter final value ({block.finalAnswer.unit}):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="any"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={`Final answer in ${block.finalAnswer.unit}`}
                  className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary outline-none flex-1"
                />
                <Button onClick={handleExamSubmit} variant="default" size="md" className="rounded-xl">
                  Submit Answer
                </Button>
              </div>
            </div>

            {isSubmitted && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
              >
                {isCorrect ? (
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Correct Final Answer! ({block.finalAnswer.value} {block.finalAnswer.unit})</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold block mb-1">Incorrect Final Value</span>
                    <span>Expected: {block.finalAnswer.value} {block.finalAnswer.unit}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
