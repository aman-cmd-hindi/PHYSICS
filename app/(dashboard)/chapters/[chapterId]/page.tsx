import React from "react";
import Link from "next/link";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Lock, Play } from "lucide-react";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === chapterId);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/chapters" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Chapters</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="indigo">Chapter {chapter.chapterNumber}</Badge>
            <Badge variant="outline">{chapter.weightageMarks} Marks Board Weightage</Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{chapter.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Topic flow: Theory → Visual → Formula Lab → MCQs → Numericals → PYQs → Mastery.
          </p>
        </div>

        <Link href={`/chapters/${chapter.id}/topic-1`}>
          <Button variant="default" size="lg" className="gap-2 rounded-2xl">
            <Play className="h-4 w-4" />
            <span>Start Topic 1</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Topics Sequence</h3>
        <Card className="p-6 text-center space-y-3">
          <BookOpen className="h-8 w-8 text-primary mx-auto opacity-70" />
          <h4 className="font-semibold text-base">Course Engine Ready</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Full syllabus content packages for Chapter {chapter.chapterNumber} will be loaded cleanly in Phase 2 via Content Studio without destroying progress state.
          </p>
        </Card>
      </div>
    </div>
  );
}
