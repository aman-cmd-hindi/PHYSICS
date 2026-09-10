"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface BookmarkItem {
  id: string;
  type: "topic" | "formula" | "question" | "pyq" | "slide";
  title: string;
  targetId: string;
  chapterNumber?: number;
  savedAt: string;
}

interface BookmarksContextValue {
  bookmarks: BookmarkItem[];
  addBookmark: (item: Omit<BookmarkItem, "id" | "savedAt">) => void;
  removeBookmark: (targetId: string) => void;
  isBookmarked: (targetId: string) => boolean;
}

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mh_physics_bookmarks_v1");
      if (raw) setBookmarks(JSON.parse(raw));
    } catch (e) {
      console.error("BookmarksProvider error", e);
    }
  }, []);

  const addBookmark = (item: Omit<BookmarkItem, "id" | "savedAt">) => {
    const newBookmark: BookmarkItem = {
      ...item,
      id: `bm_${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    setBookmarks((prev) => {
      const updated = [newBookmark, ...prev];
      localStorage.setItem("mh_physics_bookmarks_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const removeBookmark = (targetId: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.targetId !== targetId);
      localStorage.setItem("mh_physics_bookmarks_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (targetId: string) => bookmarks.some((b) => b.targetId === targetId);

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error("useBookmarks must be used within a BookmarksProvider");
  return context;
}
