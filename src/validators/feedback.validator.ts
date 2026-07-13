// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Validators
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { FeedbackStatus, FeedbackType } from '../models/common.model';
import {
  academicContextSchema,
  isoDateSchema,
  nonEmptyString,
  nonNegativeNumber,
  paginationSchema,
  positiveInt,
  uuidSchema,
} from './common.validator';

// ── Feedback Question ─────────────────────────────────────────────────────────

export const feedbackQuestionSchema = z.object({
  questionId: uuidSchema,
  text: nonEmptyString.max(1000),
  category: nonEmptyString.max(100),
  maxScore: positiveInt.max(10),
});

// ── Feedback Response ─────────────────────────────────────────────────────────

export const feedbackResponseItemSchema = z.object({
  questionId: uuidSchema,
  score: nonNegativeNumber,
  comment: z.string().max(2000).optional(),
});

// ── Create Feedback ───────────────────────────────────────────────────────────

export const createFeedbackSchema = academicContextSchema.extend({
  type: z.nativeEnum(FeedbackType),
  title: nonEmptyString.max(300),
  description: z.string().max(2000).optional(),
  questions: z
    .array(feedbackQuestionSchema)
    .min(1, 'At least one question required')
    .max(50),
  collectionStartDate: isoDateSchema,
  collectionEndDate: isoDateSchema,
}).refine(
  (d) => d.collectionEndDate >= d.collectionStartDate,
  {
    message: 'End date must be >= start date',
    path: ['collectionEndDate'],
  }
);

// ── Submit Feedback Response ──────────────────────────────────────────────────

export const submitFeedbackResponseSchema = z.object({
  feedbackId: uuidSchema,
  responses: z
    .array(feedbackResponseItemSchema)
    .min(1, 'At least one response required'),
});

// ── Query ─────────────────────────────────────────────────────────────────────

export const listFeedbackQuerySchema = paginationSchema.extend({
  courseCode: z.string().optional(),
  type: z.nativeEnum(FeedbackType).optional(),
  status: z.nativeEnum(FeedbackStatus).optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type SubmitFeedbackResponseInput = z.infer<
  typeof submitFeedbackResponseSchema
>;
export type ListFeedbackQuery = z.infer<typeof listFeedbackQuerySchema>;
