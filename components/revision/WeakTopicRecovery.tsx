"use client";

import React, { useState } from "react";
import { WeakTopicItem } from "@/features/revision/revision-engine";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Calculator,
} from "lucide-react";

interface WeakTopicRecoveryProps {
  item: WeakTopicItem;
  onComplete: () => void;
}

export function WeakTopicRecovery({ item, onComplete }: WeakTopicRecoveryProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { step: 1, title: "Weakness Detected", desc: item.weakConcept },
    { step: 2, title: "Exact Weak Concept", desc: `Focus Area: ${item.topicTitle}` },
    { step: 3, title: "Re-explanation", desc: "Review fundamental laws, vector signs, and unit definitions." },
    { step: 4, title: "Visual Inspection", desc: "Inspect 2D diagram/graph representation of the concept." },
    { step: 5, title: "Practice MCQs", desc: "Solve 3 targeted MCQs to reinforce theoretical comprehension." },
    { step: 6, title: "Guided & Exam Numerical", desc: "Execute step-by-step notebook calculation and verify final value." },
    { step: 7, title: "Retest & Mastery", desc: "Re-evaluate topic mastery score to unlock completion status." },
  ];

  return (
    <Card className="border-amber-500/30 bg-card shadow-md rounded-2xl my-6">
      <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="warning" className="gap-1">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Deterministic Recovery Flow</span>
          </Badge>
          <Badge variant="outline">Step {currentStep} of 7</Badge>
        </div>
        <CardTitle className="text-lg font-bold text-foreground mt-2">
          Recovery: {item.chapterTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-1 text-xs">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s.step <= currentStep ? "bg-amber-500" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="p-6 rounded-2xl bg-secondary/50 border border-border space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              {currentStep}
            </span>
            <h4 className="font-extrabold text-base text-foreground">
              {steps[currentStep - 1].title}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-9">
            {steps[currentStep - 1].desc}
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => s - 1)}
            variant="outline"
            size="sm"
          >
            Previous Step
          </Button>

          {currentStep < 7 ? (
            <Button onClick={() => setCurrentStep((s) => s + 1)} size="sm" className="gap-2 rounded-xl">
              <span>Next Recovery Step</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onComplete} variant="default" size="sm" className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Complete Recovery Retest</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
