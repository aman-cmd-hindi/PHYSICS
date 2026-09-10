const SYNC_QUEUE_KEY = "mh_physics_sync_queue_v1";

export interface SyncMutation {
  id: string;
  topicId: string;
  chapterId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export function queueOfflineMutation(topicId: string, chapterId: string, payload: Record<string, any>): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncMutation[] = raw ? JSON.parse(raw) : [];

    const mutation: SyncMutation = {
      id: `mut_${Date.now()}`,
      topicId,
      chapterId,
      payload,
      timestamp: new Date().toISOString(),
    };

    queue.push(mutation);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error("queueOfflineMutation error", err);
  }
}

export function getOfflineSyncQueue(): SyncMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineSyncQueue(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SYNC_QUEUE_KEY);
}
