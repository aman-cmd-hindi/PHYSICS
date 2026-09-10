"use client";

import React, { useState } from "react";
import { ContentQADashboard } from "@/components/admin/ContentQADashboard";
import { Shield, Sparkles, CheckCircle2, FileCheck, AlertTriangle, Eye, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"qa" | "studio" | "ai_draft">("qa");
  const [humanVerified, setHumanVerified] = useState(false);
  const [publishedVersion, setPublishedVersion] = useState("v1.0.0");

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="indigo">Admin / Content Manager Studio</Badge>
          <Badge variant="outline">Package Version: {publishedVersion}</Badge>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Content Studio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Author, verify, version, and publish official Maharashtra Board syllabus packages.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={activeTab === "qa" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("qa")}
          className="rounded-xl"
        >
          16-Chapter QA Dashboard
        </Button>
        <Button
          variant={activeTab === "studio" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("studio")}
          className="rounded-xl"
        >
          Block Authoring Studio
        </Button>
        <Button
          variant={activeTab === "ai_draft" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("ai_draft")}
          className="rounded-xl gap-1.5"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Admin AI Assistant (Draft Only)</span>
        </Button>
      </div>

      {/* TABS */}
      {activeTab === "qa" && <ContentQADashboard />}

      {activeTab === "studio" && (
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-lg text-foreground">Block Composition Workspace</h3>
          <p className="text-xs text-muted-foreground">
            Compose topics from structured blocks (Theory → Equations → Formula Labs → Interactive Simulations → MCQs → Numericals → PYQs → Mastery Gate).
          </p>

          <div className="p-4 rounded-xl bg-secondary/50 border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground">Human Verification Mandatory Gate</span>
              <Button
                variant={humanVerified ? "default" : "outline"}
                size="sm"
                onClick={() => setHumanVerified(!humanVerified)}
                className="gap-1.5 text-xs rounded-xl"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{humanVerified ? "Verified by Physics Expert" : "Mark as Verified"}</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "ai_draft" && (
        <Card className="p-6 space-y-4 border-amber-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-lg text-foreground">Admin AI Drafting Assistant</h3>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <strong className="font-bold block">Strict Content Rule:</strong>
            <span>
              AI-generated material is strictly restricted to draft generation inside this Admin Studio. AI material NEVER automatically becomes official published content. Mandatory human expert verification is required before publication.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
