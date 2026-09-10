"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
  RotateCcw,
  Presentation,
  BookOpen,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PhysicsSimulationLab } from "@/components/simulations/PhysicsSimulationLab";

export interface SlideItem {
  id: string;
  topicNumber: number;
  chapterTitle: string;
  slideTitle: string;
  subtitle: string;
  points: string[];
  equation?: {
    latex: string;
    description: string;
  };
  hasSimulation?: boolean;
  solutionKeywords?: string[];
  boardQuestion?: {
    marks: number;
    year: number;
    question: string;
    solution: string;
  };
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    id: "slide_01",
    topicNumber: 1,
    chapterTitle: "Chapter 1: Rotational Dynamics",
    slideTitle: "Circular Motion & Angular Kinematics",
    subtitle: "Fundamental definitions and kinematic relationships in circular paths",
    points: [
      "Angular displacement (θ): Angle traced by radius vector in radians (rad).",
      "Angular velocity (ω = dθ/dt): Rate of change of angular displacement (rad/s).",
      "Relation with linear velocity: v = r × ω (Magnitude: v = r · ω).",
      "Angular acceleration (α = dω/dt): Rate of change of angular velocity (rad/s²).",
    ],
    equation: {
      latex: "\\vec{v} = \\vec{\\omega} \\times \\vec{r} \\quad \\implies \\quad v = r \\cdot \\omega",
      description: "Tangential velocity is perpendicular to both angular velocity and radius vector.",
    },
    hasSimulation: true,
  },
  {
    id: "slide_02",
    topicNumber: 2,
    chapterTitle: "Chapter 1: Rotational Dynamics",
    slideTitle: "Centripetal & Centrifugal Forces",
    subtitle: "Real radial inward force vs pseudo non-inertial outward force",
    points: [
      "Centripetal Force (Real): Inward radial force necessary to maintain circular orbit: F_c = -m ω² r.",
      "Centrifugal Force (Pseudo): Apparent outward force experienced by an observer in rotating non-inertial frame.",
      "Banking of Roads: Optimum velocity without friction v_0 = √(r g tanθ).",
      "Maximum speed with friction: v_max = √[r g (μ_s + tanθ) / (1 - μ_s tanθ)].",
    ],
    equation: {
      latex: "F_c = \\frac{m v^2}{r} = m \\omega^2 r",
      description: "Magnitude of real inward centripetal force.",
    },
    hasSimulation: true,
  },
  {
    id: "slide_03",
    topicNumber: 3,
    chapterTitle: "Chapter 1: Rotational Dynamics",
    slideTitle: "Moment of Inertia & Theorems",
    subtitle: "Rotational analogue of mass and fundamental axis theorems",
    points: [
      "Moment of Inertia: I = ∑ m_i r_i² = ∫ r² dm (SI unit: kg·m²).",
      "Radius of Gyration: K = √(I / M) — effective mass distribution distance.",
      "Parallel Axes Theorem: I_o = I_c + M h².",
      "Perpendicular Axes Theorem (Laminar objects): I_z = I_x + I_y.",
    ],
    equation: {
      latex: "I_o = I_c + M h^2 \\qquad I_z = I_x + I_y",
      description: "Theorems of parallel and perpendicular axes for moment of inertia calculation.",
    },
    boardQuestion: {
      marks: 3,
      year: 2023,
      question: "State and prove the principle of conservation of angular momentum.",
      solution: "Torque τ = dL/dt. If external torque is zero (τ = 0), dL/dt = 0 ⇒ L = constant (I₁ω₁ = I₂ω₂). Hence proved.",
    },
  },
  {
    id: "slide_04",
    topicNumber: 4,
    chapterTitle: "Chapter 5: Oscillations",
    slideTitle: "Differential Equation of Linear S.H.M.",
    subtitle: "Restoring force kinematics and simple harmonic oscillations",
    points: [
      "Restoring Force: F = -k x, where k is force constant.",
      "Equation of Motion: m (d²x/dt²) + k x = 0  ⇒  d²x/dt² + ω² x = 0.",
      "Acceleration: a = -ω² x (Maximum at extremes, zero at mean).",
      "Velocity: v = ± ω √(A² - x²) (Maximum at mean position v_max = ωA).",
      "Time Period: T = 2π / ω = 2π √(m/k).",
    ],
    equation: {
      latex: "\\frac{d^2x}{dt^2} + \\omega^2 x = 0 \\quad \\text{where } \\omega = \\sqrt{\\frac{k}{m}}",
      description: "Standard differential equation of simple harmonic motion.",
    },
    hasSimulation: true,
  },
];

export function PresentationSlidesViewer() {
  const [slides] = useState<SlideItem[]>(DEFAULT_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [revealSolution, setRevealSolution] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeSlide = slides[currentSlideIndex];

  const handlePrev = () => {
    setRevealSolution(false);
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setRevealSolution(false);
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Presentation Top Control Bar (Smart Board Touch targets) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 h-10 px-3.5 rounded-xl"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline ml-1">Prev</span>
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="font-mono text-xs">
              Slide {currentSlideIndex + 1} / {slides.length}
            </Badge>
            <span className="text-xs sm:text-sm font-semibold text-slate-300 hidden md:inline">
              {activeSlide.chapterTitle}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 h-10 px-3.5 rounded-xl"
            aria-label="Next Slide"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {activeSlide.boardQuestion && (
            <Button
              variant={revealSolution ? "secondary" : "classroom"}
              size="sm"
              onClick={() => setRevealSolution(!revealSolution)}
              className="gap-1.5 h-10 rounded-xl px-4"
            >
              <Eye className="h-4 w-4" />
              <span>{revealSolution ? "Hide Solution" : "Reveal Solution"}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700 h-10 w-10 rounded-xl"
            aria-label="Toggle Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Presentation Slide Display Card */}
      <Card className="border-border bg-card shadow-2xl rounded-2xl overflow-hidden min-h-[480px] flex flex-col justify-between">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-background to-secondary/30 border-b border-border p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                Topic {activeSlide.topicNumber}
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {activeSlide.slideTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                {activeSlide.subtitle}
              </p>
            </div>
            <Presentation className="h-10 w-10 text-primary opacity-60 shrink-0 hidden sm:block" />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6 flex-1">
          {/* Key Bullet Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Core Theoretical Principles</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSlide.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-secondary/30 border border-border flex items-start gap-3 text-sm text-foreground leading-relaxed"
                >
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>{pt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Governing Equation Box */}
          {activeSlide.equation && (
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 block">
                Governing Equation
              </span>
              <div className="p-3 bg-card rounded-xl border text-center font-mono text-xl font-extrabold text-foreground">
                {activeSlide.equation.latex}
              </div>
              <p className="text-xs text-muted-foreground italic">
                {activeSlide.equation.description}
              </p>
            </div>
          )}

          {/* Board Exam Highlight Question */}
          {activeSlide.boardQuestion && (
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning">
                  Maharashtra Board Past Question ({activeSlide.boardQuestion.marks} Marks — {activeSlide.boardQuestion.year})
                </Badge>
              </div>
              <p className="font-semibold text-sm text-foreground">
                Q: {activeSlide.boardQuestion.question}
              </p>

              {revealSolution && (
                <div className="p-4 rounded-xl bg-card border border-emerald-500/40 text-sm space-y-1">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block uppercase">
                    Board Marking Solution:
                  </span>
                  <p className="text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                    {activeSlide.boardQuestion.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Live Simulation preview if active on this slide */}
          {activeSlide.hasSimulation && (
            <div className="pt-2">
              <PhysicsSimulationLab initialType="rotational" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
