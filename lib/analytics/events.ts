export interface LearningAnalyticsEvent {
  id: string;
  eventType: 'question_attempt' | 'numerical_step' | 'topic_mastery' | 'topic_opened';
  questionId?: string;
  topicId: string;
  isCorrect?: boolean;
  attemptNumber?: number;
  masteryScore?: number;
  timestamp: string;
}

const ANALYTICS_STORAGE_KEY = "mh_physics_analytics_events_v1";

export function trackEvent(event: Omit<LearningAnalyticsEvent, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const events: LearningAnalyticsEvent[] = raw ? JSON.parse(raw) : [];

    const newEvent: LearningAnalyticsEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    // Keep max 200 events locally to avoid bloating localStorage
    const updated = [newEvent, ...events].slice(0, 200);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("trackEvent: Error logging event", err);
  }
}

export function trackQuestionAttempt(
  questionId: string,
  topicId: string,
  isCorrect: boolean,
  attemptNumber: number
): void {
  trackEvent({
    eventType: "question_attempt",
    questionId,
    topicId,
    isCorrect,
    attemptNumber,
  });
}

export function trackTopicMastery(topicId: string, masteryScore: number): void {
  trackEvent({
    eventType: "topic_mastery",
    topicId,
    masteryScore,
  });
}

export function getRecordedEvents(): LearningAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
