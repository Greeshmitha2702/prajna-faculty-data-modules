"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Teaching Session Repository
// Covers: LessonPlans, Attendance Sessions, Teaching Sessions
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachingSessionRepository = exports.AttendanceRepository = exports.LessonPlanRepository = void 0;
const uuid_1 = require("uuid");
const teaching_session_model_1 = require("../models/teaching-session.model");
const common_model_1 = require("../models/common.model");
// ── Lesson Plan Repository ────────────────────────────────────────────────────
class LessonPlanRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async create(dto, facultyId, campus, department, createdBy) {
        const now = new Date().toISOString();
        const plan = {
            planId: (0, uuid_1.v4)(),
            facultyId,
            campus,
            department,
            ...dto,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        const record = {
            ...plan,
            PK: teaching_session_model_1.LessonPlanKeys.pk(plan.planId),
            SK: teaching_session_model_1.LessonPlanKeys.sk(),
            GSI1PK: teaching_session_model_1.LessonPlanKeys.gsi1pk(facultyId),
            GSI1SK: teaching_session_model_1.LessonPlanKeys.gsi1sk(dto.courseCode, dto.date),
            entityType: 'LESSON_PLAN',
        };
        await this.ddb.put(record);
        return plan;
    }
    async getById(planId) {
        const record = await this.ddb.get({
            PK: teaching_session_model_1.LessonPlanKeys.pk(planId),
            SK: teaching_session_model_1.LessonPlanKeys.sk(),
        });
        if (!record)
            return null;
        const { PK: _pk, SK: _sk, GSI1PK: _g1pk, GSI1SK: _g1sk, entityType: _et, ...plan } = record;
        return plan;
    }
    async update(planId, dto, updatedBy) {
        const existing = await this.getById(planId);
        if (!existing)
            return null;
        const now = new Date().toISOString();
        const updated = { ...existing, ...dto, updatedAt: now, updatedBy };
        const record = {
            ...updated,
            PK: teaching_session_model_1.LessonPlanKeys.pk(planId),
            SK: teaching_session_model_1.LessonPlanKeys.sk(),
            GSI1PK: teaching_session_model_1.LessonPlanKeys.gsi1pk(updated.facultyId),
            GSI1SK: teaching_session_model_1.LessonPlanKeys.gsi1sk(updated.courseCode, updated.date),
            entityType: 'LESSON_PLAN',
        };
        await this.ddb.put(record);
        return updated;
    }
    async delete(planId) {
        await this.ddb.delete({
            PK: teaching_session_model_1.LessonPlanKeys.pk(planId),
            SK: teaching_session_model_1.LessonPlanKeys.sk(),
        });
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey, courseCode, from, to } = options;
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': teaching_session_model_1.LessonPlanKeys.gsi1pk(facultyId),
        };
        let keyCondition = '#gsi1pk = :pk';
        if (courseCode) {
            keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
            names['#gsi1sk'] = 'GSI1SK';
            values[':skPrefix'] = `LESSON_PLAN#${courseCode}#`;
        }
        const filters = [];
        if (from) {
            filters.push('#date >= :from');
            names['#date'] = 'date';
            values[':from'] = from;
        }
        if (to) {
            filters.push('#date <= :to');
            names['#date'] = 'date';
            values[':to'] = to;
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
            items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1pk, GSI1SK: _g1sk, entityType: _et, ...p }) => p),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.LessonPlanRepository = LessonPlanRepository;
