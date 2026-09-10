"use client";

import React from "react";
import { useClassroom } from "@/features/classroom/ClassroomContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Minimize2,
  Presentation,
  RotateCcw,
  X,
} from "lucide-react";

interface SmartBoardBarProps {
  currentTopicNumber: number;
  totalTopics: number;
  topicTitle: string;
  onPrevTopic?: () => void;
  onNextTopic?: () => void;
  onRevealAll?: () => void;
}

export function SmartBoardBar({
  currentTopicNumber,
  totalTopics,
  topicTitle,
  onPrevTopic,
  onNextTopic,
  onRevealAll,
}: SmartBoardBarProps) {
  const { isClassroomPresentation, toggleClassroomPresentation } = useClassroom();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-slate-950 border-b border-indigo-500/30 text-white px-4 py-3 shadow-2xl backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Topic Position Indicator & Prev / Next */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onPrevTopic}
            variant="outline"
            size="smartboard"
            className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl smartboard-target"
            aria-label="Previous Topic"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="hidden sm:inline">Prev</span>
          </Button>

          <div className="flex flex-col">
            <Badge variant="indigo" className="w-max text-xs">
              Topic {currentTopicNumber} of {totalTopics}
            </Badge>
            <span className="font-extrabold text-base md:text-lg tracking-tight text-white truncate max-w-xs md:max-w-md">
              {topicTitle}
            </span>
          </div>

          <Button
            onClick={onNextTopic}
            variant="outline"
            size="smartboard"
            className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl smartboard-target"
            aria-label="Next Topic"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Classroom Action Controls */}
        <div className="flex items-center gap-2">
          {onRevealAll && (
            <Button
              onClick={onRevealAll}
              variant="classroom"
              size="smartboard"
              className="gap-2 rounded-2xl smartboard-target"
            >
              <Eye className="h-5 w-5" />
              <span>Reveal Solutions</span>
            </Button>
          )}

          <Button
            onClick={toggleFullScreen}
            variant="outline"
            size="icon"
            className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800 smartboard-target"
            aria-label="Full Screen"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>

          <Button
            onClick={toggleClassroomPresentation}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white smartboard-target"
            aria-label="Close Presentation Bar"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
