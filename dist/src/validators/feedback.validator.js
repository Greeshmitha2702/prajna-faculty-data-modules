"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Validators
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFeedbackQuerySchema = exports.submitFeedbackResponseSchema = exports.createFeedbackSchema = exports.feedbackResponseItemSchema = exports.feedbackQuestionSchema = void 0;
const zod_1 = require("zod");
const common_model_1 = require("../models/common.model");
const common_validator_1 = require("./common.validator");
// ── Feedback Question ─────────────────────────────────────────────────────────
exports.feedbackQuestionSchema = zod_1.z.object({
    questionId: common_validator_1.uuidSchema,
    text: common_validator_1.nonEmptyString.max(1000),
    category: common_validator_1.nonEmptyString.max(100),
    maxScore: common_validator_1.positiveInt.max(10),
});
// ── Feedback Response ─────────────────────────────────────────────────────────
exports.feedbackResponseItemSchema = zod_1.z.object({
    questionId: common_validator_1.uuidSchema,
    score: common_validator_1.nonNegativeNumber,
    comment: zod_1.z.string().max(2000).optional(),
});
// ── Create Feedback ───────────────────────────────────────────────────────────
exports.createFeedbackSchema = common_validator_1.academicContextSchema.extend({
    type: zod_1.z.nativeEnum(common_model_1.FeedbackType),
    title: common_validator_1.nonEmptyString.max(300),
    description: zod_1.z.string().max(2000).optional(),
    questions: zod_1.z
        .array(exports.feedbackQuestionSchema)
        .min(1, 'At least one question required')
        .max(50),
    collectionStartDate: common_validator_1.isoDateSchema,
    collectionEndDate: common_validator_1.isoDateSchema,
}).refine((d) => d.collectionEndDate >= d.collectionStartDate, {
    message: 'End date must be >= start date',
    path: ['collectionEndDate'],
});
// ── Submit Feedback Response ──────────────────────────────────────────────────
exports.submitFeedbackResponseSchema = zod_1.z.object({
    feedbackId: common_validator_1.uuidSchema,
    responses: zod_1.z
        .array(exports.feedbackResponseItemSchema)
        .min(1, 'At least one response required'),
});
// ── Query ─────────────────────────────────────────────────────────────────────
exports.listFeedbackQuerySchema = common_validator_1.paginationSchema.extend({
    courseCode: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(common_model_1.FeedbackType).optional(),
    status: zod_1.z.nativeEnum(common_model_1.FeedbackStatus).optional(),
    semester: zod_1.z.string().optional(),
    academicYear: zod_1.z.string().optional(),
});
//# sourceMappingURL=feedback.validator.js.map