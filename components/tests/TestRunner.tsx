"use client";

import React, { useState, useEffect } from "react";
import { TestConfig, TestAttemptState } from "@/features/tests/types";
import { calculateTestResult } from "@/features/tests/test-engine";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
} from "lucide-react";

interface TestRunnerProps {
  config: TestConfig;
  onExit: () => void;
}

export function TestRunner({ config, onExit }: TestRunnerProps) {
  const [state, setState] = useState<TestAttemptState>({
    status: "in_progress",
    currentQuestionIndex: 0,
    answers: {},
    flaggedQuestionIds: [],
    timeRemainingSeconds: config.durationMinutes * 60,
  });

  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

  // Active Timer Effect
  useEffect(() => {
    if (state.status !== "in_progress") return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemainingSeconds <= 1) {
          clearInterval(timer);
          const score = calculateTestResult(config, prev.answers);
          return { ...prev, timeRemainingSeconds: 0, status: "submitted", score };
        }
        return { ...prev, timeRemainingSeconds: prev.timeRemainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, config]);

  const currentQ = config.questions[state.currentQuestionIndex];
  const currentAnswer = state.answers[currentQ.id];
  const isFlagged = state.flaggedQuestionIds.includes(currentQ.id);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (optIndex: number) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: { selectedOptionIndex: optIndex },
      },
    }));
  };

  const handleToggleFlag = () => {
    setState((prev) => {
      const exists = prev.flaggedQuestionIds.includes(currentQ.id);
      const updated = exists
        ? prev.flaggedQuestionIds.filter((id) => id !== currentQ.id)
        : [...prev.flaggedQuestionIds, currentQ.id];
      return { ...prev, flaggedQuestionIds: updated };
    });
  };

  const handleSubmitTest = () => {
    const score = calculateTestResult(config, state.answers);
    setState((prev) => ({ ...prev, status: "submitted", score }));
    setConfirmSubmitOpen(false);
  };

  // RESULT & REPORT SCREEN
  if (state.status === "submitted" || state.status === "review") {
    const score = state.score || calculateTestResult(config, state.answers);

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <Badge variant="indigo">Examination Result</Badge>
            <h2 className="text-2xl font-extrabold text-foreground mt-1">{config.title}</h2>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit Exam Mode
          </Button>
        </div>

        {/* Score Banner */}
        <Card className="p-8 text-center border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 shadow-lg">
            <Award className="h-9 w-9" />
          </div>
          <h3 className="text-3xl font-black text-foreground">
            {score.totalMarksEarned} / {score.maxMarks} <span className="text-lg font-bold text-muted-foreground">Marks</span>
          </h3>
          <p className="text-sm font-bold text-primary mt-1">
            Overall Accuracy: {score.accuracyPercent}%
          </p>
        </Card>

        {/* Section Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(score.sectionBreakdown).map(([secName, secScore]) => (
            <Card key={secName} className="p-4 space-y-1">
              <span className="text-xs font-bold text-muted-foreground block truncate">{secName}</span>
              <span className="text-lg font-bold text-foreground">
                {secScore.earned} / {secScore.max} M
              </span>
            </Card>
          ))}
        </div>

        {/* Review Mode Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant={state.status === "review" ? "default" : "outline"}
            onClick={() => setState((prev) => ({ ...prev, status: "review" }))}
            className="gap-2 rounded-xl"
          >
            <CheckSquare className="h-4 w-4" />
            <span>Review Solutions & Marking Schemes</span>
          </Button>
        </div>

        {/* ITEM BY ITEM REVIEW MODE */}
        {state.status === "review" && (
          <div className="space-y-6 pt-4 border-t border-border">
            <h3 className="text-lg font-bold text-foreground">Question-by-Question Review</h3>
            {config.questions.map((q, idx) => {
              const ans = state.answers[q.id];
              const isCorrect = q.options && q.correctOptionIndex !== undefined && ans?.selectedOptionIndex === q.correctOptionIndex;

              return (
                <Card key={q.id} className="p-6 space-y-3 border-border">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Q{idx + 1} • {q.section} • {q.marks}M</Badge>
                    <Badge variant={isCorrect ? "success" : "warning"}>
                      {isCorrect ? "Full Marks (+ " + q.marks + "M)" : "Attempted"}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-base text-foreground">{q.question}</h4>

                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-xs space-y-1">
                    <span className="font-bold text-primary block">Official Board Solution:</span>
                    <p className="text-foreground whitespace-pre-line leading-relaxed">{q.expectedAnswer}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ACTIVE EXAM RUNNER INTERFACE
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Exam Header Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <Badge variant="indigo">{config.testType.toUpperCase().replace("_", " ")}</Badge>
          <h2 className="text-lg md:text-xl font-extrabold text-foreground mt-1">{config.title}</h2>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-base shadow-sm ${
            state.timeRemainingSeconds < 300
              ? "bg-destructive/10 border-destructive text-destructive animate-pulse"
              : "bg-card border-border text-foreground"
          }`}
        >
          <Clock className="h-5 w-5 text-primary" />
          <span>{formatTime(state.timeRemainingSeconds)}</span>
        </div>
      </div>

      {/* Question Runner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Main Question Display */}
        <Card className="lg:col-span-3 border-border bg-card shadow-sm p-6 flex flex-col justify-between min-h-[420px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <Badge variant="outline">
                Question {state.currentQuestionIndex + 1} of {config.questions.length} • {currentQ.section}
              </Badge>
              <Badge variant="sky">{currentQ.marks} Marks</Badge>
            </div>

            <h3 className="text-base md:text-lg font-bold text-foreground leading-snug">
              {currentQ.question}
            </h3>

            {/* MCQ Choices */}
            {currentQ.options && (
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer?.selectedOptionIndex === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                          : "border-border bg-card hover:bg-secondary/60 text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
            <div className="flex items-center gap-2">
              <Button
                disabled={state.currentQuestionIndex === 0}
                onClick={() => setState((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))}
                variant="outline"
                size="sm"
                className="gap-1 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>
              <Button
                disabled={state.currentQuestionIndex === config.questions.length - 1}
                onClick={() => setState((prev) => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }))}
                variant="outline"
                size="sm"
                className="gap-1 rounded-xl"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isFlagged ? "accent" : "ghost"}
                size="sm"
                onClick={handleToggleFlag}
                className="gap-1 text-xs rounded-xl"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>{isFlagged ? "Flagged" : "Flag for Review"}</span>
              </Button>

              <Button onClick={() => setConfirmSubmitOpen(true)} variant="default" size="sm" className="rounded-xl">
                Submit Test
              </Button>
            </div>
          </div>
        </Card>

        {/* Question Palette Sidebar */}
        <Card className="p-4 border-border bg-card space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Question Palette
          </span>
          <div className="grid grid-cols-4 gap-2">
            {config.questions.map((q, idx) => {
              const isCurrent = state.currentQuestionIndex === idx;
              const isAns = Boolean(state.answers[q.id]);
              const isFlag = state.flaggedQuestionIds.includes(q.id);

              let style = "bg-secondary text-muted-foreground border-border";
              if (isCurrent) style = "ring-2 ring-primary font-bold text-primary border-primary";
              else if (isAns) style = "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-semibold";
              if (isFlag) style += " border-amber-500 text-amber-600 font-bold";

              return (
                <button
                  key={q.id}
                  onClick={() => setState((prev) => ({ ...prev, currentQuestionIndex: idx }))}
                  className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Submit Confirmation Modal */}
      {confirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-2xl border-border">
            <h3 className="text-xl font-bold text-foreground">Submit Exam?</h3>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to submit your exam? You cannot change your answers after submission.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmSubmitOpen(false)}>
                Continue Exam
              </Button>
              <Button variant="default" size="sm" onClick={handleSubmitTest}>
                Confirm Submit
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
