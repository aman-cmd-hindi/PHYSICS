"use client";

import React from "react";
import { Presentation, Eye, ChevronLeft, ChevronRight, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/common/ThemeContext";

export default function TutorPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">Classroom Mode</Badge>
            <Badge variant="outline">Smart Board Compatible</Badge>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Tutor & Classroom Presentation Mode
          </h2>
        </div>

        <Button
          variant="classroom"
          size="lg"
          onClick={() => setTheme(theme === "classroom" ? "light" : "classroom")}
          className="gap-2"
        >
          <Presentation className="h-5 w-5" />
          <span>{theme === "classroom" ? "Exit Classroom View" : "Launch Smart Board View"}</span>
        </Button>
      </div>

      {/* Classroom Controller Foundation Bar */}
      <Card className="p-6 space-y-4 border-physics-indigo/40 bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" className="gap-1.5 touch-target">
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </Button>
            <span className="font-extrabold text-base px-3">Topic 1 / 12 — Rotational Dynamics</span>
            <Button variant="outline" size="md" className="gap-1.5 touch-target">
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" className="gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>Reveal Solution</span>
            </Button>
            <Button variant="outline" size="md" className="gap-2">
              <Maximize2 className="h-4 w-4" />
              <span>Full Screen</span>
            </Button>
          </div>
        </div>

        <div className="p-8 text-center space-y-2">
          <Presentation className="h-10 w-10 text-physics-indigo mx-auto animate-pulse" />
          <h3 className="text-xl font-bold">No-Redirect Classroom Presentation Ready</h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Tutors can freely navigate through any chapter topic, run interactive simulations, and reveal complete step-by-step solutions without student gate restrictions.
          </p>
        </div>
      </Card>
    </div>
  );
}
