import React from "react";
import Link from "next/link";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export default function ChaptersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Course Chapters catalog
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Complete Class 12 Maharashtra Board Physics syllabus (16 Chapters).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OFFICIAL_CHAPTERS_MANIFEST.map((chapter) => (
          <Card key={chapter.id} className="hover:border-primary/40 transition-all flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="indigo">Chapter {chapter.chapterNumber}</Badge>
                <Badge variant="outline">{chapter.weightageMarks} Marks</Badge>
              </div>
              <CardTitle className="text-lg mt-2">{chapter.title}</CardTitle>
              <CardDescription>{chapter.topicCount} Topics included</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href={`/chapters/${chapter.id}`}>
                <Button variant="secondary" className="w-full justify-between rounded-xl">
                  <span>Open Chapter Map</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
