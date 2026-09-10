import React from "react";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function BookmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Saved Bookmarks</h2>
        <p className="text-sm text-muted-foreground mt-1">Quick access to bookmarked topics, formulas, and numericals.</p>
      </div>

      <Card className="p-8 text-center space-y-2">
        <Bookmark className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-semibold text-base">No Bookmarks Saved Yet</h3>
        <p className="text-xs text-muted-foreground">Bookmark important lesson blocks and questions while studying.</p>
      </Card>
    </div>
  );
}
