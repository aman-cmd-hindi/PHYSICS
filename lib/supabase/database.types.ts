export type UserRole = 'student' | 'tutor' | 'admin/content_manager';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgressRow {
  id: string;
  user_id: string;
  topic_id: string;
  chapter_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_blocks: string[];
  question_answers: Record<string, any>;
  numerical_progress: Record<string, any>;
  mastery_score: number;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ResumePositionRow {
  user_id: string;
  chapter_id: string;
  topic_id: string;
  block_id: string | null;
  updated_at: string;
}

export interface UserBookmarkRow {
  id: string;
  user_id: string;
  chapter_id: string;
  topic_id: string;
  block_id: string | null;
  title: string;
  note: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
      };
      user_progress: {
        Row: UserProgressRow;
        Insert: Partial<UserProgressRow> & { user_id: string; topic_id: string; chapter_id: string };
        Update: Partial<UserProgressRow>;
      };
      resume_positions: {
        Row: ResumePositionRow;
        Insert: ResumePositionRow;
        Update: Partial<ResumePositionRow>;
      };
      user_bookmarks: {
        Row: UserBookmarkRow;
        Insert: Omit<UserBookmarkRow, 'id' | 'created_at'>;
        Update: Partial<UserBookmarkRow>;
      };
    };
  };
}
