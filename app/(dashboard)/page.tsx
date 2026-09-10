"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Target,
  FileQuestion,
  Calculator,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { useProgress } from "@/features/progress/ProgressContext";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { resumePosition, progressMap, isCloudSynced } = useProgress();

  // Find last chapter or default to Chapter 1
  const activeChapterId = resumePosition?.chapterId || OFFICIAL_CHAPTERS_MANIFEST[0].id;
  const activeChapter =
    OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === activeChapterId) || OFFICIAL_CHAPTERS_MANIFEST[0];

  const quickAccess = [
    { label: "Chapters", href: "/chapters", icon: BookOpen, color: "text-indigo-500 bg-indigo-500/10" },
    { label: "Physics Lab", href: "/lab", icon: FlaskConical, color: "text-sky-500 bg-sky-500/10" },
    { label: "Practice", href: "/practice", icon: Target, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "PYQ Bank", href: "/pyqs", icon: FileQuestion, color: "text-amber-500 bg-amber-500/10" },
    { label: "Formula Bank", href: "/formulas", icon: Calculator, color: "text-purple-500 bg-purple-500/10" },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, color: "text-rose-500 bg-rose-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-physics-accent/10 to-transparent p-6 rounded-3xl border border-primary/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">Class 12 Maharashtra Board</Badge>
            {isCloudSynced ? (
              <Badge variant="success">Cloud Synced</Badge>
            ) : (
              <Badge variant="secondary">Local Mode Active</Badge>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back to Physics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prepare all 16 chapters sequentially with integrated theory, labs, numericals, and PYQs.
          </p>
        </div>

        <Link href={`/chapters/${activeChapter.id}`}>
          <Button size="lg" className="gap-2 shadow-md rounded-2xl w-full md:w-auto">
            <span>Resume Chapter {activeChapter.chapterNumber}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Continue Learning & Today Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <Card className="lg:col-span-2 border-primary/20 bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                CONTINUE LEARNING
              </span>
              <Badge variant="outline">Chapter {activeChapter.chapterNumber} of 16</Badge>
            </div>
            <CardTitle className="text-xl mt-1">{activeChapter.title}</CardTitle>
            <CardDescription>
              Weightage: {activeChapter.weightageMarks} Marks • {activeChapter.topicCount} Topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">Active Resume Position</span>
                <span className="font-semibold text-foreground text-sm">
                  {resumePosition?.topicId ? `Topic: ${resumePosition.topicId}` : "Topic 1.1 — Angular Displacement & Velocity"}
                </span>
              </div>
              <Link href={`/chapters/${activeChapter.id}`}>
                <Button variant="accent" size="sm" className="gap-1.5 rounded-xl">
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Chapter Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Overall Mastery</span>
                <span className="text-primary font-bold">0%</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-0 rounded-full transition-all duration-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader className="pb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              TODAY
            </span>
            <CardTitle className="text-lg">Study Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
              <Clock className="h-5 w-5 text-sky-500 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground block">Study Time</span>
                <span className="font-bold text-foreground">0 min</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground block">Topics Completed</span>
                <span className="font-bold text-foreground">0 topics</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
              <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs text-muted-foreground block">Questions Solved</span>
                <span className="font-bold text-foreground">0 questions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Quick Access</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:border-primary/40 transition-all cursor-pointer h-full text-center p-4 flex flex-col items-center justify-center gap-3">
                  <div className={`p-3 rounded-2xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-xs text-foreground">{item.label}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
