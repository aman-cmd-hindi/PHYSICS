"use client";

import React, { useState } from "react";
import { useNotes } from "@/features/notes/NotesContext";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  const { notes, saveNote, deleteNote } = useNotes();
  const [newNoteText, setNewNoteText] = useState("");
  const [topicTitle, setTopicTitle] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    saveNote("general_topic", topicTitle || "General Physics Note", newNoteText);
    setNewNoteText("");
    setTopicTitle("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span>Personal Study Notes & Highlights</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal topic highlights, notes, and notebook annotations.
        </p>
      </div>

      {/* Add Note Form */}
      <Card className="p-4 border-border space-y-3">
        <h3 className="font-bold text-sm text-foreground">Add New Personal Note</h3>
        <form onSubmit={handleAddNote} className="space-y-3">
          <input
            type="text"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            placeholder="Topic Title (e.g. Torque & Moment of Inertia)"
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground outline-none"
          />
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Type your study note or formula derivation observation..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs text-foreground outline-none"
          />
          <Button type="submit" size="sm" className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            <span>Save Note</span>
          </Button>
        </form>
      </Card>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id} className="p-4 flex items-start justify-between border-border space-y-1">
              <div>
                <span className="font-bold text-sm text-foreground block">{note.topicTitle}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{note.noteText}</p>
                <span className="text-[10px] text-muted-foreground block mt-2">
                  Saved on {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNote(note.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center space-y-2">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
            <h3 className="font-semibold text-base">No Personal Notes Added Yet</h3>
            <p className="text-xs text-muted-foreground">
              Add study notes to organize your physics notebook preparation.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
