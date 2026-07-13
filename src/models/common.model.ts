// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Models: Common Types & Enums
// ─────────────────────────────────────────────────────────────────────────────

export enum UserRole {
  FACULTY = 'FACULTY',
  HOD = 'HOD',
  DIRECTOR = 'DIRECTOR',
  PVC = 'PVC',
  IQAC = 'IQAC',
  ADMIN = 'ADMIN',
}

export enum DeliverableType {
  ASSIGNMENT = 'ASSIGNMENT',
  QUIZ = 'QUIZ',
  PROJECT = 'PROJECT',
  PRESENTATION = 'PRESENTATION',
  LAB_REPORT = 'LAB_REPORT',
  CASE_STUDY = 'CASE_STUDY',
  VIVA = 'VIVA',
  EXAM = 'EXAM',
}

export enum DeliverableStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  LATE = 'LATE',
  GRADED = 'GRADED',
  RESUBMIT_REQUESTED = 'RESUBMIT_REQUESTED',
}

export enum FeedbackType {
  COURSE = 'COURSE',
  FACULTY = 'FACULTY',
  SESSION = 'SESSION',
  DELIVERABLE = 'DELIVERABLE',
}

export enum FeedbackStatus {
  PENDING = 'PENDING',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PaginationOptions {
  limit?: number;
  lastKey?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  lastKey?: string;
  count: number;
}

export interface AuthorizerContext {
  facultyId: string;
  role: UserRole;
  campus: string;
  department: string;
  userId: string;
}
