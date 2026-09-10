"use client";

import React from "react";
import { useBookmarks } from "@/features/bookmarks/BookmarksContext";
import { Bookmark, Trash2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-rose-500" />
          <span>Saved Bookmarks</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quick access to bookmarked topics, formulas, questions, and PYQs.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <Card key={bm.id} className="p-4 flex items-center justify-between border-border">
              <div className="flex items-center gap-3">
                <Badge variant="indigo">{bm.type.toUpperCase()}</Badge>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{bm.title}</h4>
                  <span className="text-xs text-muted-foreground">Saved on {new Date(bm.savedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBookmark(bm.targetId)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center space-y-2">
          <Bookmark className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-base">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-muted-foreground">
            Bookmark important topics and formulas while studying.
          </p>
        </Card>
      )}
    </div>
  );
}
