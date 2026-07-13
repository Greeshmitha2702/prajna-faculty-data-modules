"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Repository
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverableRepository = void 0;
const uuid_1 = require("uuid");
const deliverable_model_1 = require("../models/deliverable.model");
const common_model_1 = require("../models/common.model");
class DeliverableRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async create(dto, facultyId, campus, department, createdBy) {
        const now = new Date().toISOString();
        const deliverable = {
            deliverableId: (0, uuid_1.v4)(),
            facultyId,
            campus,
            department,
            courseCode: dto.courseCode,
            courseTitle: dto.courseTitle,
            batchId: dto.batchId,
            semester: dto.semester,
            academicYear: dto.academicYear,
            title: dto.title,
            description: dto.description,
            type: dto.type,
            status: common_model_1.DeliverableStatus.DRAFT,
            totalMarks: dto.totalMarks,
            passingMarks: dto.passingMarks,
            weightagePercent: dto.weightagePercent,
            dueDate: dto.dueDate,
            allowLateSubmission: dto.allowLateSubmission,
            latePenaltyPercentPerDay: dto.latePenaltyPercentPerDay,
            attachments: [],
            rubric: dto.rubric ?? [],
            submissionCount: 0,
            gradedCount: 0,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        await this.ddb.put((0, deliverable_model_1.toDeliverableDdbRecord)(deliverable));
        return deliverable;
    }
    async getById(deliverableId) {
        const record = await this.ddb.get({
            PK: deliverable_model_1.DeliverableKeys.pk(deliverableId),
            SK: deliverable_model_1.DeliverableKeys.sk(),
        });
        return record ? (0, deliverable_model_1.fromDeliverableDdbRecord)(record) : null;
    }
    async update(deliverableId, dto, updatedBy) {
        const existing = await this.getById(deliverableId);
        if (!existing)
            return null;
        const now = new Date().toISOString();
        const updated = {
            ...existing,
            ...dto,
            updatedAt: now,
            updatedBy,
            ...(dto.status === common_model_1.DeliverableStatus.PUBLISHED && !existing.publishedAt
                ? { publishedAt: now }
                : {}),
            ...(dto.status === common_model_1.DeliverableStatus.CLOSED && !existing.closedAt
                ? { closedAt: now }
                : {}),
        };
        await this.ddb.put((0, deliverable_model_1.toDeliverableDdbRecord)(updated));
        return updated;
    }
    async delete(deliverableId) {
        await this.ddb.delete({
            PK: deliverable_model_1.DeliverableKeys.pk(deliverableId),
            SK: deliverable_model_1.DeliverableKeys.sk(),
        });
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey, courseCode, status } = options;
        let keyCondition = '#gsi1pk = :pk';
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': deliverable_model_1.DeliverableKeys.gsi1pk(facultyId),
        };
        if (courseCode) {
            keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
            names['#gsi1sk'] = 'GSI1SK';
            values[':skPrefix'] = `DELIVERABLE#${courseCode}#`;
        }
        const filters = [];
        if (status) {
            filters.push('#status = :status');
            names['#status'] = 'status';
            values[':status'] = status;
        }
        if (options.semester) {
            filters.push('#semester = :semester');
            names['#semester'] = 'semester';
            values[':semester'] = options.semester;
        }
        if (options.academicYear) {
            filters.push('#academicYear = :academicYear');
            names['#academicYear'] = 'academicYear';
            values[':academicYear'] = options.academicYear;
        }
        if (options.batchId) {
            filters.push('#batchId = :batchId');
            names['#batchId'] = 'batchId';
            values[':batchId'] = options.batchId;
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
            items: items.map(deliverable_model_1.fromDeliverableDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
    async listByCourse(courseCode, status, options = {}) {
        const { limit = 20, lastKey } = options;
        const names = { '#gsi2pk': 'GSI2PK' };
        const values = {
            ':pk': deliverable_model_1.DeliverableKeys.gsi2pk(courseCode),
        };
        let keyCondition = '#gsi2pk = :pk';
        if (status) {
            keyCondition += ' AND begins_with(#gsi2sk, :skPrefix)';
            names['#gsi2sk'] = 'GSI2SK';
            values[':skPrefix'] = `DELIVERABLE#${status}`;
        }
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI2',
            keyConditionExpression: keyCondition,
            expressionAttributeNames: names,
            expressionAttributeValues: values,
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
        });
        return {
            items: items.map(deliverable_model_1.fromDeliverableDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
    async incrementSubmissionCount(deliverableId) {
        await this.ddb.updateItem({
            key: {
                PK: deliverable_model_1.DeliverableKeys.pk(deliverableId),
                SK: deliverable_model_1.DeliverableKeys.sk(),
            },
            updateExpression: 'SET #submissionCount = if_not_exists(#submissionCount, :zero) + :one, #updatedAt = :now',
            expressionAttributeNames: {
                '#submissionCount': 'submissionCount',
                '#updatedAt': 'updatedAt',
            },
            expressionAttributeValues: {
                ':zero': 0,
                ':one': 1,
                ':now': new Date().toISOString(),
            },
        });
    }
}
exports.DeliverableRepository = DeliverableRepository;
//# sourceMappingURL=deliverable.repository.js.map