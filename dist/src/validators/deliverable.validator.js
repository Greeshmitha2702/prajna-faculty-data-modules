"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Validators
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDeliverablesQuerySchema = exports.updateDeliverableSchema = exports.createDeliverableSchema = exports.rubricCriterionSchema = void 0;
const zod_1 = require("zod");
const common_model_1 = require("../models/common.model");
const common_validator_1 = require("./common.validator");
// ── Rubric ────────────────────────────────────────────────────────────────────
exports.rubricCriterionSchema = zod_1.z.object({
    id: common_validator_1.uuidSchema,
    title: common_validator_1.nonEmptyString.max(200),
    description: common_validator_1.nonEmptyString.max(1000),
    maxMarks: common_validator_1.positiveInt,
    weight: common_validator_1.percentageSchema,
});
// ── Create ────────────────────────────────────────────────────────────────────
exports.createDeliverableSchema = common_validator_1.academicContextSchema.extend({
    title: common_validator_1.nonEmptyString.max(300),
    description: common_validator_1.nonEmptyString.max(5000),
    type: zod_1.z.nativeEnum(common_model_1.DeliverableType),
    totalMarks: common_validator_1.positiveInt.max(1000),
    passingMarks: common_validator_1.nonNegativeNumber,
    weightagePercent: common_validator_1.percentageSchema,
    dueDate: common_validator_1.isoDateSchema,
    allowLateSubmission: zod_1.z.boolean(),
    latePenaltyPercentPerDay: common_validator_1.percentageSchema,
    rubric: zod_1.z.array(exports.rubricCriterionSchema).optional().default([]),
}).refine((data) => data.passingMarks <= data.totalMarks, { message: 'Passing marks must be <= total marks', path: ['passingMarks'] });
// ── Update ────────────────────────────────────────────────────────────────────
exports.updateDeliverableSchema = zod_1.z.object({
    title: common_validator_1.nonEmptyString.max(300).optional(),
    description: common_validator_1.nonEmptyString.max(5000).optional(),
    totalMarks: common_validator_1.positiveInt.max(1000).optional(),
    passingMarks: common_validator_1.nonNegativeNumber.optional(),
    weightagePercent: common_validator_1.percentageSchema.optional(),
    dueDate: common_validator_1.isoDateSchema.optional(),
    status: zod_1.z.nativeEnum(common_model_1.DeliverableStatus).optional(),
    allowLateSubmission: zod_1.z.boolean().optional(),
    latePenaltyPercentPerDay: common_validator_1.percentageSchema.optional(),
    rubric: zod_1.z.array(exports.rubricCriterionSchema).optional(),
});
// ── Query ─────────────────────────────────────────────────────────────────────
exports.listDeliverablesQuerySchema = common_validator_1.paginationSchema.extend({
    courseCode: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(common_model_1.DeliverableStatus).optional(),
    type: zod_1.z.nativeEnum(common_model_1.DeliverableType).optional(),
    semester: zod_1.z.string().optional(),
    academicYear: zod_1.z.string().optional(),
    batchId: zod_1.z.string().optional(),
});
//# sourceMappingURL=deliverable.validator.js.map