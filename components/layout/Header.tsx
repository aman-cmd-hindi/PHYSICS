"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Presentation, User, LogIn, Sparkles, BookOpen } from "lucide-react";
import { useTheme } from "@/components/common/ThemeContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  // Generate breadcrumbs from route
  const pathSegments = pathname.split("/").filter(Boolean);
  const title = pathSegments.length === 0 ? "Dashboard" : pathSegments[0].toUpperCase();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {title === "DASHBOARD" && <span className="text-primary font-extrabold">Physics Dashboard</span>}
          {title === "CHAPTERS" && <span>Course Chapters</span>}
          {title === "LAB" && <span className="text-physics-accent">Physics Lab</span>}
          {title === "PRACTICE" && <span className="text-physics-emerald">Practice Engine</span>}
          {title !== "DASHBOARD" && title !== "CHAPTERS" && title !== "LAB" && title !== "PRACTICE" && (
            <span>{title}</span>
          )}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs w-48 justify-between rounded-xl"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search physics...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ⌘K
          </kbd>
        </Button>

        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(true)}
          className="sm:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Theme Switcher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </Button>

        {/* Account Button / Auth Link */}
        <Link href="/auth/login">
          <Button variant="outline" size="sm" className="gap-2 text-xs rounded-xl">
            <LogIn className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </Link>
      </div>

      {/* Search Modal Backdrop */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-4 w-full max-w-xl shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search concepts, formulas, topics, numericals..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs border px-2 py-1 rounded-md text-muted-foreground"
              >
                ESC
              </button>
            </div>
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type to search across Rotational Dynamics, Oscillations, Formulas, PYQs...
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
