import React from "react";
import { CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Tests & Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">Chapter tests, multi-chapter exams, custom tests, and full syllabus mock exams.</p>
      </div>

      <Card className="p-8 text-center space-y-2">
        <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-base">Test Engine Foundation</h3>
        <p className="text-xs text-muted-foreground">Complete all topics in a chapter to unlock its full Chapter Test.</p>
      </Card>
    </div>
  );
}
