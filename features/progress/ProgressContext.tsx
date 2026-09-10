"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { TopicProgress, ResumePosition, ProgressStorageAdapter } from "@/lib/storage/types";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import { SupabaseStorageAdapter } from "@/lib/storage/supabase-storage-adapter";
import { reconcileProgress } from "@/lib/storage/progress-sync";
import { createClient } from "@/lib/supabase/client";

interface ProgressContextValue {
  progressMap: Record<string, TopicProgress>;
  resumePosition: ResumePosition | null;
  isLoading: boolean;
  isCloudSynced: boolean;
  getTopicProgress: (topicId: string) => TopicProgress | undefined;
  updateTopicProgress: (
    topicId: string,
    chapterId: string,
    updates: Partial<TopicProgress>
  ) => Promise<void>;
  updateResumePosition: (chapterId: string, topicId: string, blockId?: string) => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgress>>({});
  const [resumePosition, setResumePosition] = useState<ResumePosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const localAdapter = useMemo(() => new LocalStorageAdapter(), []);
  const cloudAdapter = useMemo(
    () => (userId ? new SupabaseStorageAdapter(userId) : null),
    [userId]
  );

  const activeAdapter: ProgressStorageAdapter = cloudAdapter || localAdapter;

  // Track auth session to determine active adapter
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Initial load & automatic sync on login
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        if (cloudAdapter) {
          // Sync local progress to cloud
          await reconcileProgress(localAdapter, cloudAdapter);
          if (isMounted) setIsCloudSynced(true);
        }

        const all = await activeAdapter.getAllProgress();
        const resume = await activeAdapter.getResumePosition();

        if (isMounted) {
          setProgressMap(all);
          setResumePosition(resume);
        }
      } catch (err) {
        console.error("ProgressProvider: load error", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeAdapter, cloudAdapter, localAdapter]);

  const getTopicProgress = useCallback(
    (topicId: string) => progressMap[topicId],
    [progressMap]
  );

  const updateTopicProgress = useCallback(
    async (topicId: string, chapterId: string, updates: Partial<TopicProgress>) => {
      const existing = progressMap[topicId] || {
        topicId,
        chapterId,
        status: "in_progress",
        completedBlocks: [],
        questionAnswers: {},
        numericalProgress: {},
        masteryScore: 0,
        lastAccessedAt: new Date().toISOString(),
      };

      const updated: TopicProgress = {
        ...existing,
        ...updates,
        topicId,
        chapterId,
        lastAccessedAt: new Date().toISOString(),
      };

      // Optimistic state update
      setProgressMap((prev) => ({ ...prev, [topicId]: updated }));

      // Save via active adapter
      await activeAdapter.saveTopicProgress(updated);

      // Always update local storage as backup cache
      if (cloudAdapter) {
        await localAdapter.saveTopicProgress(updated);
      }
    },
    [progressMap, activeAdapter, cloudAdapter, localAdapter]
  );

  const updateResumePosition = useCallback(
    async (chapterId: string, topicId: string, blockId?: string) => {
      const pos: ResumePosition = {
        chapterId,
        topicId,
        blockId,
        updatedAt: new Date().toISOString(),
      };

      setResumePosition(pos);
      await activeAdapter.saveResumePosition(pos);

      if (cloudAdapter) {
        await localAdapter.saveResumePosition(pos);
      }
    },
    [activeAdapter, cloudAdapter, localAdapter]
  );

  const syncWithCloud = useCallback(async () => {
    if (cloudAdapter) {
      setIsLoading(true);
      await reconcileProgress(localAdapter, cloudAdapter);
      const all = await activeAdapter.getAllProgress();
      const resume = await activeAdapter.getResumePosition();
      setProgressMap(all);
      setResumePosition(resume);
      setIsLoading(false);
      setIsCloudSynced(true);
    }
  }, [cloudAdapter, localAdapter, activeAdapter]);

  return (
    <ProgressContext.Provider
      value={{
        progressMap,
        resumePosition,
        isLoading,
        isCloudSynced,
        getTopicProgress,
        updateTopicProgress,
        updateResumePosition,
        syncWithCloud,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
