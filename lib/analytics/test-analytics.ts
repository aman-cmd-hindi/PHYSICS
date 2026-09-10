import { trackEvent } from "./events";

export interface TestSessionAnalytics {
  testId: string;
  testTitle: string;
  earnedMarks: number;
  maxMarks: number;
  accuracyPercent: number;
  durationSpentSeconds: number;
  timestamp: string;
}

const TEST_ANALYTICS_KEY = "mh_physics_test_analytics_v1";

export function logTestSessionResult(session: Omit<TestSessionAnalytics, "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(TEST_ANALYTICS_KEY);
    const sessions: TestSessionAnalytics[] = raw ? JSON.parse(raw) : [];

    const newSession: TestSessionAnalytics = {
      ...session,
      timestamp: new Date().toISOString(),
    };

    const updated = [newSession, ...sessions].slice(0, 50);
    localStorage.setItem(TEST_ANALYTICS_KEY, JSON.stringify(updated));

    trackEvent({
      eventType: "topic_mastery",
      topicId: session.testId,
      masteryScore: session.accuracyPercent,
    });
  } catch (err) {
    console.error("logTestSessionResult: Error saving session analytics", err);
  }
}
