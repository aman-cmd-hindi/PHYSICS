"use client";

import React, { useState } from "react";
import { Presentation, Sparkles, BookOpen, Layers, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/common/ThemeContext";
import { PresentationSlidesViewer } from "@/components/classroom/PresentationSlidesViewer";
import { PhysicsSimulationLab } from "@/components/simulations/PhysicsSimulationLab";

export default function TutorPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"slides" | "simulation">("slides");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo">Classroom Mode</Badge>
            <Badge variant="outline">Smart Board Compatible</Badge>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Tutor Presentation & Simulation Engine
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full-screen touch-friendly slide decks, interactive 2D simulations, and instant solution reveal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="classroom"
            size="lg"
            onClick={() => setTheme(theme === "classroom" ? "light" : "classroom")}
            className="gap-2 rounded-xl"
          >
            <Presentation className="h-5 w-5" />
            <span>{theme === "classroom" ? "Exit Classroom View" : "Launch Smart Board View"}</span>
          </Button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "slides" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("slides")}
          className="gap-1.5 rounded-xl"
        >
          <Monitor className="h-4 w-4" />
          <span>Classroom PPT Slide Deck</span>
        </Button>
        <Button
          variant={activeTab === "simulation" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("simulation")}
          className="gap-1.5 rounded-xl"
        >
          <Sparkles className="h-4 w-4" />
          <span>Full 2D Simulation Lab</span>
        </Button>
      </div>

      {/* Render Active View */}
      {activeTab === "slides" && <PresentationSlidesViewer />}
      {activeTab === "simulation" && <PhysicsSimulationLab />}
    </div>
  );
}
