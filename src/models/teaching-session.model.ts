// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: TeachingSession
// Covers: Timetable, Lesson Plans, Attendance, Teaching Load
// Single-table design:
//   LESSON_PLAN:
//     PK = LESSON_PLAN#{planId}    SK = METADATA
//     GSI1PK = FACULTY#{facultyId} GSI1SK = LESSON_PLAN#{courseCode}#{date}
//
//   ATTENDANCE:
//     PK = ATTENDANCE#{sessionId}  SK = STUDENT#{studentId}
//     GSI1PK = FACULTY#{facultyId} GSI1SK = ATTENDANCE#{courseCode}#{date}
//
//   SESSION:
//     PK = SESSION#{sessionId}     SK = METADATA
//     GSI1PK = FACULTY#{facultyId} GSI1SK = SESSION#{date}
// ─────────────────────────────────────────────────────────────────────────────

import { AttendanceStatus, AuditFields, DayOfWeek, SessionStatus } from './common.model';

// ── Lesson Plan ───────────────────────────────────────────────────────────────

export interface TopicCoverage {
  topicId: string;
  title: string;
  description: string;
  duration: number; // minutes
  learningOutcomes: string[];
  teachingMethods: string[];
  resources?: string[];
}

export interface LessonPlan extends AuditFields {
  planId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;

  date: string;
  weekNumber: number;
  sessionNumber: number;
  duration: number; // minutes

  objectives: string[];
  topics: TopicCoverage[];
  assessmentStrategy?: string;
  teachingAids?: string[];
  homework?: string;
  notes?: string;
}

export const LessonPlanKeys = {
  pk: (id: string) => `LESSON_PLAN#${id}`,
  sk: () => 'METADATA',
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (courseCode: string, date: string) =>
    `LESSON_PLAN#${courseCode}#${date}`,
};

export interface CreateLessonPlanDto {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  date: string;
  weekNumber: number;
  sessionNumber: number;
  duration: number;
  objectives: string[];
  topics: TopicCoverage[];
  assessmentStrategy?: string;
  teachingAids?: string[];
  homework?: string;
  notes?: string;
}

export interface UpdateLessonPlanDto {
  date?: string;
  weekNumber?: number;
  sessionNumber?: number;
  duration?: number;
  objectives?: string[];
  topics?: TopicCoverage[];
  assessmentStrategy?: string;
  teachingAids?: string[];
  homework?: string;
  notes?: string;
}

export interface LessonPlanDdbRecord extends LessonPlan {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: 'LESSON_PLAN';
}

// ── Attendance ────────────────────────────────────────────────────────────────

export interface AttendanceRecord extends AuditFields {
  sessionId: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  courseCode: string;
  batchId: string;
  facultyId: string;
  campus: string;
  department: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession extends AuditFields {
  sessionId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
}

export const AttendanceKeys = {
  sessionPk: (sessionId: string) => `ATTENDANCE#${sessionId}`,
  sessionSk: () => 'SESSION_META',
  studentSk: (studentId: string) => `STUDENT#${studentId}`,
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (courseCode: string, date: string) =>
    `ATTENDANCE#${courseCode}#${date}`,
};

export interface CreateAttendanceDto {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  records: Array<{
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

export interface UpdateAttendanceDto {
  sessionId: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

// ── Teaching Session ──────────────────────────────────────────────────────────

export interface TeachingSession extends AuditFields {
  sessionId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;

  date: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  room: string;
  dayOfWeek: DayOfWeek;
  status: SessionStatus;

  topic?: string;
  notes?: string;
  cancelledReason?: string;
  rescheduledTo?: string;
}

export const SessionKeys = {
  pk: (sessionId: string) => `SESSION#${sessionId}`,
  sk: () => 'METADATA',
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (date: string) => `SESSION#${date}`,
};

export interface CreateSessionDto {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  dayOfWeek: DayOfWeek;
  topic?: string;
  notes?: string;
}

export interface UpdateSessionDto {
  date?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  topic?: string;
  notes?: string;
  status?: SessionStatus;
  cancelledReason?: string;
  rescheduledTo?: string;
}

export interface SessionDdbRecord extends TeachingSession {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: 'SESSION';
}

// ── Teaching Load ─────────────────────────────────────────────────────────────

export interface TeachingCourse {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  credits: number;
  hoursPerWeek: number;
  enrolledStudents: number;
  room: string;
}

export interface TeachingLoad {
  facultyId: string;
  facultyName: string;
  designation: string;
  campus: string;
  department: string;
  academicYear: string;
  semester: string;
  courses: TeachingCourse[];
  totalCredits: number;
  totalHoursPerWeek: number;
  totalStudents: number;
}

// ── Timetable Entry ───────────────────────────────────────────────────────────

export interface TimetableEntry {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  room: string;
  sessionType: 'LECTURE' | 'LAB' | 'TUTORIAL';
}

export interface Timetable {
  facultyId: string;
  semester: string;
  academicYear: string;
  entries: TimetableEntry[];
}
