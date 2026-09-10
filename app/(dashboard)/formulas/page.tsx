"use client";

import React, { useState } from "react";
import { VERIFIED_PHYSICS_FORMULAS } from "@/content/data/formulas";
import { FormulaBlock } from "@/components/formula/FormulaBlock";
import { Search, Calculator, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FormulasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");

  const filteredFormulas = VERIFIED_PHYSICS_FORMULAS.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.latex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.variables.some((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesChapter = selectedChapter === "all" || f.chapterNumber === selectedChapter;

    return matchesSearch && matchesChapter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <span>Formula Bank</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Master formulas, SI units, dimensional formulas, and quantitative derivations for Class 12.
        </p>
      </div>

      {/* Search & Chapter Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas, variables (e.g. Torque, Centripetal, Pa)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={selectedChapter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChapter("all")}
            className="rounded-xl text-xs"
          >
            All Chapters
          </Button>
          <Button
            variant={selectedChapter === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChapter(1)}
            className="rounded-xl text-xs"
          >
            Ch 1
          </Button>
          <Button
            variant={selectedChapter === 2 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChapter(2)}
            className="rounded-xl text-xs"
          >
            Ch 2
          </Button>
          <Button
            variant={selectedChapter === 5 ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChapter(5)}
            className="rounded-xl text-xs"
          >
            Ch 5
          </Button>
        </div>
      </div>

      {/* Formula Catalog List */}
      <div className="space-y-4">
        {filteredFormulas.length > 0 ? (
          filteredFormulas.map((formula) => (
            <FormulaBlock key={formula.id} formula={formula} />
          ))
        ) : (
          <div className="p-8 text-center border rounded-2xl bg-card text-muted-foreground text-sm">
            No formulas match your search query.
          </div>
        )}
      </div>
    </div>
  );
}
