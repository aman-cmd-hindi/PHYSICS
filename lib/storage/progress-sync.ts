import { ProgressStorageAdapter, TopicProgress } from "./types";

export interface SyncResult {
  syncedTopicCount: number;
  mergedCount: number;
  success: boolean;
}

export async function reconcileProgress(
  localAdapter: ProgressStorageAdapter,
  cloudAdapter: ProgressStorageAdapter
): Promise<SyncResult> {
  try {
    const localAll = await localAdapter.getAllProgress();
    const cloudAll = await cloudAdapter.getAllProgress();

    const merged: Record<string, TopicProgress> = { ...cloudAll };
    let mergedCount = 0;

    for (const [topicId, localProg] of Object.entries(localAll)) {
      const cloudProg = cloudAll[topicId];

      if (!cloudProg) {
        merged[topicId] = localProg;
        mergedCount++;
      } else {
        // Non-destructive merge: take union of completed blocks & question answers, highest status
        const mergedBlocks = Array.from(
          new Set([...localProg.completedBlocks, ...cloudProg.completedBlocks])
        );

        const mergedAnswers = {
          ...cloudProg.questionAnswers,
          ...localProg.questionAnswers,
        };

        const mergedNumericals = {
          ...cloudProg.numericalProgress,
          ...localProg.numericalProgress,
        };

        const statusRank = { completed: 3, in_progress: 2, not_started: 1 };
        const status =
          statusRank[localProg.status] > statusRank[cloudProg.status]
            ? localProg.status
            : cloudProg.status;

        const masteryScore = Math.max(localProg.masteryScore, cloudProg.masteryScore);

        const lastAccessedAt =
          new Date(localProg.lastAccessedAt) > new Date(cloudProg.lastAccessedAt)
            ? localProg.lastAccessedAt
            : cloudProg.lastAccessedAt;

        merged[topicId] = {
          topicId,
          chapterId: localProg.chapterId || cloudProg.chapterId,
          status,
          completedBlocks: mergedBlocks,
          questionAnswers: mergedAnswers,
          numericalProgress: mergedNumericals,
          masteryScore,
          lastAccessedAt,
        };
        mergedCount++;
      }
    }

    // Write merged results to both adapters to keep them synchronized
    for (const prog of Object.values(merged)) {
      await cloudAdapter.saveTopicProgress(prog);
      await localAdapter.saveTopicProgress(prog);
    }

    // Sync resume position
    const localResume = await localAdapter.getResumePosition();
    const cloudResume = await cloudAdapter.getResumePosition();

    if (localResume && (!cloudResume || new Date(localResume.updatedAt) > new Date(cloudResume.updatedAt))) {
      await cloudAdapter.saveResumePosition(localResume);
    } else if (cloudResume) {
      await localAdapter.saveResumePosition(cloudResume);
    }

    return {
      syncedTopicCount: Object.keys(merged).length,
      mergedCount,
      success: true,
    };
  } catch (error) {
    console.error("reconcileProgress: Failed to sync progress", error);
    return {
      syncedTopicCount: 0,
      mergedCount: 0,
      success: false,
    };
  }
}
