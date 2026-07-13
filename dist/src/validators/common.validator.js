"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Common Validators
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseFilterSchema = exports.academicContextSchema = exports.attachmentRefSchema = exports.allowedRolesSchema = exports.paginationSchema = exports.percentageSchema = exports.nonNegativeNumber = exports.positiveInt = exports.nonEmptyString = exports.timeSchema = exports.isoDateTimeSchema = exports.isoDateSchema = exports.uuidSchema = void 0;
exports.parseAndValidate = parseAndValidate;
const zod_1 = require("zod");
const common_model_1 = require("../models/common.model");
// ── Primitives ────────────────────────────────────────────────────────────────
exports.uuidSchema = zod_1.z.string().uuid('Must be a valid UUID');
exports.isoDateSchema = zod_1.z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in ISO 8601 format (YYYY-MM-DD)');
exports.isoDateTimeSchema = zod_1.z
    .string()
    .datetime({ message: 'Must be a valid ISO 8601 datetime string' });
exports.timeSchema = zod_1.z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Must be a valid time in HH:MM format');
exports.nonEmptyString = zod_1.z.string().min(1, 'Must not be empty').trim();
exports.positiveInt = zod_1.z.number().int().positive();
exports.nonNegativeNumber = zod_1.z.number().min(0);
exports.percentageSchema = zod_1.z
    .number()
    .min(0, 'Percentage must be >= 0')
    .max(100, 'Percentage must be <= 100');
// ── Pagination ────────────────────────────────────────────────────────────────
exports.paginationSchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
    lastKey: zod_1.z.string().optional(),
});
// ── Roles ─────────────────────────────────────────────────────────────────────
exports.allowedRolesSchema = zod_1.z.enum([
    common_model_1.UserRole.FACULTY,
    common_model_1.UserRole.HOD,
    common_model_1.UserRole.DIRECTOR,
    common_model_1.UserRole.PVC,
    common_model_1.UserRole.IQAC,
    common_model_1.UserRole.ADMIN,
]);
// ── Attachment ────────────────────────────────────────────────────────────────
exports.attachmentRefSchema = zod_1.z.object({
    fileName: exports.nonEmptyString,
    s3Key: exports.nonEmptyString,
    contentType: exports.nonEmptyString,
    sizeBytes: exports.positiveInt,
    uploadedAt: exports.isoDateTimeSchema,
});
// ── Academic Context ──────────────────────────────────────────────────────────
exports.academicContextSchema = zod_1.z.object({
    courseCode: exports.nonEmptyString.max(20),
    courseTitle: exports.nonEmptyString.max(200),
    batchId: exports.nonEmptyString.max(50),
    semester: exports.nonEmptyString.max(20),
    academicYear: zod_1.z
        .string()
        .regex(/^\d{4}-\d{4}$/, 'Must be in YYYY-YYYY format'),
});
// ── Query Filters ─────────────────────────────────────────────────────────────
exports.courseFilterSchema = zod_1.z.object({
    courseCode: zod_1.z.string().optional(),
    semester: zod_1.z.string().optional(),
    academicYear: zod_1.z.string().optional(),
    batchId: zod_1.z.string().optional(),
});
// ── Helper: parse & validate with error formatting ────────────────────────────
function parseAndValidate(schema, data) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
    return { success: false, errors };
}
//# sourceMappingURL=common.validator.js.map