import React from "react";
import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Study Notes</h2>
        <p className="text-sm text-muted-foreground mt-1">Your personal topic highlights, notes, and notebook annotations.</p>
      </div>

      <Card className="p-8 text-center space-y-2">
        <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-base">Notes Engine Ready</h3>
        <p className="text-xs text-muted-foreground">Add personal notes directly to topic blocks as you prepare your notebook.</p>
      </Card>
    </div>
  );
}
