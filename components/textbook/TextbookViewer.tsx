"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ShieldAlert, FileX } from "lucide-react";

interface TextbookViewerProps {
  chapterTitle: string;
  startPage: number;
  endPage: number;
  hasAuthorizedAsset?: boolean;
}

export function TextbookViewer({
  chapterTitle,
  startPage = 1,
  endPage = 25,
  hasAuthorizedAsset = false,
}: TextbookViewerProps) {
  const [currentPage, setCurrentPage] = useState(startPage);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(75, prev - 25));

  return (
    <Card className={`border-border bg-card shadow-md rounded-2xl overflow-hidden my-6 ${isFullscreen ? "fixed inset-0 z-50 rounded-none my-0" : ""}`}>
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

            {/* Smart Board Fullscreen Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl h-8 w-8"
              title="Smart Board Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[450px]">
        {/* NON-NEGOTIABLE: Never fabricate textbook pages. If authorized asset is not mounted, show explicit CONTENT_REQUIRED state */}
        {!hasAuthorizedAsset ? (
          <div className="w-full max-w-xl p-8 rounded-2xl bg-secondary/40 border-2 border-dashed border-border text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileX className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="text-[11px] font-mono mb-1">
                STATUS: CONTENT_REQUIRED
              </Badge>
              <h4 className="font-bold text-base text-foreground">
                Authorized Textbook Asset Not Mounted (Page {currentPage})
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                In strict accordance with syllabus integrity and copyright verification, textbook pages are never artificially synthesized or hallucinated. Official Balbharati / Maharashtra Board textbook PDF media packages activate here when mounted by an authorized administrator.
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl text-xs font-mono text-muted-foreground">
              Official Reference: Chapter {chapterTitle} (Target Range: pp. {startPage}–{endPage})
            </div>
          </div>
        ) : (
          <div
            className="p-8 rounded-xl bg-card border font-mono text-sm text-foreground transition-transform"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            [ Authorized Textbook Asset Rendering — Page {currentPage} ]
          </div>
        )}
      </CardContent>
    </Card>
  );
}
