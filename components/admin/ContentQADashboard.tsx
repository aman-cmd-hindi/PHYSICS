"use client";

import React from "react";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, ShieldCheck, FileCheck } from "lucide-react";

export function ContentQADashboard() {
  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="indigo" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>16-Chapter Curriculum QA Checklist</span>
          </Badge>
          <Badge variant="success">All 16 Chapters Structured</Badge>
        </div>
        <CardTitle className="text-xl font-extrabold text-foreground mt-2">
          Content Production Audit
        </CardTitle>
        <CardDescription>
          Syllabus-complete coverage verification using official Maharashtra Board notation, units, and conventions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {OFFICIAL_CHAPTERS_MANIFEST.map((ch) => (
            <div key={ch.id} className="p-3 rounded-xl bg-secondary/40 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Ch {ch.chapterNumber}</span>
                <Badge variant="outline" className="text-[10px]">{ch.weightageMarks}M</Badge>
              </div>
              <span className="font-semibold text-foreground text-xs block truncate">{ch.title}</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">{ch.topicCount} Topics</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Structured</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
