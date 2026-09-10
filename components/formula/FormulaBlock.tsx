"use client";

import React, { useState } from "react";
import { FormulaModel } from "@/content/types/formula";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Award, Bookmark, ChevronDown, ChevronUp } from "lucide-react";

interface FormulaBlockProps {
  formula: FormulaModel;
  onBookmark?: (formulaId: string) => void;
}

export function FormulaBlock({ formula, onBookmark }: FormulaBlockProps) {
  const [showDerivation, setShowDerivation] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) onBookmark(formula.id);
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl my-4 overflow-hidden">
      <CardHeader className="bg-secondary/30 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="indigo" className="gap-1">
              <Calculator className="h-3.5 w-3.5" />
              <span>Ch {formula.chapterNumber} Formula</span>
            </Badge>
            {formula.isImportantBoard && (
              <Badge variant="warning" className="gap-1">
                <Award className="h-3.5 w-3.5" />
                <span>Important Board Formula</span>
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBookmark}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Bookmark Formula"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-amber-500 fill-amber-500" : ""}`} />
          </Button>
        </div>

        <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2">
          {formula.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Formula LaTeX Display */}
        <div className="p-4 rounded-xl bg-card border border-primary/20 text-center font-mono text-xl font-bold text-foreground shadow-inner">
          {formula.latex}
        </div>

        {/* Physical Meaning */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="font-semibold text-foreground">Physical Meaning: </strong>
          {formula.physicalMeaning}
        </p>

        {/* Variable Meanings & SI Units Grid */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Variables & SI Units:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {formula.variables.map((v, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-secondary/50 border border-border flex items-center justify-between">
                <span className="font-bold text-primary">{v.symbol}</span>
                <span className="text-foreground">{v.name}</span>
                <Badge variant="outline" className="text-[10px]">{v.unit}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Derivation Steps (Optional) */}
        {formula.derivationSteps && formula.derivationSteps.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setShowDerivation(!showDerivation)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{showDerivation ? "Hide Stepwise Derivation" : "Show Stepwise Derivation"}</span>
              {showDerivation ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showDerivation && (
              <div className="mt-3 p-3 rounded-xl bg-secondary/40 border border-border text-xs space-y-1.5 animate-fadeIn">
                <span className="font-bold text-foreground block">Board Derivation Steps:</span>
                <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                  {formula.derivationSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
