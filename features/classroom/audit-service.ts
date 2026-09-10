export type Role = "student" | "tutor" | "content_manager" | "admin";

export interface AuditRecord {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  entityType: "content_package" | "user_role" | "assignment" | "classroom_session";
  entityId: string;
  beforeState?: Record<string, any> | null;
  afterState?: Record<string, any> | null;
  timestamp: string;
  reason?: string;
}

export interface ClassroomAssignment {
  id: string;
  title: string;
  chapterId: string;
  topicId: string;
  tutorId: string;
  dueDate: string;
  totalMarks: number;
  assignedStudentIds: string[];
  submissionCount: number;
  status: "ACTIVE" | "COMPLETED" | "CLOSED";
}

export class TutorAdminAuditService {
  private static auditLogs: AuditRecord[] = [];

  public static recordAction(
    actorId: string,
    actorEmail: string,
    actorRole: Role,
    action: string,
    entityType: AuditRecord["entityType"],
    entityId: string,
    options: {
      beforeState?: Record<string, any> | null;
      afterState?: Record<string, any> | null;
      reason?: string;
    } = {}
  ): AuditRecord {
    // Non-negotiable security: verify actor is authorized for privileged audit actions
    const privilegedRoles: Role[] = ["tutor", "content_manager", "admin"];
    if (!privilegedRoles.includes(actorRole)) {
      throw new Error(`Unauthorized: Role '${actorRole}' cannot perform privileged administrator operations.`);
    }

    const record: AuditRecord = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorId,
      actorEmail,
      actorRole,
      action,
      entityType,
      entityId,
      beforeState: options.beforeState || null,
      afterState: options.afterState || null,
      timestamp: new Date().toISOString(),
      reason: options.reason,
    };

    this.auditLogs.push(record);
    return record;
  }

  public static getAuditLogs(): AuditRecord[] {
    return [...this.auditLogs];
  }

  public static clearLogs(): void {
    this.auditLogs = [];
  }
}
