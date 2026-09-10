"use client";

import React from "react";
import { MasteryGateBlock } from "@/content/types/course";
import { evaluateTopicMastery } from "@/features/mastery/mastery-engine";
import { useProgress } from "@/features/progress/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, Lock, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

interface MasteryGateProps {
  block: MasteryGateBlock;
  topicId: string;
  chapterId: string;
  nextTopicId?: string;
}

export function MasteryGate({ block, topicId, chapterId, nextTopicId }: MasteryGateProps) {
  const { getTopicProgress, updateTopicProgress } = useProgress();
  const progress = getTopicProgress(topicId);

  const evaluation = evaluateTopicMastery(
    progress?.questionAnswers || {},
    progress?.numericalProgress || {},
    {
      minMcqAccuracyPercent: block.minMcqAccuracyPercent || 80,
      minNumericalsCompleted: block.minNumericalsCompleted || 1,
    }
  );

  const handleMarkMastered = async () => {
    await updateTopicProgress(topicId, chapterId, {
      status: "completed",
      masteryScore: evaluation.masteryScore,
    });
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card shadow-md rounded-2xl my-8">
      <CardHeader className="pb-3 text-center">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
          <Award className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl font-extrabold text-foreground">
          Topic Mastery Gate
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6 text-center">
        {/* Overall Mastery Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-bold max-w-xs mx-auto">
            <span>Overall Topic Mastery</span>
            <span className="text-primary">{evaluation.masteryScore}%</span>
          </div>
          <div className="h-3 w-full max-w-xs mx-auto bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${evaluation.masteryScore}%` }}
            />
          </div>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-xs">
          <div className="p-3 rounded-xl bg-card border flex items-center justify-between">
            <span>MCQ Accuracy ({block.minMcqAccuracyPercent}% min)</span>
            <Badge variant={evaluation.mcqAccuracyPercent >= block.minMcqAccuracyPercent ? "success" : "warning"}>
              {evaluation.mcqAccuracyPercent}%
            </Badge>
          </div>
          <div className="p-3 rounded-xl bg-card border flex items-center justify-between">
            <span>Numericals ({block.minNumericalsCompleted} min)</span>
            <Badge variant={evaluation.numericalsCompletedCount >= block.minNumericalsCompleted ? "success" : "warning"}>
              {evaluation.numericalsCompletedCount} Completed
            </Badge>
          </div>
        </div>

        {/* Status Actions */}
        {evaluation.isMastered ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Mastery Achieved! Topic Completed.</span>
            </div>

            {nextTopicId && (
              <Link href={`/chapters/${chapterId}/${nextTopicId}`}>
                <Button size="lg" className="gap-2 rounded-2xl font-bold w-full max-w-xs shadow-md">
                  <span>Proceed to Next Topic</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-4 w-4 text-amber-500" />
              <span>Complete questions & numericals above to achieve mastery status.</span>
            </div>
            <Button
              onClick={handleMarkMastered}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Evaluate Mastery Status</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
