import { OFFICIAL_CHAPTERS_MANIFEST } from "@/content/manifest";
import { VERIFIED_PHYSICS_FORMULAS } from "@/content/data/formulas";
import { VERIFIED_PYQS_CATALOG } from "@/content/data/pyqs";
import { IndexedDBStorage, OfflineChapterManifest } from "./indexeddb-storage";

const OFFLINE_CHAPTERS_KEY = "mh_physics_offline_chapters_v1";

export interface DownloadProgress {
  chapterId: string;
  progressPercent: number;
  isDownloaded: boolean;
  statusMessage?: string;
}

/**
 * Downloads and verifies chapter content for real local-first offline availability.
 * Non-negotiable: No setTimeout, no mock promises, no fake progress.
 * Pulls deterministic curriculum data and persists directly to IndexedDB.
 */
export async function downloadChapterForOffline(
  chapterId: string,
  onProgress?: (percent: number) => void
): Promise<boolean> {
  try {
    const chapter = OFFICIAL_CHAPTERS_MANIFEST.find((c) => c.id === chapterId);
    if (!chapter) {
      throw new Error(`Invalid chapter ID: ${chapterId}`);
    }

    if (onProgress) onProgress(10);

    // 1. Gather verified formulas and PYQs for this chapter
    const formulas = VERIFIED_PHYSICS_FORMULAS.filter((f) => f.chapterId === chapterId);
    if (onProgress) onProgress(40);

    const pyqs = VERIFIED_PYQS_CATALOG.filter((p) => p.chapterId === chapterId);
    if (onProgress) onProgress(70);

    // 2. Persist real content into local-first storage
    const manifest = await IndexedDBStorage.saveChapterPackage(chapter, formulas, pyqs);

    // 3. Update localStorage manifest list for fast synchronous state checks
    if (typeof window !== "undefined") {
      const downloaded = getDownloadedChapterIds();
      if (!downloaded.includes(chapterId)) {
        downloaded.push(chapterId);
        window.localStorage.setItem(OFFLINE_CHAPTERS_KEY, JSON.stringify(downloaded));
      }
    }

    if (onProgress) onProgress(100);

    // 4. Verify that manifest exists and is marked verified
    return manifest.isVerified;
  } catch (err) {
    console.error("downloadChapterForOffline error", err);
    return false;
  }
}

export function getDownloadedChapterIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(OFFLINE_CHAPTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isChapterDownloaded(chapterId: string): boolean {
  return getDownloadedChapterIds().includes(chapterId);
}

export async function removeChapterDownload(chapterId: string): Promise<boolean> {
  try {
    await IndexedDBStorage.deleteDownloadedChapter(chapterId);
    if (typeof window !== "undefined") {
      const downloaded = getDownloadedChapterIds().filter((id) => id !== chapterId);
      window.localStorage.setItem(OFFLINE_CHAPTERS_KEY, JSON.stringify(downloaded));
    }
    return true;
  } catch (err) {
    console.error("removeChapterDownload error", err);
    return false;
  }
}
