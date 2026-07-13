// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Validators
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { DeliverableStatus, DeliverableType } from '../models/common.model';
import {
  academicContextSchema,
  isoDateSchema,
  nonEmptyString,
  nonNegativeNumber,
  paginationSchema,
  percentageSchema,
  positiveInt,
  uuidSchema,
} from './common.validator';

// ── Rubric ────────────────────────────────────────────────────────────────────

export const rubricCriterionSchema = z.object({
  id: uuidSchema,
  title: nonEmptyString.max(200),
  description: nonEmptyString.max(1000),
  maxMarks: positiveInt,
  weight: percentageSchema,
});

// ── Create ────────────────────────────────────────────────────────────────────

export const createDeliverableSchema = academicContextSchema.extend({
  title: nonEmptyString.max(300),
  description: nonEmptyString.max(5000),
  type: z.nativeEnum(DeliverableType),
  totalMarks: positiveInt.max(1000),
  passingMarks: nonNegativeNumber,
  weightagePercent: percentageSchema,
  dueDate: isoDateSchema,
  allowLateSubmission: z.boolean(),
  latePenaltyPercentPerDay: percentageSchema,
  rubric: z.array(rubricCriterionSchema).optional().default([]),
}).refine(
  (data) => data.passingMarks <= data.totalMarks,
  { message: 'Passing marks must be <= total marks', path: ['passingMarks'] }
);

// ── Update ────────────────────────────────────────────────────────────────────

export const updateDeliverableSchema = z.object({
  title: nonEmptyString.max(300).optional(),
  description: nonEmptyString.max(5000).optional(),
  totalMarks: positiveInt.max(1000).optional(),
  passingMarks: nonNegativeNumber.optional(),
  weightagePercent: percentageSchema.optional(),
  dueDate: isoDateSchema.optional(),
  status: z.nativeEnum(DeliverableStatus).optional(),
  allowLateSubmission: z.boolean().optional(),
  latePenaltyPercentPerDay: percentageSchema.optional(),
  rubric: z.array(rubricCriterionSchema).optional(),
});

// ── Query ─────────────────────────────────────────────────────────────────────

export const listDeliverablesQuerySchema = paginationSchema.extend({
  courseCode: z.string().optional(),
  status: z.nativeEnum(DeliverableStatus).optional(),
  type: z.nativeEnum(DeliverableType).optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
  batchId: z.string().optional(),
});

export type CreateDeliverableInput = z.infer<typeof createDeliverableSchema>;
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>;
export type ListDeliverablesQuery = z.infer<typeof listDeliverablesQuerySchema>;
