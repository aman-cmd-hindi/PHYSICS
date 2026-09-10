import { describe, it, expect, beforeEach } from "vitest";
import { queueOfflineMutation, getOfflineSyncQueue, clearOfflineSyncQueue } from "@/lib/offline/sync-manager";
import { downloadChapterForOffline, isChapterDownloaded } from "@/lib/offline/chapter-downloader";

describe("Offline Architecture & Sync Manager", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("should queue offline progress mutations when network is offline", () => {
    queueOfflineMutation("topic_01", "rotational_dynamics", { score: 90 });
    const queue = getOfflineSyncQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].topicId).toBe("topic_01");
    expect(queue[0].payload.score).toBe(90);
  });

  it("should clear offline sync queue after successful synchronization", () => {
    queueOfflineMutation("topic_01", "rotational_dynamics", { score: 90 });
    expect(getOfflineSyncQueue().length).toBe(1);
    clearOfflineSyncQueue();
    expect(getOfflineSyncQueue().length).toBe(0);
  });

  it("should cache chapter content for explicit offline study", async () => {
    const chapterId = "ch_01_rotational_dynamics";
    const downloadResult = await downloadChapterForOffline(chapterId);
    expect(downloadResult).toBe(true);

    const isDownloaded = isChapterDownloaded(chapterId);
    expect(isDownloaded).toBe(true);
  });
});
