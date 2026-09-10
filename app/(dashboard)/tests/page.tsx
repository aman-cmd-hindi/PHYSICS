"use client";

import React, { useState } from "react";
import { generateTestConfig } from "@/features/tests/test-engine";
import { TestConfig, TestType } from "@/features/tests/types";
import { TestRunner } from "@/components/tests/TestRunner";
import { CheckSquare, Play, Clock, Award, Zap, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TestsPage() {
  const [activeTest, setActiveTest] = useState<TestConfig | null>(null);

  const startTest = (type: TestType, title: string, duration = 45) => {
    const config = generateTestConfig(type, title, [1], duration);
    setActiveTest(config);
  };

  if (activeTest) {
    return <TestRunner config={activeTest} onExit={() => setActiveTest(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span>Tests & Assessment Engine</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chapter tests, multi-chapter exams, full board mock tests, and adaptive weak-area tests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chapter Test Card */}
        <Card className="hover:border-primary/40 transition-all flex flex-col justify-between">
          <CardHeader>
            <Badge variant="indigo">Chapter Test</Badge>
            <CardTitle className="text-lg mt-2">Chapter 1 — Rotational Dynamics</CardTitle>
            <CardDescription>25 Marks • 45 Minutes Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => startTest("chapter_test", "Chapter 1 Test — Rotational Dynamics", 45)}
              className="w-full gap-2 rounded-xl"
            >
              <Play className="h-4 w-4" />
              <span>Start Chapter Test</span>
            </Button>
          </CardContent>
        </Card>

        {/* Multi-Chapter Unit Test */}
        <Card className="hover:border-primary/40 transition-all flex flex-col justify-between">
          <CardHeader>
            <Badge variant="sky">Multi-Chapter Exam</Badge>
            <CardTitle className="text-lg mt-2">Unit Test — Mechanics (Ch 1 & 2)</CardTitle>
            <CardDescription>50 Marks • 90 Minutes Duration</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => startTest("multi_chapter_test", "Unit Test — Mechanics (Ch 1 & 2)", 90)}
              variant="accent"
              className="w-full gap-2 rounded-xl"
            >
              <Play className="h-4 w-4" />
              <span>Start Unit Test</span>
            </Button>
          </CardContent>
        </Card>

        {/* Full Syllabus Board Mock */}
        <Card className="hover:border-primary/40 transition-all flex flex-col justify-between">
          <CardHeader>
            <Badge variant="warning">Full Syllabus Board Mock</Badge>
            <CardTitle className="text-lg mt-2">Maharashtra Board Full Mock 2026</CardTitle>
            <CardDescription>70 Marks • 180 Minutes (3 Hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => startTest("full_syllabus_test", "Maharashtra Board Full Mock 2026", 180)}
              variant="default"
              className="w-full gap-2 rounded-xl"
            >
              <Play className="h-4 w-4" />
              <span>Start Full Board Mock</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
