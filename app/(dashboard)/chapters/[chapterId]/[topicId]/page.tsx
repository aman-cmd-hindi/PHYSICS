import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_TOPIC_PACKAGES } from "@/content/data/curriculum-packages";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";
import { ChapterDownloadButton } from "@/components/offline/ChapterDownloadButton";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ chapterId: string; topicId: string }>;
}) {
  const { chapterId, topicId } = await params;
  const chapter = OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === chapterId);

  if (!chapter) {
    notFound();
  }

  // Retrieve published topic package
  const topicPackage = VERIFIED_TOPIC_PACKAGES[topicId];

  return (
    <div className="space-y-6">
      {/* Top Header: Back + Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <Link
          href={`/chapters/${chapterId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chapter {chapter.chapterNumber}: {chapter.title}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ChapterDownloadButton chapterId={chapterId} />
          {topicPackage?.provenance?.verified && (
            <Badge variant="success" className="gap-1 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified Syllabus Lesson</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Topic Title & Provenance Banner */}
      {topicPackage ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="indigo">Topic {topicPackage.sequenceOrder}</Badge>
            {topicPackage.textbookPageReference && (
              <Badge variant="outline">
                Textbook pp. {topicPackage.textbookPageReference.startPage}–{topicPackage.textbookPageReference.endPage}
              </Badge>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            {topicPackage.title}
          </h2>
          {topicPackage.provenance && (
            <p className="text-xs text-muted-foreground">
              Source: {topicPackage.provenance.source} ({topicPackage.provenance.sourceReference}) • Version {topicPackage.provenance.contentVersion}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Badge variant="outline">Topic View</Badge>
          <h2 className="text-2xl font-extrabold text-foreground">
            Chapter {chapter.chapterNumber} — {topicId}
          </h2>
        </div>
      )}

      {/* Main Lesson Renderer */}
      {topicPackage ? (
        <LessonRenderer
          blocks={topicPackage.blocks}
          topicId={topicPackage.id}
          chapterId={chapterId}
        />
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-border bg-card/40">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto" />
          <Badge variant="outline" className="text-xs font-mono">
            STATUS: CONTENT_REQUIRED
          </Badge>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Authoritative Topic Content Required</h3>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Per strict anti-hallucination rules, lessons are never synthesized without authorized human review. Authoritative content packages for Chapter {chapter.chapterNumber} ({topicId}) are currently in the Content Studio review queue.
            </p>
          </div>
        </Card>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Link href={`/chapters/${chapterId}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Chapter Overview</span>
          </Button>
        </Link>
        <Link href="/practice">
          <Button variant="default" size="sm" className="gap-2">
            <span>Proceed to Practice</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
