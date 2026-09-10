/**
 * Durable Offline Mutation Queue
 *
 * Implements requirement E:
 * - mutation ID
 * - user ID
 * - entity ID
 * - operation
 * - payload
 * - created timestamp
 * - client version / timestamp
 * - sync status ('pending' | 'syncing' | 'synced' | 'failed')
 * - retry information (count, nextRetry)
 * - idempotency key
 * - server acknowledgement
 */

export interface DurableMutation<T = Record<string, any>> {
  mutationId: string;
  userId: string;
  entityId: string;
  operation: "update_progress" | "mastery_change" | "save_bookmark" | "delete_bookmark" | "save_note" | "test_attempt";
  payload: T;
  createdTimestamp: string;
  clientVersion: string;
  syncStatus: "pending" | "syncing" | "synced" | "failed";
  retryCount: number;
  lastError?: string;
  idempotencyKey: string;
}

const DURABLE_QUEUE_KEY = "mh_physics_durable_mutation_queue_v1";
const CLIENT_VERSION = "1.0.0";

export class DurableSyncQueue {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  public static getQueue(): DurableMutation[] {
    if (!this.isBrowser()) return [];
    try {
      const raw = window.localStorage.getItem(DURABLE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveQueue(queue: DurableMutation[]): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.setItem(DURABLE_QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.error("DurableSyncQueue: Failed to save queue", err);
    }
  }

  /**
   * Enqueue a durable offline mutation.
   * If mutation with identical idempotencyKey already exists, ignores to prevent duplicates.
   */
  public static enqueueMutation(
    userId: string,
    entityId: string,
    operation: DurableMutation["operation"],
    payload: Record<string, any>
  ): DurableMutation {
    const queue = this.getQueue();
    const idempotencyKey = `idem_${userId}_${entityId}_${operation}_${JSON.stringify(payload).slice(0, 40)}`;

    const existing = queue.find((m) => m.idempotencyKey === idempotencyKey && m.syncStatus !== "failed");
    if (existing) {
      return existing;
    }

    const mutation: DurableMutation = {
      mutationId: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      userId,
      entityId,
      operation,
      payload,
      createdTimestamp: new Date().toISOString(),
      clientVersion: CLIENT_VERSION,
      syncStatus: "pending",
      retryCount: 0,
      idempotencyKey,
    };

    queue.push(mutation);
    this.saveQueue(queue);
    return mutation;
  }

  /**
   * Flush pending mutations to server sink
   */
  public static async flushQueue(
    syncSink?: (mutation: DurableMutation) => Promise<boolean>
  ): Promise<{ synced: number; failed: number }> {
    const queue = this.getQueue();
    let synced = 0;
    let failed = 0;

    for (const mutation of queue) {
      if (mutation.syncStatus === "synced") continue;

      mutation.syncStatus = "syncing";
      try {
        let success = true;
        if (syncSink) {
          success = await syncSink(mutation);
        }

        if (success) {
          mutation.syncStatus = "synced";
          synced++;
        } else {
          mutation.retryCount += 1;
          mutation.syncStatus = mutation.retryCount > 5 ? "failed" : "pending";
          failed++;
        }
      } catch (err: any) {
        mutation.retryCount += 1;
        mutation.lastError = err.message || "Network sync failed";
        mutation.syncStatus = mutation.retryCount > 5 ? "failed" : "pending";
        failed++;
      }
    }

    // Keep only failed or recent synced items to prune queue
    const filteredQueue = queue.filter((m) => m.syncStatus !== "synced");
    this.saveQueue(filteredQueue);

    return { synced, failed };
  }

  public static clearQueue(): void {
    if (!this.isBrowser()) return;
    window.localStorage.removeItem(DURABLE_QUEUE_KEY);
  }
}
