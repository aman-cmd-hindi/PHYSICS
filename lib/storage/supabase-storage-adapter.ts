import { ProgressStorageAdapter, TopicProgress, ResumePosition } from "./types";
import { createClient } from "@/lib/supabase/client";

export class SupabaseStorageAdapter implements ProgressStorageAdapter {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async getTopicProgress(topicId: string): Promise<TopicProgress | null> {
    const supabase = createClient();
    const { data, error } = await (supabase as any)
      .from("user_progress")
      .select("*")
      .eq("user_id", this.userId)
      .eq("topic_id", topicId)
      .single();

    if (error || !data) return null;

    return {
      topicId: data.topic_id,
      chapterId: data.chapter_id,
      status: data.status,
      completedBlocks: (data.completed_blocks as string[]) || [],
      questionAnswers: (data.question_answers as Record<string, any>) || {},
      numericalProgress: (data.numerical_progress as Record<string, any>) || {},
      masteryScore: Number(data.mastery_score) || 0,
      lastAccessedAt: data.last_accessed_at,
    };
  }

  async saveTopicProgress(progress: TopicProgress): Promise<void> {
    const supabase = createClient();
    const payload = {
      user_id: this.userId,
      topic_id: progress.topicId,
      chapter_id: progress.chapterId,
      status: progress.status,
      completed_blocks: progress.completedBlocks,
      question_answers: progress.questionAnswers,
      numerical_progress: progress.numericalProgress,
      mastery_score: progress.masteryScore,
      last_accessed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await (supabase as any)
      .from("user_progress")
      .upsert(payload, { onConflict: "user_id,topic_id" });

    if (error) {
      console.error("SupabaseStorageAdapter: Failed to save topic progress", error);
    }
  }

  async getAllProgress(): Promise<Record<string, TopicProgress>> {
    const supabase = createClient();
    const { data, error } = await (supabase as any)
      .from("user_progress")
      .select("*")
      .eq("user_id", this.userId);

    if (error || !data) return {};

    const result: Record<string, TopicProgress> = {};
    for (const item of data as any[]) {
      result[item.topic_id] = {
        topicId: item.topic_id,
        chapterId: item.chapter_id,
        status: item.status,
        completedBlocks: (item.completed_blocks as string[]) || [],
        questionAnswers: (item.question_answers as Record<string, any>) || {},
        numericalProgress: (item.numerical_progress as Record<string, any>) || {},
        masteryScore: Number(item.mastery_score) || 0,
        lastAccessedAt: item.last_accessed_at,
      };
    }
    return result;
  }

  async getResumePosition(): Promise<ResumePosition | null> {
    const supabase = createClient();
    const { data, error } = await (supabase as any)
      .from("resume_positions")
      .select("*")
      .eq("user_id", this.userId)
      .single();

    if (error || !data) return null;

    return {
      chapterId: data.chapter_id,
      topicId: data.topic_id,
      blockId: data.block_id || undefined,
      updatedAt: data.updated_at,
    };
  }

  async saveResumePosition(pos: ResumePosition): Promise<void> {
    const supabase = createClient();
    const { error } = await (supabase as any).from("resume_positions").upsert({
      user_id: this.userId,
      chapter_id: pos.chapterId,
      topic_id: pos.topicId,
      block_id: pos.blockId || null,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("SupabaseStorageAdapter: Failed to save resume position", error);
    }
  }

  async clearProgress(): Promise<void> {
    const supabase = createClient();
    await (supabase as any).from("user_progress").delete().eq("user_id", this.userId);
    await (supabase as any).from("resume_positions").delete().eq("user_id", this.userId);
  }
}
