import React from "react";
import { BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Analytics & Progress</h2>
        <p className="text-sm text-muted-foreground mt-1">Topic mastery, MCQ accuracy, numerical completion, and test trends.</p>
      </div>

      <Card className="p-8 text-center space-y-2">
        <BarChart2 className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-base">Analytics Engine Ready</h3>
        <p className="text-xs text-muted-foreground">Mastery breakdown and accuracy trends will appear as you complete topics.</p>
      </Card>
    </div>
  );
}
