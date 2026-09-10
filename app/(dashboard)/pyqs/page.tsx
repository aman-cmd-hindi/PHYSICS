"use client";

import React, { useState } from "react";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";
import { PYQBlock } from "@/components/pyqs/PYQBlock";
import { FileQuestion, Filter, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PYQsPage() {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [selectedMarks, setSelectedMarks] = useState<number | "all">("all");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [isTutorMode, setIsTutorMode] = useState(false);

  const filteredPYQs = VERIFIED_PYQS_CATALOG.filter((p) => {
    const matchYear = selectedYear === "all" || p.year === selectedYear;
    const matchMarks = selectedMarks === "all" || p.marks === selectedMarks;
    const matchChapter = selectedChapter === "all" || p.chapterNumber === selectedChapter;

    return matchYear && matchMarks && matchChapter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <FileQuestion className="h-6 w-6 text-primary" />
            <span>PYQ Bank (Previous Years Board Questions)</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verified Maharashtra Board Class 12 exam questions with stepwise marking schemes.
          </p>
        </div>

        <Button
          variant={isTutorMode ? "accent" : "outline"}
          size="sm"
          onClick={() => setIsTutorMode(!isTutorMode)}
          className="rounded-xl gap-2 self-start sm:self-auto"
        >
          <Award className="h-4 w-4" />
          <span>{isTutorMode ? "Tutor Instant Reveal: ON" : "Tutor Instant Reveal: OFF"}</span>
        </Button>
      </div>

      {/* Multi-faceted Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter PYQ Database:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-foreground">Year:</span>
            <Button
              variant={selectedYear === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear("all")}
              className="h-8 text-xs rounded-lg"
            >
              All
            </Button>
            <Button
              variant={selectedYear === 2024 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(2024)}
              className="h-8 text-xs rounded-lg"
            >
              2024
            </Button>
            <Button
              variant={selectedYear === 2023 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(2023)}
              className="h-8 text-xs rounded-lg"
            >
              2023
            </Button>
            <Button
              variant={selectedYear === 2022 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(2022)}
              className="h-8 text-xs rounded-lg"
            >
              2022
            </Button>
          </div>

          {/* Marks Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-foreground">Marks:</span>
            <Button
              variant={selectedMarks === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarks("all")}
              className="h-8 text-xs rounded-lg"
            >
              All
            </Button>
            <Button
              variant={selectedMarks === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarks(1)}
              className="h-8 text-xs rounded-lg"
            >
              1M
            </Button>
            <Button
              variant={selectedMarks === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarks(2)}
              className="h-8 text-xs rounded-lg"
            >
              2M
            </Button>
            <Button
              variant={selectedMarks === 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarks(3)}
              className="h-8 text-xs rounded-lg"
            >
              3M
            </Button>
            <Button
              variant={selectedMarks === 4 ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMarks(4)}
              className="h-8 text-xs rounded-lg"
            >
              4M
            </Button>
          </div>
        </div>
      </div>

      {/* PYQ List */}
      <div className="space-y-4">
        {filteredPYQs.length > 0 ? (
          filteredPYQs.map((pyq) => (
            <PYQBlock key={pyq.id} pyq={pyq} isTutorMode={isTutorMode} />
          ))
        ) : (
          <div className="p-8 text-center border rounded-2xl bg-card text-muted-foreground text-sm">
            No PYQs match the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
