"use client";

import React from "react";
import { Settings, Moon, Sun, Presentation, Database, HardDrive, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/common/ThemeContext";
import { useProgress } from "@/features/progress/ProgressContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { isCloudSynced, syncWithCloud } = useProgress();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Platform Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Accessibility, visual theme, classroom mode, and local/cloud storage management.
        </p>
      </div>

      {/* Visual & Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            <span>Theme & Accessibility</span>
          </CardTitle>
          <CardDescription>Select preferred contrast mode and typography sizing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="gap-2"
            >
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="gap-2"
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </Button>
            <Button
              variant={theme === "classroom" ? "classroom" : "outline"}
              onClick={() => setTheme("classroom")}
              className="gap-2"
            >
              <Presentation className="h-4 w-4" />
              <span>Smart Board High Contrast</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage & Progress Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-sky-500" />
            <span>Local & Cloud Progress Sync</span>
          </CardTitle>
          <CardDescription>Manage browser storage and optional Supabase cloud synchronization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-primary" />
              <div>
                <span className="font-semibold text-sm text-foreground block">Browser Local Storage</span>
                <span className="text-xs text-muted-foreground">Active (No account required)</span>
              </div>
            </div>
            <Badge variant="success">Saved Locally</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="font-semibold text-sm text-foreground block">Supabase Cloud Sync</span>
                <span className="text-xs text-muted-foreground">Optional cloud backup & multi-device sync</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={syncWithCloud}>
              <span>{isCloudSynced ? "Re-sync Now" : "Connect Account"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
