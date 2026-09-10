"use client";

import React, { useState } from "react";
import { useProgress } from "@/features/progress/ProgressContext";
import {
  calculateSpacedRepetitionSchedule,
  detectWeakTopics,
  WeakTopicItem,
} from "@/features/revision/revision-engine";
import { WeakTopicRecovery } from "@/components/revision/WeakTopicRecovery";
import { RotateCcw, Calendar, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RevisionPage() {
  const { progressMap } = useProgress();
  const [activeRecoveryItem, setActiveRecoveryItem] = useState<WeakTopicItem | null>(null);

  const dueRevisions = calculateSpacedRepetitionSchedule(progressMap);
  const weakTopics = detectWeakTopics(progressMap);

  if (activeRecoveryItem) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="outline" size="sm" onClick={() => setActiveRecoveryItem(null)}>
          ← Back to Revision Center
        </Button>
        <WeakTopicRecovery item={activeRecoveryItem} onComplete={() => setActiveRecoveryItem(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <RotateCcw className="h-6 w-6 text-primary" />
          <span>Revision Center & Learning Intelligence</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Deterministic spaced repetition, weak-topic recovery flows, and exam countdown schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spaced Repetition Queue */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="indigo">Spaced Repetition</Badge>
              <Badge variant="outline">{dueRevisions.length} Due</Badge>
            </div>
            <CardTitle className="text-lg mt-2">Due Revisions</CardTitle>
            <CardDescription>Scheduled intervals (1D, 3D, 7D, 14D) to prevent forgetting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueRevisions.length > 0 ? (
              dueRevisions.map((item) => (
                <div key={item.topicId} className="p-3.5 rounded-xl bg-secondary/50 border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-foreground block">{item.topicTitle}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.daysOverdue} days since last study • Mastery: {item.masteryScore}%
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs">
                    Revise
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border rounded-xl">
                No topics due for spaced repetition today. Great job staying current!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak Topic Recovery Detector */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="warning">Weak-Topic Recovery</Badge>
              <Badge variant="outline">{weakTopics.length} Weak Areas</Badge>
            </div>
            <CardTitle className="text-lg mt-2">Deterministic Recovery Queue</CardTitle>
            <CardDescription>Targeted 7-step remediation for topics below 80% mastery.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakTopics.slice(0, 4).map((item) => (
              <div key={item.topicId} className="p-3.5 rounded-xl bg-secondary/50 border flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-sm text-foreground block">{item.chapterTitle}</span>
                  <span className="text-xs text-muted-foreground">{item.weakConcept}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveRecoveryItem(item)}
                  className="rounded-xl text-xs gap-1.5 shrink-0"
                >
                  <span>Start Recovery</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
