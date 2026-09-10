import { describe, it, expect, beforeEach } from "vitest";
import { TutorAdminAuditService } from "@/features/classroom/audit-service";

describe("Phase 9 — Tutor, Admin & Privileged Audit System", () => {
  beforeEach(() => {
    TutorAdminAuditService.clearLogs();
  });

  it("should record structured audit trail for privileged admin mutations", () => {
    const record = TutorAdminAuditService.recordAction(
      "usr_admin_01",
      "admin@boardphysics.internal",
      "admin",
      "PROMOTE_USER_ROLE",
      "user_role",
      "usr_target_student",
      {
        beforeState: { role: "student" },
        afterState: { role: "tutor" },
        reason: "Appointed as verified Physics Lecturer for HSC 2025 batch",
      }
    );

    expect(record.id).toBeTruthy();
    expect(record.actorRole).toBe("admin");
    expect(record.action).toBe("PROMOTE_USER_ROLE");
    expect(record.beforeState?.role).toBe("student");
    expect(record.afterState?.role).toBe("tutor");
    expect(record.reason).toBeTruthy();

    const logs = TutorAdminAuditService.getAuditLogs();
    expect(logs.length).toBe(1);
  });

  it("should reject students from attempting privileged administrative actions", () => {
    expect(() => {
      TutorAdminAuditService.recordAction(
        "usr_student_01",
        "student@school.com",
        "student",
        "PROMOTE_USER_ROLE",
        "user_role",
        "usr_student_01",
        { afterState: { role: "admin" } }
      );
    }).toThrow("Unauthorized");
  });

  it("should record tutor assignment publication and classroom reveal tracking", () => {
    const assignAudit = TutorAdminAuditService.recordAction(
      "usr_tutor_01",
      "tutor.kulkarni@college.ac.in",
      "tutor",
      "CREATE_ASSIGNMENT",
      "assignment",
      "asgn_ch01_01",
      {
        afterState: { chapterId: "ch_01_rotational_dynamics", marks: 25 },
        reason: "Weekly board problem set for Rotational Dynamics",
      }
    );

    expect(assignAudit.actorRole).toBe("tutor");
    expect(assignAudit.entityType).toBe("assignment");
    expect(TutorAdminAuditService.getAuditLogs().length).toBe(1);
  });
});
