import React from "react";
import { FileQuestion, Calendar, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PYQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">PYQ Bank</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Previous Years Board Examination Questions with official marking schemes and solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-2">
          <Badge variant="indigo">Topic-Integrated PYQs</Badge>
          <h3 className="font-bold text-lg">Chapter & Topic Mapping</h3>
          <p className="text-xs text-muted-foreground">
            Filter PYQs by chapter, topic, marks weightage (1M, 2M, 3M, 4M), and exam year.
          </p>
        </Card>
        <Card className="p-6 space-y-2">
          <Badge variant="sky">Board Solution Schemes</Badge>
          <h3 className="font-bold text-lg">Stepwise Marking Schemes</h3>
          <p className="text-xs text-muted-foreground">
            Learn exact board step-by-step scoring criteria, sign conventions, and final units.
          </p>
        </Card>
      </div>
    </div>
  );
}
