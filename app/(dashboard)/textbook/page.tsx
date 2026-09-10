import React from "react";
import { Book, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TextbookPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="warning">Tutor Access Only</Badge>
          <Badge variant="outline">Authorized Content Mapping</Badge>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Textbook Viewer</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Authorized Maharashtra Board textbook page references linked to curriculum topics.
        </p>
      </div>

      <Card className="p-8 text-center space-y-3">
        <Book className="h-10 w-10 text-primary mx-auto opacity-80" />
        <h3 className="text-xl font-bold">Textbook Mapping Engine Ready</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Topics maintain exact textbook page range mappings. Embedded PDF/page rendering activates cleanly when authorized textbook assets are loaded into the platform.
        </p>
      </Card>
    </div>
  );
}
