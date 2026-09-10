import React from "react";
import { Calculator, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FormulasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Formula Bank</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Master formulas, SI units, dimensional formulas, and quantitative derivations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <Badge variant="indigo">Formula Catalog</Badge>
          <h3 className="font-bold text-base">Formula Directory</h3>
          <p className="text-xs text-muted-foreground">Search and revise formulas chapter by chapter.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <Badge variant="warning">Derivation Practice</Badge>
          <h3 className="font-bold text-base">Stepwise Derivations</h3>
          <p className="text-xs text-muted-foreground">Practice key board derivations and proofs.</p>
        </Card>
        <Card className="p-6 space-y-2">
          <Badge variant="sky">Units & Dimensions</Badge>
          <h3 className="font-bold text-base">SI Units & Constants</h3>
          <p className="text-xs text-muted-foreground">Master SI units, symbols, and physical constants.</p>
        </Card>
      </div>
    </div>
  );
}
