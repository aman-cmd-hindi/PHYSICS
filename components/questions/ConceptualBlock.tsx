"use client";

import React, { useState } from "react";
import { ConceptualQuestionBlock } from "@/content/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Eye, Lightbulb, CheckSquare } from "lucide-react";

export function ConceptualBlock({ block }: { block: ConceptualQuestionBlock }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="indigo" className="gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Conceptual Challenge</span>
          </Badge>
        </div>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2">
          {block.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {!showAnswer && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="gap-2 rounded-xl"
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAnswer(true)}
              className="gap-2 rounded-xl"
            >
              <Eye className="h-4 w-4" />
              <span>Check Model Answer</span>
            </Button>
          </div>
        )}

        {showHint && !showAnswer && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200">
            <strong className="font-semibold block mb-0.5">Hint:</strong>
            <span>{block.hint}</span>
          </div>
        )}

        {showAnswer && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-secondary border border-border space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Official Model Answer
              </span>
              <p className="text-sm text-foreground leading-relaxed font-medium">{block.modelAnswer}</p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Key Marking Criteria</span>
              </span>
              <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                {block.selfCheckPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
