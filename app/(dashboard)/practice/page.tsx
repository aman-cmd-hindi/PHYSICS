"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, ArrowRight, BookOpen, RefreshCw, Zap, Lightbulb } from "lucide-react";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { MCQBlock } from "@/components/questions/MCQBlock";
import { NumericalBlock } from "@/components/questions/NumericalBlock";
import { MCQQuestionBlock, NumericalBlock as NumericalBlockType } from "@/content/types/course";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DynamicContentData {
  summary: string;
  keyFormulas: { name: string; latex: string; meaning: string }[];
  practiceQuestions: MCQQuestionBlock[];
  numerical: {
    question: string;
    given: string;
    formula: string;
    solutionSteps: string[];
    finalAnswer: string;
  };
}

export default function PracticePage() {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(OFFICIAL_CHAPTERS_MANIFEST[0].id);
  const [selectedTopic, setSelectedTopic] = useState<string>("Moment of Inertia and Angular Momentum");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dynamicData, setDynamicData] = useState<DynamicContentData | null>(null);
  const [activeTab, setActiveTab] = useState<"mcq" | "numerical" | "concept">("mcq");

  const currentChapter = OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === selectedChapterId) || OFFICIAL_CHAPTERS_MANIFEST[0];

  async function fetchDynamicContent(topic: string = selectedTopic) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: currentChapter.title,
          topicTitle: topic,
          context: customPrompt || `Maharashtra Board Class 12 Physics: ${currentChapter.title}`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate dynamic content");
      }

      setDynamicData(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to contact Gemini API. Please ensure your API key is active.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDynamicContent("Rotational Motion and Moment of Inertia");
  }, [selectedChapterId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Dynamic Practice & Mastery</h2>
            <Badge variant="indigo" className="gap-1 px-2.5 py-0.5 text-xs font-semibold">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              Powered by Gemini
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time syllabus-aligned questions, step-by-step numerical derivations, and explanations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDynamicContent()}
            disabled={loading}
            className="rounded-xl gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Regenerate Set</span>
          </Button>
        </div>
      </div>

      {/* Chapter & Topic Selection */}
      <Card className="p-4 border-border bg-card/60 backdrop-blur-sm shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Chapter (Maharashtra Board Class 12)
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {OFFICIAL_CHAPTERS_MANIFEST.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chapter {ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Topic / Sub-concept
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. Surface Tension, Doppler Effect, Carnot Engine"
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => fetchDynamicContent()}
                disabled={loading}
                className="rounded-xl px-4"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400">
          <p className="text-sm font-semibold">{error}</p>
        </Card>
      )}

      {loading && !dynamicData && (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Generating questions and derivations...</p>
        </div>
      )}

      {dynamicData && (
        <div className="space-y-6">
          {/* Content Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Button
              variant={activeTab === "mcq" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("mcq")}
              className="rounded-xl gap-1.5"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Dynamic MCQs ({dynamicData.practiceQuestions?.length || 0})</span>
            </Button>
            <Button
              variant={activeTab === "numerical" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("numerical")}
              className="rounded-xl gap-1.5"
            >
              <Zap className="h-4 w-4" />
              <span>Step-by-Step Numerical</span>
            </Button>
            <Button
              variant={activeTab === "concept" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("concept")}
              className="rounded-xl gap-1.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Concept Overview & Formulas</span>
            </Button>
          </div>

          {/* DYNAMIC MCQS TAB */}
          {activeTab === "mcq" && (
            <div className="space-y-4">
              <Badge variant="indigo">Board Exam Pattern MCQs with Wrong-Answer Flow</Badge>
              {dynamicData.practiceQuestions?.map((q, idx) => (
                <MCQBlock
                  key={q.id || idx}
                  block={{
                    ...q,
                    order: idx + 1,
                    type: "mcq",
                    id: q.id || `dynamic_mcq_${idx}`,
                  }}
                  topicId={selectedChapterId}
                />
              ))}
            </div>
          )}

          {/* DYNAMIC NUMERICAL TAB */}
          {activeTab === "numerical" && dynamicData.numerical && (
            <div className="space-y-4">
              <Badge variant="sky">Board Exam 3-4 Mark Numerical Derivation</Badge>
              <Card className="p-6 border-border space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">{dynamicData.numerical.question}</h3>
                  <div className="p-3 bg-muted/40 rounded-xl text-sm font-medium border border-border">
                    <span className="text-muted-foreground font-semibold">Given: </span>
                    {dynamicData.numerical.given}
                  </div>
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm font-mono text-primary font-bold">
                    <span className="text-muted-foreground font-sans font-semibold">Formula: </span>
                    {dynamicData.numerical.formula}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Solution Steps (Board Marking Scheme)</h4>
                  <div className="space-y-2">
                    {dynamicData.numerical.solutionSteps?.map((step, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl bg-card border border-border text-sm flex gap-3">
                        <span className="font-bold text-primary shrink-0">{sIdx + 1}.</span>
                        <div className="text-foreground leading-relaxed">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Final Board Answer</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-base">
                    {dynamicData.numerical.finalAnswer}
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* CONCEPT & FORMULAS TAB */}
          {activeTab === "concept" && (
            <div className="space-y-6">
              <Card className="p-6 border-border space-y-4">
                <h3 className="font-bold text-lg text-foreground">Summary & Key Concepts</h3>
                <div className="prose dark:prose-invert text-sm max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                  {dynamicData.summary}
                </div>
              </Card>

              {dynamicData.keyFormulas && dynamicData.keyFormulas.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Governing Equations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dynamicData.keyFormulas.map((f, fIdx) => (
                      <Card key={fIdx} className="p-4 border-border space-y-2">
                        <Badge variant="outline">{f.name}</Badge>
                        <div className="p-3 bg-muted/30 rounded-xl font-mono text-center text-primary font-bold text-base">
                          {f.latex}
                        </div>
                        <p className="text-xs text-muted-foreground">{f.meaning}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
