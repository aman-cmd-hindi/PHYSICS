"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Calculator, FileQuestion, FlaskConical, Bookmark, FileText, X } from "lucide-react";
import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_PHYSICS_FORMULAS } from "@/content/data/formulas";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";

interface SearchResultItem {
  id: string;
  category: "topic" | "formula" | "pyq" | "lab";
  title: string;
  subtitle: string;
  href: string;
}

export function UniversalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const results: SearchResultItem[] = [];

  if (query.trim().length > 0) {
    const qLower = query.toLowerCase();

    // Search Chapters & Topics
    OFFICIAL_CHAPTERS_MANIFEST.forEach((ch) => {
      if (ch.title.toLowerCase().includes(qLower)) {
        results.push({
          id: ch.id,
          category: "topic",
          title: `Chapter ${ch.chapterNumber}: ${ch.title}`,
          subtitle: `${ch.weightageMarks} Marks • ${ch.topicCount} Topics`,
          href: `/chapters/${ch.id}`,
        });
      }
    });

    // Search Formulas
    VERIFIED_PHYSICS_FORMULAS.forEach((f) => {
      if (
        f.title.toLowerCase().includes(qLower) ||
        f.latex.toLowerCase().includes(qLower) ||
        f.variables.some((v) => v.name.toLowerCase().includes(qLower))
      ) {
        results.push({
          id: f.id,
          category: "formula",
          title: f.title,
          subtitle: `Formula: ${f.latex}`,
          href: "/formulas",
        });
      }
    });

    // Search PYQs
    VERIFIED_PYQS_CATALOG.forEach((p) => {
      if (p.question.toLowerCase().includes(qLower) || p.topicTitle.toLowerCase().includes(qLower)) {
        results.push({
          id: p.id,
          category: "pyq",
          title: `Board ${p.year} (${p.marks}M): ${p.topicTitle}`,
          subtitle: p.question.substring(0, 80) + "...",
          href: "/pyqs",
        });
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-4 w-full max-w-2xl shadow-2xl space-y-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Universal Search across concepts, formulas, PYQs, labs, numericals..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto space-y-2">
          {results.length > 0 ? (
            results.map((res) => (
              <Link
                key={res.id}
                href={res.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/60 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  {res.category === "topic" && <BookOpen className="h-4 w-4 text-indigo-500 shrink-0" />}
                  {res.category === "formula" && <Calculator className="h-4 w-4 text-purple-500 shrink-0" />}
                  {res.category === "pyq" && <FileQuestion className="h-4 w-4 text-amber-500 shrink-0" />}
                  {res.category === "lab" && <FlaskConical className="h-4 w-4 text-sky-500 shrink-0" />}
                  <div>
                    <span className="font-bold text-foreground text-sm block">{res.title}</span>
                    <span className="text-muted-foreground">{res.subtitle}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : query.trim().length > 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching results found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Type a concept (e.g. Torque, Fluid, Pendulum, 2024) to search universal syllabus.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