// ── Attendance Repository ─────────────────────────────────────────────────────
class AttendanceRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async createSession(dto, facultyId, campus, department, createdBy) {
        const now = new Date().toISOString();
        const sessionId = (0, uuid_1.v4)();
        const presentCount = dto.records.filter((r) => r.status === common_model_1.AttendanceStatus.PRESENT).length;
        const absentCount = dto.records.filter((r) => r.status === common_model_1.AttendanceStatus.ABSENT).length;
        const lateCount = dto.records.filter((r) => r.status === common_model_1.AttendanceStatus.LATE).length;
        const excusedCount = dto.records.filter((r) => r.status === common_model_1.AttendanceStatus.EXCUSED).length;
        const total = dto.records.length;
        const session = {
            sessionId,
            facultyId,
            campus,
            department,
            courseCode: dto.courseCode,
            courseTitle: dto.courseTitle,
            batchId: dto.batchId,
            semester: dto.semester,
            academicYear: dto.academicYear,
            date: dto.date,
            startTime: dto.startTime,
            endTime: dto.endTime,
            topic: dto.topic,
            totalStudents: total,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            attendancePercentage: total > 0 ? (presentCount / total) * 100 : 0,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        // Store session metadata
        await this.ddb.put({
            PK: teaching_session_model_1.AttendanceKeys.sessionPk(sessionId),
            SK: teaching_session_model_1.AttendanceKeys.sessionSk(),
            GSI1PK: teaching_session_model_1.AttendanceKeys.gsi1pk(facultyId),
            GSI1SK: teaching_session_model_1.AttendanceKeys.gsi1sk(dto.courseCode, dto.date),
            entityType: 'ATTENDANCE_SESSION',
            ...session,
        });
        // Store individual student records
        for (const record of dto.records) {
            const studentRecord = {
                sessionId,
                studentId: record.studentId,
                studentName: record.studentName,
                enrollmentNo: record.enrollmentNo,
                courseCode: dto.courseCode,
                batchId: dto.batchId,
                facultyId,
                campus,
                department,
                date: dto.date,
                status: record.status,
                remarks: record.remarks,
                createdAt: now,
                updatedAt: now,
                createdBy,
                updatedBy: createdBy,
            };
            await this.ddb.put({
                PK: teaching_session_model_1.AttendanceKeys.sessionPk(sessionId),
                SK: teaching_session_model_1.AttendanceKeys.studentSk(record.studentId),
                entityType: 'ATTENDANCE_RECORD',
                ...studentRecord,
            });
        }
        return session;
    }
    async getSessionById(sessionId) {
        const record = await this.ddb.get({
            PK: teaching_session_model_1.AttendanceKeys.sessionPk(sessionId),
            SK: teaching_session_model_1.AttendanceKeys.sessionSk(),
        });
        if (!record)
            return null;
        const { PK: _pk, SK: _sk, entityType: _et, ...session } = record;
        return session;
    }
    async updateSession(dto, updatedBy) {
        const { sessionId, records } = dto;
        const now = new Date().toISOString();
        for (const r of records) {
            await this.ddb.updateItem({
                key: {
                    PK: teaching_session_model_1.AttendanceKeys.sessionPk(sessionId),
                    SK: teaching_session_model_1.AttendanceKeys.studentSk(r.studentId),
                },
                updateExpression: 'SET #status = :status, #remarks = :remarks, #updatedAt = :now, #updatedBy = :by',
                expressionAttributeNames: {
                    '#status': 'status',
                    '#remarks': 'remarks',
                    '#updatedAt': 'updatedAt',
                    '#updatedBy': 'updatedBy',
                },
                expressionAttributeValues: {
                    ':status': r.status,
                    ':remarks': r.remarks ?? '',
                    ':now': now,
                    ':by': updatedBy,
                },
            });
        }
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey, courseCode, from, to } = options;
        const names = {
            '#gsi1pk': 'GSI1PK',
            '#sk': 'SK',
        };
        const values = {
            ':pk': teaching_session_model_1.AttendanceKeys.gsi1pk(facultyId),
            ':skMeta': 'SESSION_META',
        };
        let keyCondition = '#gsi1pk = :pk';
        if (courseCode) {
            keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
            names['#gsi1sk'] = 'GSI1SK';
            values[':skPrefix'] = `ATTENDANCE#${courseCode}#`;
        }
        const filters = ['#sk = :skMeta'];
        if (from) {
            filters.push('#date >= :from');
            names['#date'] = 'date';
            values[':from'] = from;
        }
        if (to) {
            filters.push('#date <= :to');
            names['#date'] = 'date';
            values[':to'] = to;
        }
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI1',
            keyConditionExpression: keyCondition,
            filterExpression: filters.join(' AND '),
            expressionAttributeNames: names,
            expressionAttributeValues: values,
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
            scanIndexForward: false,
        });
        return {
            items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...s }) => s),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.AttendanceRepository = AttendanceRepository;
