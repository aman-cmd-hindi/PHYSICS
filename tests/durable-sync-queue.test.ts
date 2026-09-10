import { describe, it, expect, beforeEach } from "vitest";
import { DurableSyncQueue } from "@/lib/offline/durable-sync-queue";

describe("Durable Sync Queue & Idempotency", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("should enqueue mutation with unique mutationId, client timestamp, and status pending", () => {
    const mut = DurableSyncQueue.enqueueMutation("usr_student_1", "topic_01", "update_progress", {
      score: 95,
    });

    expect(mut.mutationId).toBeTruthy();
    expect(mut.syncStatus).toBe("pending");
    expect(mut.retryCount).toBe(0);
    expect(mut.clientVersion).toBe("1.0.0");

    const queue = DurableSyncQueue.getQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].mutationId).toBe(mut.mutationId);
  });

  it("should enforce idempotency and not create duplicate mutations for identical operation and payload", () => {
    DurableSyncQueue.enqueueMutation("usr_student_1", "topic_01", "update_progress", {
      score: 95,
    });
    // Duplicate enqueue
    DurableSyncQueue.enqueueMutation("usr_student_1", "topic_01", "update_progress", {
      score: 95,
    });

    const queue = DurableSyncQueue.getQueue();
    expect(queue.length).toBe(1);
  });

  it("should flush pending mutations cleanly and handle retry increments on failure", async () => {
    DurableSyncQueue.enqueueMutation("usr_student_1", "topic_01", "update_progress", {
      score: 95,
    });

    // Mock failing sink
    const failResult = await DurableSyncQueue.flushQueue(async () => false);
    expect(failResult.failed).toBe(1);
    expect(DurableSyncQueue.getQueue()[0].retryCount).toBe(1);

    // Mock successful sink
    const successResult = await DurableSyncQueue.flushQueue(async () => true);
    expect(successResult.synced).toBe(1);
    // Synced mutations pruned from queue
    expect(DurableSyncQueue.getQueue().length).toBe(0);
  });
});
