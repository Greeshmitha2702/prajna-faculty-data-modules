// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Common Validators
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { UserRole } from '../models/common.model';

// ── Primitives ────────────────────────────────────────────────────────────────

export const uuidSchema = z.string().uuid('Must be a valid UUID');

export const isoDateSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'Must be a valid date in ISO 8601 format (YYYY-MM-DD)'
  );

export const isoDateTimeSchema = z
  .string()
  .datetime({ message: 'Must be a valid ISO 8601 datetime string' });

export const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Must be a valid time in HH:MM format');

export const nonEmptyString = z.string().min(1, 'Must not be empty').trim();

export const positiveInt = z.number().int().positive();

export const nonNegativeNumber = z.number().min(0);

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be >= 0')
  .max(100, 'Percentage must be <= 100');

// ── Pagination ────────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  lastKey: z.string().optional(),
});

// ── Roles ─────────────────────────────────────────────────────────────────────

export const allowedRolesSchema = z.enum([
  UserRole.FACULTY,
  UserRole.HOD,
  UserRole.DIRECTOR,
  UserRole.PVC,
  UserRole.IQAC,
  UserRole.ADMIN,
]);

// ── Attachment ────────────────────────────────────────────────────────────────

export const attachmentRefSchema = z.object({
  fileName: nonEmptyString,
  s3Key: nonEmptyString,
  contentType: nonEmptyString,
  sizeBytes: positiveInt,
  uploadedAt: isoDateTimeSchema,
});

// ── Academic Context ──────────────────────────────────────────────────────────

export const academicContextSchema = z.object({
  courseCode: nonEmptyString.max(20),
  courseTitle: nonEmptyString.max(200),
  batchId: nonEmptyString.max(50),
  semester: nonEmptyString.max(20),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, 'Must be in YYYY-YYYY format'),
});

// ── Query Filters ─────────────────────────────────────────────────────────────

export const courseFilterSchema = z.object({
  courseCode: z.string().optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
  batchId: z.string().optional(),
});

// ── Helper: parse & validate with error formatting ────────────────────────────

export function parseAndValidate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.issues.map(
    (i) => `${i.path.join('.')}: ${i.message}`
  );
  return { success: false, errors };
}
