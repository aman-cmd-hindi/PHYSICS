"use client";

import React from "react";
import { LessonBlock } from "@/content/types/course";
import { MCQBlock } from "@/components/questions/MCQBlock";
import { ConceptualBlock } from "@/components/questions/ConceptualBlock";
import { PredictionBlock } from "@/components/questions/PredictionBlock";
import { BoardStyleBlock } from "@/components/questions/BoardStyleBlock";
import { NumericalBlock } from "@/components/questions/NumericalBlock";
import { PYQBlock } from "@/components/pyqs/PYQBlock";
import { FormulaLab } from "@/components/formula/FormulaLab";
import { PhysicsSimulationLab } from "@/components/simulations/PhysicsSimulationLab";
import { MasteryGate } from "@/components/mastery/MasteryGate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Binary,
  Layers,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

interface LessonRendererProps {
  blocks: LessonBlock[];
  topicId: string;
  chapterId: string;
  nextTopicId?: string;
}

export function LessonRenderer({ blocks, topicId, chapterId, nextTopicId }: LessonRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <Card className="p-12 text-center space-y-3 border-dashed border-border bg-card/40">
        <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
        <Badge variant="outline" className="text-xs font-mono">
          STATUS: CONTENT_REQUIRED
        </Badge>
        <h3 className="text-lg font-bold text-foreground">Lesson Blocks Not Published Yet</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Per anti-hallucination rules, lesson content is never artificially synthesized. Official verified blocks for this topic are currently undergoing authoritative review in the Content Studio.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {blocks.map((block) => {
        // If block has provenance indicating SOURCE_REQUIRED or CONTENT_REQUIRED, display explicit missing state
        if (block.provenance?.status === "SOURCE_REQUIRED") {
          return (
            <Card key={block.id} className="p-4 border-dashed border-amber-500/30 bg-amber-500/5 text-xs text-muted-foreground flex items-center justify-between">
              <span className="font-semibold text-foreground">Block {block.title || block.id}: Source Attribution Required</span>
              <Badge variant="warning" className="text-[10px]">SOURCE_REQUIRED</Badge>
            </Card>
          );
        }

        switch (block.type) {
          case "theory":
          case "text":
            return (
              <Card key={block.id} className="p-6 border-border bg-card shadow-sm rounded-2xl space-y-3">
                {block.title && (
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>{block.title}</span>
                    </h3>
                    {block.provenance && (
                      <Badge variant="outline" className="text-[10px]">
                        {block.provenance.sourceReference}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                  {block.content}
                </div>
              </Card>
            );

          case "definition":
            return (
              <Card key={block.id} className="p-6 border-sky-500/30 bg-sky-500/5 shadow-sm rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="sky">Official Board Definition</Badge>
                    {block.symbol && <Badge variant="outline">Symbol: {block.symbol}</Badge>}
                    {block.unit && <Badge variant="outline">SI Unit: {block.unit}</Badge>}
                  </div>
                  {block.provenance && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Ref: {block.provenance.sourceReference}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">{block.term}</h4>
                <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-sky-500 pl-3">
                  &ldquo;{block.statement}&rdquo;
                </p>
              </Card>
            );

          case "concept":
            return (
              <Card key={block.id} className="p-6 border-indigo-500/30 bg-indigo-500/5 shadow-sm rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-indigo-500" />
                  <h4 className="font-bold text-base text-foreground">{block.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{block.summary}</p>
                <div className="space-y-1.5 pt-1">
                  {block.keyPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="p-2 rounded-xl bg-card border text-xs flex gap-2 text-foreground">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );

          case "equation":
            return (
              <Card key={block.id} className="p-6 border-indigo-500/20 bg-indigo-500/5 shadow-sm rounded-2xl">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                  {block.title || "Governing Board Relationship"}
                </span>
                <div className="p-4 rounded-xl bg-card border text-center font-mono text-lg font-bold text-foreground shadow-inner">
                  {block.latex}
                </div>
                {block.explanation && (
                  <p className="text-xs text-muted-foreground mt-2">{block.explanation}</p>
                )}
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

          case "derivation":
            return (
              <Card key={block.id} className="p-6 border-border bg-card shadow-sm rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-base text-foreground">{block.title}</h3>
                  </div>
                  <Badge variant="indigo">Step-by-Step Derivation</Badge>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl font-mono text-center font-bold text-primary text-base">
                  Target: {block.targetFormulaLatex}
                </div>
                <div className="space-y-2">
                  {block.steps.map((step) => (
                    <div key={step.stepNumber} className="p-3 rounded-xl bg-secondary/40 border border-border text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                          {step.stepNumber}
                        </span>
                        <span>{step.statement}</span>
                      </div>
                      {step.latex && (
                        <div className="p-2 rounded bg-card font-mono text-center text-primary font-bold my-1">
                          {step.latex}
                        </div>
                      )}
                      {step.rationale && (
                        <span className="text-[11px] text-muted-foreground block italic">
                          Rationale: {step.rationale}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );

          case "example":
            return (
              <Card key={block.id} className="p-6 border-border bg-card shadow-sm rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Solved Board Example</Badge>
                  <span className="font-bold text-sm text-foreground">{block.title}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{block.problemStatement}</p>
                <div className="p-3 bg-secondary/40 rounded-xl text-xs space-y-1">
                  <span className="font-bold block text-foreground">Given Parameters:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(block.givenData).map(([k, v]) => (
                      <Badge key={k} variant="outline" className="text-[10px]">{k} = {v}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Stepwise Solution:
                  </span>
                  {block.solutionSteps.map((s, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-lg bg-card border text-xs text-foreground flex gap-2">
                      <span className="font-bold text-primary">{sIdx + 1}.</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">Final Evaluated Result:</span>
                  <span className="font-mono font-bold text-foreground">{block.finalAnswer}</span>
                </div>
              </Card>
            );

          case "visual":
            return (
              <Card key={block.id} className="p-6 border-border bg-card shadow-sm rounded-2xl space-y-3 text-center">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{block.diagramType.toUpperCase()}</Badge>
                  <span className="text-xs text-muted-foreground">{block.caption}</span>
                </div>
                <h4 className="font-bold text-base text-foreground">{block.title}</h4>
                <div className="p-8 rounded-2xl bg-secondary/40 border border-border flex flex-col items-center justify-center font-mono text-xs text-muted-foreground">
                  [ 2D Schematic Diagram Specification: {block.diagramType} ]
                </div>
              </Card>
            );

          case "simulation":
            return (
              <div key={block.id} className="space-y-2">
                <Badge variant="indigo">Interactive Simulation</Badge>
                <PhysicsSimulationLab />
              </div>
            );

          case "summary":
            return (
              <Card key={block.id} className="p-6 border-border bg-secondary/30 rounded-2xl space-y-3">
                <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-emerald-500" />
                  <span>Topic Summary & Quick Recap</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-foreground">
                  {block.keyTakeaways.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
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

          case "formula_lab":
            return (
              <FormulaLab
                key={block.id}
                config={{
                  id: block.id,
                  title: block.formulaTitle || "Interactive Formula Lab",
                  equationLatex: block.equationLatex || "",
                  targetVariableSymbol: block.targetVariable || "Result",
                  targetVariableUnit: "",
                  visualizerType: "torque",
                  variables: block.variables || [],
                  calculateFn: (vars) => {
                    const vals = Object.values(vars);
                    return vals.reduce((acc, curr) => acc * curr, 1);
                  },
                }}
              />
            );

          case "pyq":
            return (
              <PYQBlock
                key={block.id}
                pyq={{
                  id: block.id,
                  year: block.year || 2024,
                  marks: (block.marks as 1 | 2 | 3 | 4) || 2,
                  chapterId,
                  chapterNumber: 1,
                  topicId,
                  topicTitle: block.title || "Topic Practice",
                  difficulty: "medium",
                  question: block.question,
                  boardSolution: block.modelAnswer,
                  markingScheme: block.markingScheme || [{ point: "Correct method and final value", marks: block.marks || 2 }],
                  explanation: "Standard Maharashtra State Board solution.",
                  relatedConcept: block.title || "Syllabus Concept",
                }}
              />
            );

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
