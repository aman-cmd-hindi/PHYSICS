"use client";

import React, { useState } from "react";
import { ContentQADashboard } from "@/components/admin/ContentQADashboard";
import { ContentLifecycleService } from "@/features/content-studio/lifecycle-service";
import { ContentLifecycleStatus, ContentPackageMetadata } from "@/features/content-studio/types";
import { Shield, Sparkles, CheckCircle2, FileCheck, AlertTriangle, Send, History } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"qa" | "studio" | "ai_draft">("qa");
  const [changeReason, setChangeReason] = useState("");
  const [reviewerName, setReviewerName] = useState("Dr. R. K. Patil (Physics HOD)");

  const [currentPkg, setCurrentPkg] = useState<ContentPackageMetadata>({
    chapterId: "ch_01_rotational_dynamics",
    chapterNumber: 1,
    version: "v1.0.0",
    status: "HUMAN_REVIEW",
    authorEmail: "content-team@boardphysics.internal",
    humanVerified: false,
    lastUpdated: new Date().toISOString(),
    reviewHistory: [
      {
        id: "rev_initial_01",
        packageId: "ch_01_rotational_dynamics",
        version: "v1.0.0",
        status: "VALIDATION",
        humanVerified: false,
        reviewerId: "usr_validator_auto",
        reviewerEmail: "validator@internal",
        reviewerRole: "content_manager",
        reviewedAt: new Date(Date.now() - 3600000).toISOString(),
        changeReason: "Initial block schema structure pass.",
        checksum: "chk_rotational_init",
      },
    ],
  });

  const [transitionError, setTransitionError] = useState<string | null>(null);

  const handleAdvanceLifecycle = (nextStatus: ContentLifecycleStatus) => {
    setTransitionError(null);
    const result = ContentLifecycleService.transitionLifecycle(
      currentPkg,
      nextStatus,
      [],
      {
        reviewerId: "usr_expert_01",
        reviewerEmail: "expert.patil@boardphysics.internal",
        reviewerRole: "physics_expert",
        changeReason: changeReason || "Curriculum verification pass against Maharashtra Board Textbook Class 12.",
      }
    );

    if (!result.success) {
      setTransitionError(result.error || "Lifecycle transition failed");
    } else if (result.updatedPackage) {
      setCurrentPkg(result.updatedPackage);
      setChangeReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="indigo">Admin / Content Manager Studio</Badge>
          <Badge variant="outline">Package Version: {currentPkg.version}</Badge>
          <Badge
            variant={
              currentPkg.status === "PUBLISHED"
                ? "success"
                : currentPkg.status === "APPROVED"
                ? "sky"
                : "warning"
            }
          >
            Status: {currentPkg.status}
          </Badge>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Content Studio & Review Workflow</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Strict deterministic publication lifecycle with persisted human-in-the-loop audit trails.
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
          Block Lifecycle & Audit
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
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Chapter Package Publication Gate</h3>
                <p className="text-xs text-muted-foreground">
                  Current Chapter: Chapter {currentPkg.chapterNumber} ({currentPkg.chapterId})
                </p>
              </div>
              <Badge variant="outline" className="font-mono">
                {currentPkg.humanVerified ? "Verified by Expert" : "Verification Required"}
              </Badge>
            </div>

            {transitionError && (
              <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-xl border border-destructive/20 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{transitionError}</span>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-secondary/40 border space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Human Review Verification Input
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Human Reviewer Name / Designation</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Verification Reason / Textbook Cross-check</label>
                  <input
                    type="text"
                    placeholder="e.g. Cross-checked with Class 12 textbook 2024 edition pp. 1-24"
                    value={changeReason}
                    onChange={(e) => setChangeReason(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {currentPkg.status === "HUMAN_REVIEW" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAdvanceLifecycle("APPROVED")}
                    className="rounded-xl gap-1.5 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Approve Chapter Package</span>
                  </Button>
                )}

                {currentPkg.status === "APPROVED" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAdvanceLifecycle("PUBLISHED")}
                    className="rounded-xl gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Publish Official Syllabus Content</span>
                  </Button>
                )}

                {currentPkg.status === "PUBLISHED" && (
                  <Badge variant="success" className="gap-1 py-1 px-3 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Package is Live & Published</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Audit Trail of Human Reviews */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Persisted Review & Verification Audit Log
                </h4>
              </div>
              <div className="space-y-2">
                {currentPkg.reviewHistory.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-card border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">{r.reviewerEmail} ({r.reviewerRole})</span>
                      <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">{r.changeReason}</p>
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center justify-between pt-1">
                      <span>Checksum: {r.checksum}</span>
                      <span>{new Date(r.reviewedAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
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
              AI-generated material is strictly restricted to draft generation inside this Admin Studio via `/api/admin/content-studio/ai-draft`. AI material is NEVER automatically published to student learning views. Mandatory human expert verification and review audit log is strictly enforced prior to publication.
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
