import React from "react";
import { Target, CheckCircle2, Award, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PracticePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Practice Engine</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Topic practice, integrated MCQs, guided numerical challenges, and adaptive practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <Badge variant="indigo">MCQ Practice</Badge>
          <h3 className="font-bold text-lg">Topic-wise MCQs</h3>
          <p className="text-xs text-muted-foreground">
            Conceptual & numerical MCQs mapped to specific Maharashtra Board topics.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <Badge variant="sky">Numerical Engine</Badge>
          <h3 className="font-bold text-lg">3-Stage Numericals</h3>
          <p className="text-xs text-muted-foreground">
            Guided → Semi-guided → Stage 3 Exam numerical problem-solving.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <Badge variant="success">Adaptive Practice</Badge>
          <h3 className="font-bold text-lg">Weak Area Recovery</h3>
          <p className="text-xs text-muted-foreground">
            Personalized question recommendations based on past answer performance.
          </p>
        </Card>
      </div>
    </div>
  );
}
