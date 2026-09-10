const OFFLINE_CHAPTERS_KEY = "mh_physics_offline_chapters_v1";

export interface DownloadProgress {
  chapterId: string;
  progressPercent: number;
  isDownloaded: boolean;
}

export async function downloadChapterForOffline(
  chapterId: string,
  onProgress?: (percent: number) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress(20);
    await new Promise((r) => setTimeout(r, 100));
    if (onProgress) onProgress(60);
    await new Promise((r) => setTimeout(r, 100));
    if (onProgress) onProgress(100);

    const downloaded = getDownloadedChapterIds();
    if (!downloaded.includes(chapterId)) {
      downloaded.push(chapterId);
      if (typeof window !== "undefined") {
        localStorage.setItem(OFFLINE_CHAPTERS_KEY, JSON.stringify(downloaded));
      }
    }
    return true;
  } catch (err) {
    console.error("downloadChapterForOffline error", err);
    return false;
  }
}

export function getDownloadedChapterIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_CHAPTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isChapterDownloaded(chapterId: string): boolean {
  return getDownloadedChapterIds().includes(chapterId);
}
