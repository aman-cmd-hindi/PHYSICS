import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageAdapter } from "@/lib/storage/local-storage-adapter";
import { reconcileProgress } from "@/lib/storage/progress-sync";
import { TopicProgress, ResumePosition } from "@/lib/storage/types";

// Mock localStorage in JSDOM
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("LocalStorageAdapter", () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    window.localStorage.clear();
    adapter = new LocalStorageAdapter();
  });

  it("should return null for non-existent topic progress", async () => {
    const prog = await adapter.getTopicProgress("topic_1");
    expect(prog).toBeNull();
  });

  it("should save and retrieve topic progress cleanly", async () => {
    const sample: TopicProgress = {
      topicId: "topic_1",
      chapterId: "ch_01",
      status: "in_progress",
      completedBlocks: ["block_1"],
      questionAnswers: {},
      numericalProgress: {},
      masteryScore: 50,
      lastAccessedAt: new Date().toISOString(),
    };

    await adapter.saveTopicProgress(sample);
    const retrieved = await adapter.getTopicProgress("topic_1");

    expect(retrieved).not.toBeNull();
    expect(retrieved?.topicId).toBe("topic_1");
    expect(retrieved?.status).toBe("in_progress");
    expect(retrieved?.completedBlocks).toEqual(["block_1"]);
  });

  it("should save and retrieve resume position correctly", async () => {
    const pos: ResumePosition = {
      chapterId: "ch_01",
      topicId: "topic_1",
      blockId: "block_2",
      updatedAt: new Date().toISOString(),
    };

    await adapter.saveResumePosition(pos);
    const retrieved = await adapter.getResumePosition();

    expect(retrieved).not.toBeNull();
    expect(retrieved?.chapterId).toBe("ch_01");
    expect(retrieved?.topicId).toBe("topic_1");
  });
});
