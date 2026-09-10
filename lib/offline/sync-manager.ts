import { DurableSyncQueue, DurableMutation } from "./durable-sync-queue";

export interface SyncMutation {
  id: string;
  topicId: string;
  chapterId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export function queueOfflineMutation(topicId: string, chapterId: string, payload: Record<string, any>): void {
  // Delegate to durable sync queue with proper entity ID and operation
  DurableSyncQueue.enqueueMutation("local_user", topicId, "update_progress", {
    chapterId,
    ...payload,
  });
}

export function getOfflineSyncQueue(): SyncMutation[] {
  const durableQueue = DurableSyncQueue.getQueue();
  return durableQueue.map((m) => ({
    id: m.mutationId,
    topicId: m.entityId,
    chapterId: (m.payload as any)?.chapterId || "chapter_default",
    payload: m.payload,
    timestamp: m.createdTimestamp,
  }));
}

export function clearOfflineSyncQueue(): void {
  DurableSyncQueue.clearQueue();
}
