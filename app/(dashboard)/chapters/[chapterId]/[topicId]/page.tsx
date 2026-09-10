import React from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, FileText, Settings, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ chapterId: string; topicId: string }>;
}) {
  const { chapterId, topicId } = await params;

  return (
    <div className="space-y-6">
      {/* Top Header: Back + position */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href={`/chapters/${chapterId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chapter Map</span>
        </Link>
        <Badge variant="indigo">Topic View Foundation</Badge>
      </div>

      {/* Main Lesson Renderer Container Foundation */}
      <Card className="p-8 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
        <div className="p-4 rounded-2xl bg-primary/10 text-primary">
          <Calculator className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Lesson Engine Architecture Ready</h3>
        <p className="text-sm text-muted-foreground max-w-lg">
          This topic engine renders structured lesson blocks (Theory → Equations → Formula Labs → Interactive Simulations → MCQs → Numericals → PYQs → Mastery Gate).
        </p>
      </Card>

      {/* Bottom Bar: Bookmark + Continue */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark className="h-4 w-4" />
          <span>Bookmark Topic</span>
        </Button>
        <Button variant="default" size="sm">
          <span>Continue Lesson</span>
        </Button>
      </div>
    </div>
  );
}