// ── Teaching Session Repository ───────────────────────────────────────────────
class TeachingSessionRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async create(dto, facultyId, campus, department, createdBy) {
        const now = new Date().toISOString();
        const startMs = new Date(`${dto.date}T${dto.startTime}:00`).getTime();
        const endMs = new Date(`${dto.date}T${dto.endTime}:00`).getTime();
        const duration = Math.round((endMs - startMs) / 60000);
        const session = {
            sessionId: (0, uuid_1.v4)(),
            facultyId,
            campus,
            department,
            courseCode: dto.courseCode,
            courseTitle: dto.courseTitle,
            batchId: dto.batchId,
            semester: dto.semester,
            academicYear: dto.academicYear,
            date: dto.date,
            startTime: dto.startTime,
            endTime: dto.endTime,
            duration,
            room: dto.room,
            dayOfWeek: dto.dayOfWeek,
            status: common_model_1.SessionStatus.SCHEDULED,
            topic: dto.topic,
            notes: dto.notes,
            createdAt: now,
            updatedAt: now,
            createdBy,
            updatedBy: createdBy,
        };
        const record = {
            ...session,
            PK: teaching_session_model_1.SessionKeys.pk(session.sessionId),
            SK: teaching_session_model_1.SessionKeys.sk(),
            GSI1PK: teaching_session_model_1.SessionKeys.gsi1pk(facultyId),
            GSI1SK: teaching_session_model_1.SessionKeys.gsi1sk(dto.date),
            entityType: 'SESSION',
        };
        await this.ddb.put(record);
        return session;
    }
    async getById(sessionId) {
        const record = await this.ddb.get({
            PK: teaching_session_model_1.SessionKeys.pk(sessionId),
            SK: teaching_session_model_1.SessionKeys.sk(),
        });
        if (!record)
            return null;
        const { PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...session } = record;
        return session;
    }
    async update(sessionId, dto, updatedBy) {
        const existing = await this.getById(sessionId);
        if (!existing)
            return null;
        const now = new Date().toISOString();
        const updated = { ...existing, ...dto, updatedAt: now, updatedBy };
        const record = {
            ...updated,
            PK: teaching_session_model_1.SessionKeys.pk(sessionId),
            SK: teaching_session_model_1.SessionKeys.sk(),
            GSI1PK: teaching_session_model_1.SessionKeys.gsi1pk(updated.facultyId),
            GSI1SK: teaching_session_model_1.SessionKeys.gsi1sk(updated.date),
            entityType: 'SESSION',
        };
        await this.ddb.put(record);
        return updated;
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey, from, to, status, courseCode } = options;
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': teaching_session_model_1.SessionKeys.gsi1pk(facultyId),
        };
        let keyCondition = '#gsi1pk = :pk';
        if (from && to) {
            keyCondition += ' AND #gsi1sk BETWEEN :from AND :to';
            names['#gsi1sk'] = 'GSI1SK';
            values[':from'] = `SESSION#${from}`;
            values[':to'] = `SESSION#${to}`;
        }
        else if (from) {
            keyCondition += ' AND #gsi1sk >= :from';
            names['#gsi1sk'] = 'GSI1SK';
            values[':from'] = `SESSION#${from}`;
        }
        const filters = [];
        if (status) {
            filters.push('#sessionStatus = :sessionStatus');
            names['#sessionStatus'] = 'status';
            values[':sessionStatus'] = status;
        }
        if (courseCode) {
            filters.push('#courseCode = :courseCode');
            names['#courseCode'] = 'courseCode';
            values[':courseCode'] = courseCode;
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
            items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...s }) => s),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.TeachingSessionRepository = TeachingSessionRepository;
//# sourceMappingURL=teaching-session.repository.js.map