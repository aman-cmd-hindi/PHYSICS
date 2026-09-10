"use client";

import React from "react";
import { LessonBlock } from "@/content/types/course";
import { MCQBlock } from "@/components/questions/MCQBlock";
import { ConceptualBlock } from "@/components/questions/ConceptualBlock";
import { PredictionBlock } from "@/components/questions/PredictionBlock";
import { BoardStyleBlock } from "@/components/questions/BoardStyleBlock";
import { NumericalBlock } from "@/components/questions/NumericalBlock";
import { MasteryGate } from "@/components/mastery/MasteryGate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface LessonRendererProps {
  blocks: LessonBlock[];
  topicId: string;
  chapterId: string;
  nextTopicId?: string;
}

export function LessonRenderer({ blocks, topicId, chapterId, nextTopicId }: LessonRendererProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <Card key={block.id} className="p-6 border-border bg-card shadow-sm rounded-2xl">
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                  {block.title && <h3 className="text-lg font-bold mb-2">{block.title}</h3>}
                  <p>{block.content}</p>
                </div>
              </Card>
            );

          case "equation":
            return (
              <Card key={block.id} className="p-6 border-indigo-500/20 bg-indigo-500/5 shadow-sm rounded-2xl">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                  {block.title || "Key Derived Relationship"}
                </span>
                <div className="p-4 rounded-xl bg-card border text-center font-mono text-lg font-bold text-foreground">
                  {block.latex}
                </div>
                {block.variables && block.variables.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {block.variables.map((v, i) => (
                      <Badge key={i} variant="outline">
                        {v.symbol}: {v.name} ({v.unit})
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            );

          case "definition":
            return (
              <Card key={block.id} className="p-6 border-sky-500/30 bg-sky-500/5 shadow-sm rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="sky">Official Definition</Badge>
                  {block.symbol && <Badge variant="outline">Symbol: {block.symbol}</Badge>}
                  {block.unit && <Badge variant="outline">SI Unit: {block.unit}</Badge>}
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">{block.term}</h4>
                <p className="text-sm text-foreground leading-relaxed italic">{block.statement}</p>
              </Card>
            );

          case "mcq":
            return <MCQBlock key={block.id} block={block} topicId={topicId} />;

          case "conceptual":
            return <ConceptualBlock key={block.id} block={block} />;

          case "prediction":
            return <PredictionBlock key={block.id} block={block} />;

          case "board_style":
            return <BoardStyleBlock key={block.id} block={block} />;

          case "numerical":
            return <NumericalBlock key={block.id} block={block} />;

          case "mastery_gate":
            return (
              <MasteryGate
                key={block.id}
                block={block}
                topicId={topicId}
                chapterId={chapterId}
                nextTopicId={nextTopicId}
              />
            );

          default:
            return (
              <Card key={(block as any).id} className="p-4 text-xs text-muted-foreground">
                Block type &apos;{(block as any).type}&apos; architecture ready.
              </Card>
            );
        }
      })}
    </div>
  );
}
