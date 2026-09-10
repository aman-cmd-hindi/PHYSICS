"use client";

import React, { useState } from "react";
import { PredictionQuestionBlock } from "@/content/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";

export function PredictionBlock({ block }: { block: PredictionQuestionBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) setRevealed(true);
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <Badge variant="sky" className="w-max gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Prediction</span>
        </Badge>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2">
          {block.setup}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <p className="text-sm font-semibold text-foreground">{block.question}</p>

        <div className="space-y-2">
          {block.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={revealed}
              onClick={() => setSelected(idx)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                selected === idx
                  ? "border-primary bg-primary/10 text-primary font-bold"
                  : "border-border bg-card hover:bg-secondary/50 text-foreground"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {!revealed ? (
          <Button disabled={selected === null} onClick={handleSubmit} size="sm" className="rounded-xl">
            Test Prediction
          </Button>
        ) : (
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2 text-xs animate-fadeIn">
            <span className="font-bold text-primary block">Outcome & Physical Principle</span>
            <p className="text-foreground">{block.outcomeExplanation}</p>
            <span className="font-semibold text-muted-foreground block">
              Principle: {block.physicalPrinciple}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
