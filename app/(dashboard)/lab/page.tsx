import React from "react";
import { FlaskConical, Sliders, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LabPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-physics-accent">Physics Lab</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive simulation engine & Formula Labs for quantitative physics relationships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3 border-physics-accent/30">
          <Badge variant="sky">Formula Labs</Badge>
          <h3 className="font-bold text-lg">Interactive Parameter Sweeps</h3>
          <p className="text-xs text-muted-foreground">
            Adjust mass, radius, velocity, charges, and magnetic fields to observe live calculations and graphs.
          </p>
        </Card>
        <Card className="p-6 space-y-3 border-physics-accent/30">
          <Badge variant="indigo">HTML5 Simulation Engine</Badge>
          <h3 className="font-bold text-lg">Canvas Animations</h3>
          <p className="text-xs text-muted-foreground">
            Visualize circular motion, fluid dynamics, wave interference, and electromagnetic fields.
          </p>
        </Card>
      </div>
    </div>
  );
}
