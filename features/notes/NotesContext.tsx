"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface PersonalNoteItem {
  id: string;
  topicId: string;
  blockId?: string;
  topicTitle: string;
  noteText: string;
  highlightText?: string;
  updatedAt: string;
}

interface NotesContextValue {
  notes: PersonalNoteItem[];
  saveNote: (topicId: string, topicTitle: string, noteText: string, blockId?: string, highlightText?: string) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<PersonalNoteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mh_physics_notes_v1");
      if (raw) setNotes(JSON.parse(raw));
    } catch (e) {
      console.error("NotesProvider error", e);
    }
  }, []);

  const saveNote = (
    topicId: string,
    topicTitle: string,
    noteText: string,
    blockId?: string,
    highlightText?: string
  ) => {
    const newNote: PersonalNoteItem = {
      id: `note_${Date.now()}`,
      topicId,
      blockId,
      topicTitle,
      noteText,
      highlightText,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      localStorage.setItem("mh_physics_notes_v1", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("mh_physics_notes_v1", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NotesContext.Provider value={{ notes, saveNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within a NotesProvider");
  return context;
}
