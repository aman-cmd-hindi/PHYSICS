"use client";

import React, { useState } from "react";
import { Target, Zap, AlertTriangle, ArrowRight } from "lucide-react";
import { useProgress } from "@/features/progress/ProgressContext";
import { generateAdaptiveRecommendations } from "@/features/practice/adaptive-engine";
import { MCQBlock } from "@/components/questions/MCQBlock";
import { NumericalBlock } from "@/components/questions/NumericalBlock";
import { MCQQuestionBlock, NumericalBlock as NumericalBlockType } from "@/content/types/course";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<"mcq" | "numerical" | "adaptive">("mcq");
  const { progressMap } = useProgress();
  const adaptiveRecs = generateAdaptiveRecommendations(progressMap);

  // Verified sample questions for practice engine demonstration
  const sampleMCQ: MCQQuestionBlock = {
    id: "prac_mcq_01",
    type: "mcq",
    order: 1,
    question: "A uniform circular disc of mass M and radius R rotates about an axis passing through its center and perpendicular to its plane. What is its moment of inertia?",
    options: [
      "I = MR²",
      "I = (1/2) MR²",
      "I = (2/5) MR²",
      "I = (1/12) MR²",
    ],
    correctOptionIndex: 1,
    hint: "Recall the formula for a flat symmetrical circular disc around its central symmetry axis.",
    explanation: "For a uniform circular disc rotating about a perpendicular axis through its center, the moment of inertia is given by I = 1/2 M R².",
    workedExample: {
      title: "Disc Moment of Inertia",
      steps: [
        "Use element ring of radius r and width dr.",
        "dm = (M / π R²) * 2π r dr = (2M/R²) r dr",
        "dI = dm * r² = (2M/R²) r³ dr",
        "Integrate r from 0 to R: I = (2M/R²) [R⁴/4] = 1/2 MR².",
      ],
    },
  };

  const sampleNumerical: NumericalBlockType = {
    id: "prac_num_01",
    type: "numerical",
    order: 2,
    mode: "guided",
    question: "Calculate the angular momentum of a body of moment of inertia 2.5 kg·m² rotating with an angular velocity of 12 rad/s.",
    given: {
      I: { value: 2.5, unit: "kg·m²", symbol: "I" },
      omega: { value: 12, unit: "rad/s", symbol: "ω" },
    },
    toFind: ["Angular Momentum (L)"],
    formulaIds: ["L = I * ω"],
    solutionSteps: [
      {
        stepIndex: 1,
        title: "Identify Formula",
        description: "Angular momentum L is given by the product of moment of inertia I and angular velocity ω.",
        latex: "L = I \\times \\omega",
        answerValue: 0,
        unit: "kg·m²/s",
      },
      {
        stepIndex: 2,
        title: "Substitute Given Values",
        description: "Substitute I = 2.5 kg·m² and ω = 12 rad/s.",
        latex: "L = 2.5 \\times 12 = 30 \\text{ kg}\\cdot\\text{m}^2/\\text{s}",
        answerValue: 30,
        unit: "kg·m²/s",
      },
    ],
    finalAnswer: { value: 30, unit: "kg·m²/s", tolerance: 0.01 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Practice Engine</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Topic MCQs with wrong-answer flow, 3-mode numerical challenges, and adaptive weak-area recovery.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "mcq" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("mcq")}
          className="rounded-xl"
        >
          MCQ Practice
        </Button>
        <Button
          variant={activeTab === "numerical" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("numerical")}
          className="rounded-xl"
        >
          Numerical Engine
        </Button>
        <Button
          variant={activeTab === "adaptive" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("adaptive")}
          className="rounded-xl gap-1.5"
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Adaptive Weak Areas</span>
        </Button>
      </div>

      {/* MCQ PRACTICE TAB */}
      {activeTab === "mcq" && (
        <div className="space-y-4">
          <Badge variant="indigo">Integrated MCQ Engine with Wrong-Answer Flow</Badge>
          <MCQBlock block={sampleMCQ} topicId="topic_rotational_01" />
        </div>
      )}

      {/* NUMERICAL ENGINE TAB */}
      {activeTab === "numerical" && (
        <div className="space-y-4">
          <Badge variant="sky">3-Stage Numerical Engine (Guided / Semi-guided / Exam)</Badge>
          <NumericalBlock block={sampleNumerical} />
        </div>
      )}

      {/* ADAPTIVE WEAK AREAS TAB */}
      {activeTab === "adaptive" && (
        <div className="space-y-4">
          <Badge variant="warning">Personalized Weak-Area Priority Recommendations</Badge>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adaptiveRecs.slice(0, 4).map((rec, idx) => (
              <Card key={idx} className="p-5 border-border flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Badge variant={rec.priorityScore > 70 ? "warning" : "secondary"}>
                    {rec.reason}
                  </Badge>
                  <h4 className="font-bold text-sm text-foreground">{rec.topicTitle}</h4>
                  <span className="text-xs text-muted-foreground block">
                    Priority Score: {Math.round(rec.priorityScore)}
                  </span>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 rounded-xl shrink-0">
                  <span>Practice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
