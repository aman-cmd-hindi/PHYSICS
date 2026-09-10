import { ProgressStorageAdapter, TopicProgress, ResumePosition } from "./types";

const PROGRESS_STORAGE_KEY = "mh_physics_progress_v1";
const RESUME_STORAGE_KEY = "mh_physics_resume_v1";

export class LocalStorageAdapter implements ProgressStorageAdapter {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  async getTopicProgress(topicId: string): Promise<TopicProgress | null> {
    const all = await this.getAllProgress();
    return all[topicId] || null;
  }

  async saveTopicProgress(progress: TopicProgress): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const all = await this.getAllProgress();
      all[progress.topicId] = {
        ...progress,
        lastAccessedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));
    } catch (error) {
      console.error("LocalStorageAdapter: Failed to save topic progress", error);
    }
  }

  async getAllProgress(): Promise<Record<string, TopicProgress>> {
    if (!this.isBrowser()) return {};

    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (error) {
      console.error("LocalStorageAdapter: Failed to read progress", error);
      return {};
    }
  }

  async getResumePosition(): Promise<ResumePosition | null> {
    if (!this.isBrowser()) return null;

    try {
      const raw = window.localStorage.getItem(RESUME_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error("LocalStorageAdapter: Failed to read resume position", error);
      return null;
    }
  }

  async saveResumePosition(pos: ResumePosition): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      const updated: ResumePosition = {
        ...pos,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("LocalStorageAdapter: Failed to save resume position", error);
    }
  }

  async clearProgress(): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      window.localStorage.removeItem(RESUME_STORAGE_KEY);
    } catch (error) {
      console.error("LocalStorageAdapter: Failed to clear progress", error);
    }
  }
}
