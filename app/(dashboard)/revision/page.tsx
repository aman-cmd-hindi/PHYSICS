import React from "react";
import { RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function RevisionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Revision Center</h2>
        <p className="text-sm text-muted-foreground mt-1">Spaced repetition, weak-topic recovery, and exam countdown revision.</p>
      </div>

      <Card className="p-8 text-center space-y-2">
        <RotateCcw className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-base">Revision Engine Foundation</h3>
        <p className="text-xs text-muted-foreground">Topics completed will be scheduled for timed revision cycles automatically.</p>
      </Card>
    </div>
  );
}
