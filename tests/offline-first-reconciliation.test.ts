import { describe, it, expect, beforeEach } from "vitest";
import { IndexedDBStorage } from "@/lib/offline/indexeddb-storage";
import { downloadChapterForOffline, isChapterDownloaded, removeChapterDownload } from "@/lib/offline/chapter-downloader";
import { DurableSyncQueue } from "@/lib/offline/durable-sync-queue";
import { reconcileProgress } from "@/lib/storage/progress-sync";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import { TopicProgress } from "@/lib/storage/types";

describe("Phase 8 — Offline-First Architecture & Durable Mutation Reconciliation", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("should download, verify manifest checksum, and store real chapter package", async () => {
    const chapterId = "ch_01_rotational_dynamics";
    const downloadSuccess = await downloadChapterForOffline(chapterId);
    expect(downloadSuccess).toBe(true);

    const isAvailable = isChapterDownloaded(chapterId);
    expect(isAvailable).toBe(true);

    const manifest = await IndexedDBStorage.getManifest(chapterId);
    expect(manifest).not.toBeNull();
    expect(manifest?.chapterId).toBe(chapterId);
    expect(manifest?.isVerified).toBe(true);
    expect(manifest?.itemCount.formulas).toBeGreaterThan(0);
    expect(manifest?.itemCount.pyqs).toBeGreaterThan(0);
  });

  it("should delete offline chapter and clean storage cleanly", async () => {
    const chapterId = "ch_01_rotational_dynamics";
    await downloadChapterForOffline(chapterId);
    expect(isChapterDownloaded(chapterId)).toBe(true);

    const removeSuccess = await removeChapterDownload(chapterId);
    expect(removeSuccess).toBe(true);
    expect(isChapterDownloaded(chapterId)).toBe(false);
  });

  it("should reconcile offline and cloud progress without loss using union of completed blocks and maximum mastery", async () => {
    const localAdapter = new LocalStorageAdapter();
    // Simulate second adapter as mock cloud
    const cloudStore: Record<string, string> = {};
    const cloudAdapter = {
      async getTopicProgress(id: string) {
        return cloudStore[id] ? JSON.parse(cloudStore[id]) : null;
      },
      async saveTopicProgress(p: TopicProgress) {
        cloudStore[p.topicId] = JSON.stringify(p);
      },
      async getAllProgress() {
        const res: Record<string, TopicProgress> = {};
        for (const [k, v] of Object.entries(cloudStore)) {
          res[k] = JSON.parse(v);
        }
        return res;
      },
      async getResumePosition() { return null; },
      async saveResumePosition() {},
      async clearProgress() {},
    };

    // Local has finished block 1 & 2 offline
    await localAdapter.saveTopicProgress({
      topicId: "topic_rotational_01",
      chapterId: "ch_01_rotational_dynamics",
      status: "in_progress",
      completedBlocks: ["b1", "b2"],
      questionAnswers: {},
      numericalProgress: {},
      masteryScore: 60,
      lastAccessedAt: new Date().toISOString(),
    });

    // Cloud has finished block 3 from another device
    await cloudAdapter.saveTopicProgress({
      topicId: "topic_rotational_01",
      chapterId: "ch_01_rotational_dynamics",
      status: "in_progress",
      completedBlocks: ["b3"],
      questionAnswers: {},
      numericalProgress: {},
      masteryScore: 75,
      lastAccessedAt: new Date(Date.now() - 10000).toISOString(),
    });

    const syncResult = await reconcileProgress(localAdapter, cloudAdapter as any);
    expect(syncResult.success).toBe(true);

    const mergedLocal = await localAdapter.getTopicProgress("topic_rotational_01");
    expect(mergedLocal?.completedBlocks).toContain("b1");
    expect(mergedLocal?.completedBlocks).toContain("b2");
    expect(mergedLocal?.completedBlocks).toContain("b3");
    // Maximum mastery score preserved (75 > 60)
    expect(mergedLocal?.masteryScore).toBe(75);
  });
});
