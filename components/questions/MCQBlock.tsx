"use client";

import React, { useState } from "react";
import { MCQQuestionBlock } from "@/content/types/course";
import { AttemptStatus } from "@/features/questions/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { trackQuestionAttempt } from "@/lib/analytics/events";

interface MCQBlockProps {
  block: MCQQuestionBlock;
  topicId?: string;
  onComplete?: (isCorrect: boolean, attempts: number) => void;
}

export function MCQBlock({ block, topicId = "topic_general", onComplete }: MCQBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submittedIndex, setSubmittedIndex] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [status, setStatus] = useState<AttemptStatus>("unattempted");

  const handleSubmit = () => {
    if (selectedIndex === null) return;

    const isCorrect = selectedIndex === block.correctOptionIndex;
    const newCount = attemptCount + 1;
    setAttemptCount(newCount);
    setSubmittedIndex(selectedIndex);

    trackQuestionAttempt(block.id, topicId, isCorrect, newCount);

    if (isCorrect) {
      setStatus("correct");
      if (onComplete) onComplete(true, newCount);
    } else {
      if (newCount === 1) {
        setStatus("wrong_1");
      } else {
        setStatus("wrong_2_plus");
      }
    }
  };

  const handleRetry = () => {
    setSelectedIndex(null);
    setSubmittedIndex(null);
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Check Your Understanding</span>
            </Badge>
            {attemptCount > 0 && (
              <Badge variant="outline">Attempts: {attemptCount}</Badge>
            )}
          </div>
          {status === "correct" && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Mastered</span>
            </Badge>
          )}
        </div>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2 leading-snug">
          {block.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Options Grid */}
        <div className="space-y-2.5">
          {block.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isSubmitted = submittedIndex === index;
            const isCorrectOption = index === block.correctOptionIndex;

            let optionStyle = "border-border bg-card hover:bg-secondary/60 text-foreground";

            if (status !== "unattempted") {
              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold";
                } else {
                  optionStyle = "border-destructive bg-destructive/10 text-destructive font-medium";
                }
              } else if (isCorrectOption && status === "correct") {
                optionStyle = "border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400";
              }
            } else if (isSelected) {
              optionStyle = "border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/20";
            }

            return (
              <button
                key={index}
                disabled={status === "correct"}
                onClick={() => setSelectedIndex(index)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
                {status !== "unattempted" && isSubmitted && (
                  <div>
                    {isCorrectOption ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit / Retry Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {status === "unattempted" && (
            <Button
              disabled={selectedIndex === null}
              onClick={handleSubmit}
              variant="default"
              size="md"
              className="gap-2 rounded-xl"
            >
              <span>Submit Answer</span>
            </Button>
          )}

          {(status === "wrong_1" || status === "wrong_2_plus") && (
            <Button onClick={handleRetry} variant="outline" size="md" className="gap-2 rounded-xl">
              <RotateCcw className="h-4 w-4" />
              <span>Retry Question</span>
            </Button>
          )}
        </div>

        {/* WRONG ATTEMPT 1: "Not Quite" + HINT */}
        {status === "wrong_1" && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-600 dark:text-amber-400">
              <XCircle className="h-4 w-4" />
              <span>Not Quite</span>
            </div>
            <div className="flex items-start gap-2 text-xs leading-relaxed">
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">Hint:</strong>
                <span>{block.hint}</span>
              </div>
            </div>
          </div>
        )}

        {/* WRONG ATTEMPT 2+: EXPLANATION + WORKED EXAMPLE */}
        {status === "wrong_2_plus" && (
          <div className="p-4 rounded-xl bg-secondary border border-border text-foreground space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              <span>Not Quite</span>
            </div>
            <div className="text-xs space-y-1">
              <span className="font-semibold text-primary block">Explanation:</span>
              <p className="text-muted-foreground leading-relaxed">{block.explanation}</p>
            </div>

            {block.workedExample && (
              <div className="p-3 rounded-lg bg-card border border-border text-xs space-y-1.5 mt-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-physics-indigo" />
                  <span>Worked Example: {block.workedExample.title}</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  {block.workedExample.steps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CORRECT: CONFIRMATION + EXPLANATION */}
        {status === "correct" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Spot On! Excellent work.</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-0.5">
                Explanation:
              </strong>
              <span>{block.explanation}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
