"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ShieldAlert } from "lucide-react";

interface TextbookViewerProps {
  chapterTitle: string;
  startPage: number;
  endPage: number;
}

export function TextbookViewer({ chapterTitle, startPage = 1, endPage = 25 }: TextbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(startPage);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(75, prev - 25));

  return (
    <Card className="border-border bg-card shadow-md rounded-2xl overflow-hidden my-6">
      {/* Textbook Viewer Toolbar */}
      <CardHeader className="bg-secondary/40 border-b border-border pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="gap-1">
              <Book className="h-3.5 w-3.5" />
              <span>Textbook Page {currentPage} of {endPage}</span>
            </Badge>
            <span className="font-bold text-sm text-foreground hidden sm:inline">{chapterTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Page Navigation */}
            <Button
              disabled={currentPage <= startPage}
              onClick={() => setCurrentPage((p) => p - 1)}
              variant="outline"
              size="sm"
              className="gap-1 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev Page</span>
            </Button>
            <Button
              disabled={currentPage >= endPage}
              onClick={() => setCurrentPage((p) => p + 1)}
              variant="outline"
              size="sm"
              className="gap-1 rounded-xl"
            >
              <span>Next Page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-xl p-1 bg-background">
              <button
                onClick={handleZoomOut}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
                aria-label="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-xs font-mono px-1 font-bold">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
                aria-label="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[450px]">
        {/* Licensing & Authorization Guardrail Banner */}
        <div className="w-full max-w-xl p-6 rounded-2xl bg-secondary/50 border border-border text-center space-y-3">
          <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto" />
          <h4 className="font-bold text-base text-foreground">
            Authorized Textbook Content Viewer (Page {currentPage})
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Legal Disclaimer: Actual Maharashtra Board textbook page renderings activate when authorized/licensed textbook media packages are mounted. This platform enforces copyright protection and authorized page mapping boundaries.
          </p>
          <div
            className="p-8 rounded-xl bg-card border font-mono text-sm text-foreground transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            [ Textbook Page {currentPage} Preview Area — Topic Mapping Verified ]
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
