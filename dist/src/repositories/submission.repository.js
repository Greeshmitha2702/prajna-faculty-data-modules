"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Repository
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionRepository = void 0;
const uuid_1 = require("uuid");
const submission_model_1 = require("../models/submission.model");
const common_model_1 = require("../models/common.model");
class SubmissionRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async create(dto, facultyId, totalMarks, dueDate, createdBy) {
        const now = new Date().toISOString();
        const submittedAt = now;
        const dueDateMs = new Date(dueDate).getTime();
        const submittedMs = new Date(submittedAt).getTime();
        const isLate = submittedMs > dueDateMs;
        const lateDays = isLate
            ? Math.ceil((submittedMs - dueDateMs) / (1000 * 60 * 60 * 24))
            : 0;
        const submission = {
            submissionId: (0, uuid_1.v4)(),
            deliverableId: dto.deliverableId,
            studentId: dto.studentId,
            studentName: dto.studentName,
            enrollmentNo: dto.enrollmentNo,
            courseCode: dto.courseCode,
            batchId: dto.batchId,
            facultyId,
            status: isLate ? common_model_1.SubmissionStatus.LATE : common_model_1.SubmissionStatus.SUBMITTED,
            submittedAt,
            isLate,
            lateDays,
            attachments: [],
            textContent: dto.textContent,
            comments: dto.comments,
            totalMarks,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        await this.ddb.put((0, submission_model_1.toSubmissionDdbRecord)(submission));
        return submission;
    }
    async getById(submissionId) {
        const record = await this.ddb.get({
            PK: submission_model_1.SubmissionKeys.pk(submissionId),
            SK: submission_model_1.SubmissionKeys.sk(),
        });
        return record ? (0, submission_model_1.fromSubmissionDdbRecord)(record) : null;
    }
    async grade(submissionId, dto, gradedBy, latePenaltyPercentPerDay) {
        const existing = await this.getById(submissionId);
        if (!existing)
            return null;
        const now = new Date().toISOString();
        const penaltyPercent = existing.isLate
            ? Math.min(existing.lateDays * latePenaltyPercentPerDay, 100)
            : 0;
        const penaltyDeduction = (dto.marksObtained * penaltyPercent) / 100;
        const finalMarks = Math.max(0, dto.marksObtained - penaltyDeduction);
        const updated = {
            ...existing,
            status: common_model_1.SubmissionStatus.GRADED,
            marksObtained: dto.marksObtained,
            gradeBreakdown: dto.gradeBreakdown,
            feedbackNote: dto.feedbackNote,
            latePenaltyApplied: penaltyDeduction,
            finalMarks,
            gradedAt: now,
            gradedBy,
            updatedAt: now,
            updatedBy: gradedBy,
        };
        await this.ddb.put((0, submission_model_1.toSubmissionDdbRecord)(updated));
        return updated;
    }
    async listByDeliverable(deliverableId, options = {}) {
        const { limit = 20, lastKey, status } = options;
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': submission_model_1.SubmissionKeys.gsi1pk(deliverableId),
        };
        const filters = [];
        if (status) {
            filters.push('#status = :status');
            names['#status'] = 'status';
            values[':status'] = status;
        }
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI1',
            keyConditionExpression: '#gsi1pk = :pk',
            filterExpression: filters.length ? filters.join(' AND ') : undefined,
            expressionAttributeNames: names,
            expressionAttributeValues: values,
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
        });
        return {
            items: items.map(submission_model_1.fromSubmissionDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
    async listByStudent(studentId, options = {}) {
        const { limit = 20, lastKey } = options;
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI2',
            keyConditionExpression: '#gsi2pk = :pk',
            expressionAttributeNames: { '#gsi2pk': 'GSI2PK' },
            expressionAttributeValues: { ':pk': submission_model_1.SubmissionKeys.gsi2pk(studentId) },
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
            scanIndexForward: false,
        });
        return {
            items: items.map(submission_model_1.fromSubmissionDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.SubmissionRepository = SubmissionRepository;
//# sourceMappingURL=submission.repository.js.map