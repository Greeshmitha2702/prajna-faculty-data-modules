"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Repository
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRepository = void 0;
const uuid_1 = require("uuid");
const feedback_model_1 = require("../models/feedback.model");
const common_model_1 = require("../models/common.model");
class FeedbackRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async create(dto, facultyId, campus, department, createdBy) {
        const now = new Date().toISOString();
        const feedback = {
            feedbackId: (0, uuid_1.v4)(),
            facultyId,
            campus,
            department,
            courseCode: dto.courseCode,
            courseTitle: dto.courseTitle,
            batchId: dto.batchId,
            semester: dto.semester,
            academicYear: dto.academicYear,
            type: dto.type,
            status: common_model_1.FeedbackStatus.PENDING,
            title: dto.title,
            description: dto.description,
            questions: dto.questions,
            totalResponseCount: 0,
            averageScore: 0,
            collectionStartDate: dto.collectionStartDate,
            collectionEndDate: dto.collectionEndDate,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        await this.ddb.put((0, feedback_model_1.toFeedbackDdbRecord)(feedback));
        return feedback;
    }
    async getById(feedbackId) {
        const record = await this.ddb.get({
            PK: feedback_model_1.FeedbackKeys.pk(feedbackId),
            SK: feedback_model_1.FeedbackKeys.sk(),
        });
        return record ? (0, feedback_model_1.fromFeedbackDdbRecord)(record) : null;
    }
    async release(feedbackId, summary, averageScore, totalResponseCount, releasedBy) {
        const existing = await this.getById(feedbackId);
        if (!existing)
            return null;
        const now = new Date().toISOString();
        const updated = {
            ...existing,
            status: common_model_1.FeedbackStatus.RELEASED,
            summary,
            averageScore,
            totalResponseCount,
            releasedAt: now,
            releasedBy,
            updatedAt: now,
            updatedBy: releasedBy,
        };
        await this.ddb.put((0, feedback_model_1.toFeedbackDdbRecord)(updated));
        return updated;
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey } = options;
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': feedback_model_1.FeedbackKeys.gsi1pk(facultyId),
        };
        let keyCondition = '#gsi1pk = :pk';
        if (options.academicYear && options.semester) {
            keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
            names['#gsi1sk'] = 'GSI1SK';
            values[':skPrefix'] = `FEEDBACK#${options.academicYear}#${options.semester}`;
        }
        const filters = [];
        if (options.type) {
            filters.push('#feedbackType = :feedbackType');
            names['#feedbackType'] = 'type';
            values[':feedbackType'] = options.type;
        }
        if (options.status) {
            filters.push('#feedbackStatus = :feedbackStatus');
            names['#feedbackStatus'] = 'status';
            values[':feedbackStatus'] = options.status;
        }
        if (options.courseCode) {
            filters.push('#courseCode = :courseCode');
            names['#courseCode'] = 'courseCode';
            values[':courseCode'] = options.courseCode;
        }
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI1',
            keyConditionExpression: keyCondition,
            filterExpression: filters.length ? filters.join(' AND ') : undefined,
            expressionAttributeNames: names,
            expressionAttributeValues: values,
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
            scanIndexForward: false,
        });
        return {
            items: items.map(feedback_model_1.fromFeedbackDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.FeedbackRepository = FeedbackRepository;
//# sourceMappingURL=feedback.repository.js.map