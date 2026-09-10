"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FlaskConical,
  Target,
  Menu,
  X,
  FileQuestion,
  Calculator,
  Bookmark,
  FileText,
  RotateCcw,
  BarChart2,
  CheckSquare,
  Book,
  Presentation,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "Chapters", href: "/chapters", icon: BookOpen },
    { label: "Lab", href: "/lab", icon: FlaskConical },
    { label: "Practice", href: "/practice", icon: Target },
  ];

  const drawerItems = [
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
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around h-16 px-2">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors touch-target",
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full text-xs font-medium text-muted-foreground hover:text-foreground touch-target"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Slide-out Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-end">
          <div className="bg-card w-4/5 max-w-xs h-full border-l border-border p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="font-bold text-base text-foreground">Menu & Tools</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                {drawerItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-secondary font-bold text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
              Maharashtra Board Physics OS
            </div>
          </div>
        </div>
      )}
    </>
  );
}
