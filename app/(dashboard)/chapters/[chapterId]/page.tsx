import React from "react";
import Link from "next/link";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_TOPIC_PACKAGES } from "@/content/data/curriculum-packages";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { ChapterDownloadButton } from "@/components/offline/ChapterDownloadButton";

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

  // Check if verified published topic exists for this chapter
  const hasPublishedTopics = Object.values(VERIFIED_TOPIC_PACKAGES).some(
    (t) => t.chapterId === chapterId
  );

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
            Official curriculum topics sequence: Theory → Definition → Derivation → Formula Lab → MCQs → PYQs → Mastery Gate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ChapterDownloadButton chapterId={chapter.id} />
          <Link href={`/chapters/${chapter.id}/topic_rotational_01`}>
            <Button variant="default" size="lg" className="gap-2 rounded-2xl">
              <Play className="h-4 w-4" />
              <span>Start Topic 1</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">Topics Syllabus Sequence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 border-border space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="indigo">Topic 1</Badge>
              {hasPublishedTopics ? (
                <Badge variant="success" className="gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Published</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[11px]">CONTENT_REQUIRED</Badge>
              )}
            </div>
            <h4 className="font-bold text-base text-foreground">
              Characteristics of Circular Motion & Centripetal Acceleration
            </h4>
            <p className="text-xs text-muted-foreground">
              Kinematics of circular motion, centripetal force derivations, and banking of roads.
            </p>
            <div className="pt-2">
              <Link href={`/chapters/${chapter.id}/topic_rotational_01`}>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Study Topic 1
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-5 border-dashed border-border bg-card/40 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">Topic 2</Badge>
              <Badge variant="outline" className="text-[10px] font-mono">STATUS: CONTENT_REQUIRED</Badge>
            </div>
            <h4 className="font-bold text-base text-foreground">
              Vertical Circular Motion & Moment of Inertia
            </h4>
            <p className="text-xs text-muted-foreground">
              Authoritative textbook derivations in review in Content Studio. Never artificially synthesized.
            </p>
            <div className="pt-2">
              <Button disabled variant="outline" size="sm" className="w-full text-xs opacity-60">
                Awaiting Publication
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
