"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ClassroomContextValue {
  isTutorMode: boolean;
  isClassroomPresentation: boolean;
  revealedBlockIds: Set<string>;
  toggleTutorMode: () => void;
  toggleClassroomPresentation: () => void;
  revealBlockAnswer: (blockId: string) => void;
  revealAllInTopic: (blockIds: string[]) => void;
}

const ClassroomContext = createContext<ClassroomContextValue | undefined>(undefined);

export function ClassroomProvider({ children }: { children: React.ReactNode }) {
  const [isTutorMode, setIsTutorMode] = useState(false);
  const [isClassroomPresentation, setIsClassroomPresentation] = useState(false);
  const [revealedBlockIds, setRevealedBlockIds] = useState<Set<string>>(new Set());

  const toggleTutorMode = useCallback(() => {
    setIsTutorMode((prev) => !prev);
  }, []);

  const toggleClassroomPresentation = useCallback(() => {
    setIsClassroomPresentation((prev) => {
      const nextState = !prev;
      if (nextState) {
        document.documentElement.classList.add("classroom-mode");
      } else {
        document.documentElement.classList.remove("classroom-mode");
      }
      return nextState;
    });
  }, []);

  const revealBlockAnswer = useCallback((blockId: string) => {
    setRevealedBlockIds((prev) => new Set(prev).add(blockId));
  }, []);

  const revealAllInTopic = useCallback((blockIds: string[]) => {
    setRevealedBlockIds((prev) => {
      const updated = new Set(prev);
      blockIds.forEach((id) => updated.add(id));
      return updated;
    });
  }, []);

  return (
    <ClassroomContext.Provider
      value={{
        isTutorMode,
        isClassroomPresentation,
        revealedBlockIds,
        toggleTutorMode,
        toggleClassroomPresentation,
        revealBlockAnswer,
        revealAllInTopic,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassroom() {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassroom must be used within a ClassroomProvider");
  }
  return context;
}
