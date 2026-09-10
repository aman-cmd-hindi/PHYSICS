"use client";

import React, { useState, useMemo } from "react";
import { BookOpen, AlertCircle, CheckCircle2, Award, Zap, HelpCircle } from "lucide-react";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";
import { VERIFIED_PHYSICS_FORMULAS } from "@/content/data/formulas";
import { MCQBlock } from "@/components/questions/MCQBlock";
import { NumericalBlock } from "@/components/questions/NumericalBlock";
import { PYQBlock } from "@/components/pyqs/PYQBlock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PracticePage() {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(OFFICIAL_CHAPTERS_MANIFEST[0].id);
  const [activeTab, setActiveTab] = useState<"questions" | "formulas" | "pyqs">("questions");

  const currentChapter = useMemo(
    () => OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === selectedChapterId) || OFFICIAL_CHAPTERS_MANIFEST[0],
    [selectedChapterId]
  );

  // Filter strictly verified curriculum content
  const chapterPYQs = useMemo(
    () => VERIFIED_PYQS_CATALOG.filter((p) => p.chapterId === selectedChapterId),
    [selectedChapterId]
  );

  const chapterFormulas = useMemo(
    () => VERIFIED_PHYSICS_FORMULAS.filter((f) => f.chapterId === selectedChapterId),
    [selectedChapterId]
  );

  // Extract verified MCQ items from verified PYQ repository
  const verifiedMCQs = useMemo(
    () => chapterPYQs.filter((p) => p.options && p.options.length > 0 && p.correctOptionIndex !== undefined),
    [chapterPYQs]
  );

  const hasVerifiedPractice = chapterPYQs.length > 0 || chapterFormulas.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Verified Practice & Mastery</h2>
            <Badge variant="indigo" className="gap-1 px-2.5 py-0.5 text-xs font-semibold">
              <CheckCircle2 className="h-3 w-3 text-indigo-400" />
              100% Deterministic Syllabus Content
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Authoritative Maharashtra State Board past questions, verified marking schemes, and governing formulas.
          </p>
        </div>
      </div>

      {/* Chapter Selection */}
      <Card className="p-4 border-border bg-card/60 backdrop-blur-sm shadow-sm space-y-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
            Select Chapter (Maharashtra Board Class 12 Physics)
          </label>
          <select
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {OFFICIAL_CHAPTERS_MANIFEST.map((ch) => (
              <option key={ch.id} value={ch.id}>
                Chapter {ch.chapterNumber}: {ch.title} ({ch.weightageMarks} Marks)
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Content Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "questions" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("questions")}
          className="rounded-xl gap-1.5"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Verified MCQs ({verifiedMCQs.length})</span>
        </Button>
        <Button
          variant={activeTab === "pyqs" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("pyqs")}
          className="rounded-xl gap-1.5"
        >
          <Award className="h-4 w-4" />
          <span>Board PYQ Catalog ({chapterPYQs.length})</span>
        </Button>
        <Button
          variant={activeTab === "formulas" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("formulas")}
          className="rounded-xl gap-1.5"
        >
          <Zap className="h-4 w-4" />
          <span>Governing Formulas ({chapterFormulas.length})</span>
        </Button>
      </div>

      {/* PRACTICE CONTENT OR EXPLICIT UNAVAILABLE STATE */}
      {!hasVerifiedPractice && (
        <Card className="p-12 text-center space-y-4 border-dashed border-border bg-card/40">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Verified practice content is not available yet.
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Per strict curriculum integrity rules, unverified or AI-fabricated questions are not served. Official verified practice packages for Chapter {currentChapter.chapterNumber} ({currentChapter.title}) are currently awaiting authorization.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            STATUS: CONTENT_REQUIRED
          </Badge>
        </Card>
      )}

      {hasVerifiedPractice && (
        <div className="space-y-6">
          {/* VERIFIED MCQS TAB */}
          {activeTab === "questions" && (
            <div className="space-y-4">
              {verifiedMCQs.length === 0 ? (
                <Card className="p-8 text-center space-y-2 border-dashed">
                  <p className="text-sm font-medium text-muted-foreground">
                    Verified practice content is not available yet.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No verified multiple-choice questions have been published for this chapter.
                  </p>
                </Card>
              ) : (
                verifiedMCQs.map((q, idx) => (
                  <MCQBlock
                    key={q.id}
                    block={{
                      id: q.id,
                      type: "mcq",
                      order: idx + 1,
                      question: q.question,
                      options: q.options || [],
                      correctOptionIndex: q.correctOptionIndex ?? 0,
                      explanation: q.explanation || "Standard Maharashtra State Board solution.",
                      hint: `Refer to ${q.relatedConcept || "textbook derivation"}.`,
                    }}
                    topicId={q.topicId}
                  />
                ))
              )}
            </div>
          )}

          {/* VERIFIED PYQS TAB */}
          {activeTab === "pyqs" && (
            <div className="space-y-4">
              {chapterPYQs.map((pyq) => (
                <PYQBlock key={pyq.id} pyq={pyq} />
              ))}
            </div>
          )}

          {/* FORMULAS TAB */}
          {activeTab === "formulas" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapterFormulas.length === 0 ? (
                <Card className="col-span-2 p-8 text-center space-y-2 border-dashed">
                  <p className="text-sm font-medium text-muted-foreground">
                    Verified practice content is not available yet.
                  </p>
                </Card>
              ) : (
                chapterFormulas.map((f) => (
                  <Card key={f.id} className="p-5 border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{f.title}</Badge>
                      {f.isImportantBoard && <Badge variant="warning">Important Board</Badge>}
                    </div>
                    <div className="p-3 bg-muted/40 rounded-xl font-mono text-center text-primary font-bold text-lg">
                      {f.latex}
                    </div>
                    <p className="text-xs text-muted-foreground">{f.physicalMeaning}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {f.variables.map((v, vIdx) => (
                        <span key={vIdx} className="text-[11px] bg-secondary px-2 py-0.5 rounded-md text-foreground">
                          <strong>{v.symbol}</strong>: {v.name} ({v.unit})
                        </span>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
