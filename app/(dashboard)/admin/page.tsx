import React from "react";
import { Shield, FileCheck, Eye, Upload, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="indigo">Admin / Content Manager</Badge>
          <Badge variant="outline">Pipeline v1.0</Badge>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Content Studio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Author, verify, preview, version, and publish official Maharashtra Board syllabus packages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <Badge variant="secondary">1. Ingestion</Badge>
          <h3 className="font-bold text-base">Source Ingestion</h3>
          <p className="text-xs text-muted-foreground">Import verified syllabus notes & diagrams.</p>
        </Card>
        <Card className="p-5 space-y-2">
          <Badge variant="warning">2. AI Assistance</Badge>
          <h3 className="font-bold text-base">Admin Draft (Optional)</h3>
          <p className="text-xs text-muted-foreground">Admin-only drafting assistant. Requires human review.</p>
        </Card>
        <Card className="p-5 space-y-2">
          <Badge variant="sky">3. Verification</Badge>
          <h3 className="font-bold text-base">Human Verification</h3>
          <p className="text-xs text-muted-foreground">Audit notation, units, sign conventions & formulas.</p>
        </Card>
        <Card className="p-5 space-y-2">
          <Badge variant="success">4. Publishing</Badge>
          <h3 className="font-bold text-base">Versioned Publish</h3>
          <p className="text-xs text-muted-foreground">Publish immutable packages without breaking student progress.</p>
        </Card>
      </div>
    </div>
  );
}
