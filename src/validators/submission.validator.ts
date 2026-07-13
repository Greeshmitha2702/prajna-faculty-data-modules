// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Validators
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { SubmissionStatus } from '../models/common.model';
import {
  nonEmptyString,
  nonNegativeNumber,
  paginationSchema,
  uuidSchema,
} from './common.validator';

// ── Create Submission ─────────────────────────────────────────────────────────

export const createSubmissionSchema = z.object({
  deliverableId: uuidSchema,
  studentId: nonEmptyString.max(100),
  studentName: nonEmptyString.max(200),
  enrollmentNo: nonEmptyString.max(50),
  courseCode: nonEmptyString.max(20),
  batchId: nonEmptyString.max(50),
  textContent: z.string().max(50000).optional(),
  comments: z.string().max(2000).optional(),
});

// ── Grade Submission ──────────────────────────────────────────────────────────

export const gradeBreakdownItemSchema = z.object({
  criterionId: uuidSchema,
  criterionTitle: nonEmptyString.max(200),
  marksObtained: nonNegativeNumber,
  maxMarks: nonNegativeNumber,
  remarks: z.string().max(2000).default(''),
});

export const gradeSubmissionSchema = z.object({
  marksObtained: nonNegativeNumber,
  gradeBreakdown: z.array(gradeBreakdownItemSchema).optional(),
  feedbackNote: z.string().max(5000).optional(),
});

// ── Query ─────────────────────────────────────────────────────────────────────

export const listSubmissionsQuerySchema = paginationSchema.extend({
  deliverableId: uuidSchema.optional(),
  studentId: z.string().optional(),
  status: z.nativeEnum(SubmissionStatus).optional(),
  courseCode: z.string().optional(),
});

// ── Upload Request ────────────────────────────────────────────────────────────

export const uploadRequestSchema = z.object({
  fileName: nonEmptyString.max(500),
  contentType: nonEmptyString.max(200),
  sizeBytes: z.number().int().positive().max(104857600), // max 100MB
  deliverableId: uuidSchema.optional(),
  submissionId: uuidSchema.optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type ListSubmissionsQuery = z.infer<typeof listSubmissionsQuerySchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
