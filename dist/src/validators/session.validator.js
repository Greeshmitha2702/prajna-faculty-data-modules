"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Session Validators (Lesson Plans, Attendance, Sessions)
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSessionsQuerySchema = exports.updateSessionSchema = exports.createSessionSchema = exports.listAttendanceQuerySchema = exports.updateAttendanceSchema = exports.createAttendanceSchema = exports.attendanceRecordItemSchema = exports.listLessonPlansQuerySchema = exports.updateLessonPlanSchema = exports.createLessonPlanSchema = exports.topicCoverageSchema = void 0;
const zod_1 = require("zod");
const common_model_1 = require("../models/common.model");
const common_validator_1 = require("./common.validator");
// ── Topic Coverage ────────────────────────────────────────────────────────────
exports.topicCoverageSchema = zod_1.z.object({
    topicId: common_validator_1.uuidSchema,
    title: common_validator_1.nonEmptyString.max(300),
    description: common_validator_1.nonEmptyString.max(2000),
    duration: common_validator_1.positiveInt.max(480), // max 8 hours
    learningOutcomes: zod_1.z.array(zod_1.z.string().max(500)).min(1),
    teachingMethods: zod_1.z.array(zod_1.z.string().max(200)).min(1),
    resources: zod_1.z.array(zod_1.z.string().max(500)).optional(),
});
// ── Lesson Plan ───────────────────────────────────────────────────────────────
exports.createLessonPlanSchema = common_validator_1.academicContextSchema.extend({
    date: common_validator_1.isoDateSchema,
    weekNumber: common_validator_1.positiveInt.max(52),
    sessionNumber: common_validator_1.positiveInt.max(200),
    duration: common_validator_1.positiveInt.max(480),
    objectives: zod_1.z
        .array(zod_1.z.string().max(500))
        .min(1, 'At least one objective required'),
    topics: zod_1.z.array(exports.topicCoverageSchema).min(1, 'At least one topic required'),
    assessmentStrategy: common_validator_1.nonEmptyString.max(2000),
    teachingAids: zod_1.z.array(zod_1.z.string().max(200)).optional(),
    homework: zod_1.z.string().max(2000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
});
exports.updateLessonPlanSchema = zod_1.z.object({
    date: common_validator_1.isoDateSchema.optional(),
    weekNumber: common_validator_1.positiveInt.max(52).optional(),
    sessionNumber: common_validator_1.positiveInt.max(200).optional(),
    duration: common_validator_1.positiveInt.max(480).optional(),
    objectives: zod_1.z.array(zod_1.z.string().max(500)).optional(),
    topics: zod_1.z.array(exports.topicCoverageSchema).optional(),
    assessmentStrategy: common_validator_1.nonEmptyString.max(2000).optional(),
    teachingAids: zod_1.z.array(zod_1.z.string().max(200)).optional(),
    homework: zod_1.z.string().max(2000).optional(),
    notes: zod_1.z.string().max(5000).optional(),
});
exports.listLessonPlansQuerySchema = common_validator_1.paginationSchema.extend({
    courseCode: zod_1.z.string().optional(),
    semester: zod_1.z.string().optional(),
    academicYear: zod_1.z.string().optional(),
    from: common_validator_1.isoDateSchema.optional(),
    to: common_validator_1.isoDateSchema.optional(),
});
// ── Attendance ────────────────────────────────────────────────────────────────
exports.attendanceRecordItemSchema = zod_1.z.object({
    studentId: common_validator_1.nonEmptyString.max(100),
    studentName: common_validator_1.nonEmptyString.max(200),
    enrollmentNo: common_validator_1.nonEmptyString.max(50),
    status: zod_1.z.nativeEnum(common_model_1.AttendanceStatus),
    remarks: zod_1.z.string().max(500).optional(),
});
exports.createAttendanceSchema = common_validator_1.academicContextSchema.extend({
    date: common_validator_1.isoDateSchema,
    startTime: common_validator_1.timeSchema,
    endTime: common_validator_1.timeSchema,
    topic: common_validator_1.nonEmptyString.max(300),
    records: zod_1.z
        .array(exports.attendanceRecordItemSchema)
        .min(1, 'At least one record required'),
}).refine((d) => d.endTime > d.startTime, { message: 'End time must be after start time', path: ['endTime'] });
exports.updateAttendanceSchema = zod_1.z.object({
    sessionId: common_validator_1.uuidSchema,
    records: zod_1.z
        .array(zod_1.z.object({
        studentId: common_validator_1.nonEmptyString,
        status: zod_1.z.nativeEnum(common_model_1.AttendanceStatus),
        remarks: zod_1.z.string().max(500).optional(),
    }))
        .min(1),
});
exports.listAttendanceQuerySchema = common_validator_1.paginationSchema.extend({
    courseCode: zod_1.z.string().optional(),
    batchId: zod_1.z.string().optional(),
    from: common_validator_1.isoDateSchema.optional(),
    to: common_validator_1.isoDateSchema.optional(),
});
// ── Teaching Session ──────────────────────────────────────────────────────────
exports.createSessionSchema = common_validator_1.academicContextSchema.extend({
    date: common_validator_1.isoDateSchema,
    startTime: common_validator_1.timeSchema,
    endTime: common_validator_1.timeSchema,
    room: common_validator_1.nonEmptyString.max(100),
    dayOfWeek: zod_1.z.nativeEnum(common_model_1.DayOfWeek),
    topic: zod_1.z.string().max(300).optional(),
    notes: zod_1.z.string().max(2000).optional(),
}).refine((d) => d.endTime > d.startTime, { message: 'End time must be after start time', path: ['endTime'] });
exports.updateSessionSchema = zod_1.z.object({
    date: common_validator_1.isoDateSchema.optional(),
    startTime: common_validator_1.timeSchema.optional(),
    endTime: common_validator_1.timeSchema.optional(),
    room: common_validator_1.nonEmptyString.max(100).optional(),
    topic: zod_1.z.string().max(300).optional(),
    notes: zod_1.z.string().max(2000).optional(),
    status: zod_1.z.nativeEnum(common_model_1.SessionStatus).optional(),
    cancelledReason: zod_1.z.string().max(1000).optional(),
    rescheduledTo: common_validator_1.isoDateSchema.optional(),
});
exports.listSessionsQuerySchema = common_validator_1.paginationSchema.extend({
    courseCode: zod_1.z.string().optional(),
    from: common_validator_1.isoDateSchema.optional(),
    to: common_validator_1.isoDateSchema.optional(),
    status: zod_1.z.nativeEnum(common_model_1.SessionStatus).optional(),
});
//# sourceMappingURL=session.validator.js.map