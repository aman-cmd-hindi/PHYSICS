"use client";

import React, { useState } from "react";
import { BoardStyleQuestionBlock } from "@/content/types/course";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Eye, CheckSquare } from "lucide-react";

export function BoardStyleBlock({ block }: { block: BoardStyleQuestionBlock }) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="indigo" className="gap-1">
            <Award className="h-3.5 w-3.5" />
            <span>Board Examination Question</span>
          </Badge>
          <Badge variant="outline">{block.marks} Marks</Badge>
        </div>
        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2">
          {block.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {!showSolution ? (
          <Button onClick={() => setShowSolution(true)} variant="default" size="sm" className="gap-2 rounded-xl">
            <Eye className="h-4 w-4" />
            <span>Reveal Stepwise Marking Scheme</span>
          </Button>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-secondary border border-border space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Standard Board Model Answer
              </span>
              <p className="text-sm text-foreground leading-relaxed font-medium">{block.modelAnswer}</p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span>Stepwise Marking Scheme</span>
              </span>
              <div className="space-y-1.5">
                {block.markingScheme.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-card border">
                    <span>{item.point}</span>
                    <Badge variant="success">+{item.marks} M</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
