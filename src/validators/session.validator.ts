// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Session Validators (Lesson Plans, Attendance, Sessions)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import {
  AttendanceStatus,
  DayOfWeek,
  SessionStatus,
} from '../models/common.model';
import {
  academicContextSchema,
  isoDateSchema,
  nonEmptyString,
  paginationSchema,
  positiveInt,
  timeSchema,
  uuidSchema,
} from './common.validator';

// ── Topic Coverage ────────────────────────────────────────────────────────────

export const topicCoverageSchema = z.object({
  topicId: uuidSchema,
  title: nonEmptyString.max(300),
  description: nonEmptyString.max(2000),
  duration: positiveInt.max(480), // max 8 hours
  learningOutcomes: z.array(z.string().max(500)).min(1),
  teachingMethods: z.array(z.string().max(200)).min(1),
  resources: z.array(z.string().max(500)).optional(),
});

// ── Lesson Plan ───────────────────────────────────────────────────────────────

export const createLessonPlanSchema = academicContextSchema.extend({
  date: isoDateSchema,
  weekNumber: positiveInt.max(52),
  sessionNumber: positiveInt.max(200),
  duration: positiveInt.max(480),
  objectives: z
    .array(z.string().max(500))
    .min(1, 'At least one objective required'),
  topics: z.array(topicCoverageSchema).min(1, 'At least one topic required'),
  assessmentStrategy: nonEmptyString.max(2000),
  teachingAids: z.array(z.string().max(200)).optional(),
  homework: z.string().max(2000).optional(),
  notes: z.string().max(5000).optional(),
});

export const updateLessonPlanSchema = z.object({
  date: isoDateSchema.optional(),
  weekNumber: positiveInt.max(52).optional(),
  sessionNumber: positiveInt.max(200).optional(),
  duration: positiveInt.max(480).optional(),
  objectives: z.array(z.string().max(500)).optional(),
  topics: z.array(topicCoverageSchema).optional(),
  assessmentStrategy: nonEmptyString.max(2000).optional(),
  teachingAids: z.array(z.string().max(200)).optional(),
  homework: z.string().max(2000).optional(),
  notes: z.string().max(5000).optional(),
});

export const listLessonPlansQuerySchema = paginationSchema.extend({
  courseCode: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
});

// ── Attendance ────────────────────────────────────────────────────────────────

export const attendanceRecordItemSchema = z.object({
  studentId: nonEmptyString.max(100),
  studentName: nonEmptyString.max(200),
  enrollmentNo: nonEmptyString.max(50),
  status: z.nativeEnum(AttendanceStatus),
  remarks: z.string().max(500).optional(),
});

export const createAttendanceSchema = academicContextSchema.extend({
  date: isoDateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  topic: nonEmptyString.max(300),
  records: z
    .array(attendanceRecordItemSchema)
    .min(1, 'At least one record required'),
}).refine(
  (d) => d.endTime > d.startTime,
  { message: 'End time must be after start time', path: ['endTime'] }
);

export const updateAttendanceSchema = z.object({
  sessionId: uuidSchema,
  records: z
    .array(
      z.object({
        studentId: nonEmptyString,
        status: z.nativeEnum(AttendanceStatus),
        remarks: z.string().max(500).optional(),
      })
    )
    .min(1),
});

export const listAttendanceQuerySchema = paginationSchema.extend({
  courseCode: z.string().optional(),
  batchId: z.string().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
});

// ── Teaching Session ──────────────────────────────────────────────────────────

export const createSessionSchema = academicContextSchema.extend({
  date: isoDateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  room: nonEmptyString.max(100),
  dayOfWeek: z.nativeEnum(DayOfWeek),
  topic: z.string().max(300).optional(),
  notes: z.string().max(2000).optional(),
}).refine(
  (d) => d.endTime > d.startTime,
  { message: 'End time must be after start time', path: ['endTime'] }
);

export const updateSessionSchema = z.object({
  date: isoDateSchema.optional(),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
  room: nonEmptyString.max(100).optional(),
  topic: z.string().max(300).optional(),
  notes: z.string().max(2000).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  cancelledReason: z.string().max(1000).optional(),
  rescheduledTo: isoDateSchema.optional(),
});

export const listSessionsQuerySchema = paginationSchema.extend({
  courseCode: z.string().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
  status: z.nativeEnum(SessionStatus).optional(),
});

export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
export type UpdateLessonPlanInput = z.infer<typeof updateLessonPlanSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
