"use client";

import React, { useState } from "react";
import { PYQModel } from "@/content/types/pyq";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Eye, CheckSquare, BookOpen, Presentation, CheckCircle2 } from "lucide-react";

interface PYQBlockProps {
  pyq: PYQModel;
  isTutorMode?: boolean;
}

export function PYQBlock({ pyq, isTutorMode = false }: PYQBlockProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(isTutorMode);

  const isMCQ = Boolean(pyq.options && pyq.options.length > 0);

  const handleStudentSubmit = () => {
    setRevealed(true);
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6 overflow-hidden">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="gap-1">
              <Award className="h-3.5 w-3.5" />
              <span>Board Exam {pyq.year}</span>
            </Badge>
            <Badge variant="outline">{pyq.marks} Marks</Badge>
            <Badge variant={pyq.difficulty === "easy" ? "success" : pyq.difficulty === "medium" ? "warning" : "indigo"}>
              {pyq.difficulty.toUpperCase()}
            </Badge>
          </div>

          {isTutorMode && (
            <Badge variant="warning" className="gap-1">
              <Presentation className="h-3 w-3" />
              <span>Tutor Instant Reveal</span>
            </Badge>
          )}
        </div>

        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2 leading-snug">
          {pyq.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Student MCQ Options (If 1-mark MCQ) */}
        {isMCQ && pyq.options && (
          <div className="space-y-2">
            {pyq.options.map((opt, idx) => {
              const isSel = selectedOption === idx;
              const isCorrectOpt = idx === pyq.correctOptionIndex;
              return (
                <button
                  key={idx}
                  disabled={revealed && !isTutorMode}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                    revealed && isCorrectOpt
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                      : isSel
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-card hover:bg-secondary/50 text-foreground"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Action Button for Student vs Tutor */}
        {!revealed && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {isMCQ ? "Select option then verify solution" : "Solve in notebook before checking model answer"}
            </span>
            <Button
              disabled={isMCQ && selectedOption === null}
              onClick={handleStudentSubmit}
              size="sm"
              className="gap-2 rounded-xl"
            >
              <Eye className="h-4 w-4" />
              <span>{isMCQ ? "Submit & Check Solution" : "Check Official Solution"}</span>
            </Button>
          </div>
        )}

        {/* REVEALED OFFICIAL BOARD SOLUTION & MARKING SCHEME */}
        {revealed && (
          <div className="space-y-4 pt-2 animate-fadeIn">
            <div className="p-4 rounded-xl bg-secondary border border-border space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Official Board Model Solution
              </span>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line font-medium">
                {pyq.boardSolution}
              </p>
            </div>

            {/* Stepwise Marking Scheme */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Board Stepwise Marking Scheme Breakdown</span>
              </span>
              <div className="space-y-1.5">
                {pyq.markingScheme.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-card border">
                    <span className="text-foreground">{item.point}</span>
                    <Badge variant="success">+{item.marks} Mark</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation & Related Concept */}
            <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-xs space-y-1">
              <span className="font-bold text-foreground block">Explanation & Key Insight:</span>
              <p className="text-muted-foreground">{pyq.explanation}</p>
              <div className="pt-1 flex items-center gap-1.5 text-primary font-semibold">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Related Concept: {pyq.relatedConcept}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
