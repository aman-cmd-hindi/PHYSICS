"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FlaskConical,
  Target,
  FileQuestion,
  Calculator,
  Bookmark,
  FileText,
  RotateCcw,
  BarChart2,
  CheckSquare,
  Presentation,
  Book,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Atom,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/common/ThemeContext";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();

  const primaryNav = [
    { label: "Home", href: "/", icon: Home },
    { label: "Chapters", href: "/chapters", icon: BookOpen },
    { label: "Physics Lab", href: "/lab", icon: FlaskConical },
    { label: "Practice", href: "/practice", icon: Target },
  ];

  const secondaryNav = [
    { label: "PYQ Bank", href: "/pyqs", icon: FileQuestion },
    { label: "Formula Bank", href: "/formulas", icon: Calculator },
    { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { label: "Notes", href: "/notes", icon: FileText },
    { label: "Revision", href: "/revision", icon: RotateCcw },
    { label: "Analytics", href: "/analytics", icon: BarChart2 },
    { label: "Tests", href: "/tests", icon: CheckSquare },
    { label: "Textbook Viewer", href: "/textbook", icon: Book },
    { label: "Tutor Mode", href: "/tutor", icon: Presentation },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Admin Studio", href: "/admin", icon: Shield },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 relative z-20 h-screen sticky top-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-border h-16">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
            <Atom className="h-6 w-6 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight leading-none text-foreground">
                MAHARASHTRA
              </span>
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">
                Physics OS
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Primary Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Main Learning
            </p>
          )}
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Tools & Assessment
            </p>
          )}
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-secondary font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Classroom Smart Board Quick Switcher */}
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={() => setTheme(theme === "classroom" ? "light" : "classroom")}
          className={cn(
            "w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold text-xs transition-colors",
            theme === "classroom"
              ? "bg-physics-indigo text-white border-transparent shadow-md"
              : "border-border bg-secondary/50 text-foreground hover:bg-secondary"
          )}
        >
          <Presentation className="h-4 w-4" />
          {!collapsed && (
            <span>{theme === "classroom" ? "Classroom Active" : "Smart Board Mode"}</span>
          )}
        </button>

        {!collapsed && (
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <span className="text-muted-foreground">Local Learning</span>
            <Badge variant="success">Active</Badge>
          </div>
        )}
      </div>
    </aside>
  );
}
