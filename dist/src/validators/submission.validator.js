"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Validators
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRequestSchema = exports.listSubmissionsQuerySchema = exports.gradeSubmissionSchema = exports.gradeBreakdownItemSchema = exports.createSubmissionSchema = void 0;
const zod_1 = require("zod");
const common_model_1 = require("../models/common.model");
const common_validator_1 = require("./common.validator");
// ── Create Submission ─────────────────────────────────────────────────────────
exports.createSubmissionSchema = zod_1.z.object({
    deliverableId: common_validator_1.uuidSchema,
    studentId: common_validator_1.nonEmptyString.max(100),
    studentName: common_validator_1.nonEmptyString.max(200),
    enrollmentNo: common_validator_1.nonEmptyString.max(50),
    courseCode: common_validator_1.nonEmptyString.max(20),
    batchId: common_validator_1.nonEmptyString.max(50),
    textContent: zod_1.z.string().max(50000).optional(),
    comments: zod_1.z.string().max(2000).optional(),
});
// ── Grade Submission ──────────────────────────────────────────────────────────
exports.gradeBreakdownItemSchema = zod_1.z.object({
    criterionId: common_validator_1.uuidSchema,
    criterionTitle: common_validator_1.nonEmptyString.max(200),
    marksObtained: common_validator_1.nonNegativeNumber,
    maxMarks: common_validator_1.nonNegativeNumber,
    remarks: zod_1.z.string().max(2000).default(''),
});
exports.gradeSubmissionSchema = zod_1.z.object({
    marksObtained: common_validator_1.nonNegativeNumber,
    gradeBreakdown: zod_1.z.array(exports.gradeBreakdownItemSchema).optional(),
    feedbackNote: zod_1.z.string().max(5000).optional(),
});
// ── Query ─────────────────────────────────────────────────────────────────────
exports.listSubmissionsQuerySchema = common_validator_1.paginationSchema.extend({
    deliverableId: common_validator_1.uuidSchema.optional(),
    studentId: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(common_model_1.SubmissionStatus).optional(),
    courseCode: zod_1.z.string().optional(),
});
// ── Upload Request ────────────────────────────────────────────────────────────
exports.uploadRequestSchema = zod_1.z.object({
    fileName: common_validator_1.nonEmptyString.max(500),
    contentType: common_validator_1.nonEmptyString.max(200),
    sizeBytes: zod_1.z.number().int().positive().max(104857600), // max 100MB
    deliverableId: common_validator_1.uuidSchema.optional(),
    submissionId: common_validator_1.uuidSchema.optional(),
});
//# sourceMappingURL=submission.validator.js.map