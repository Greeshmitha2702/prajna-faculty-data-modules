"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Repository
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeBookRepository = void 0;
const gradebook_model_1 = require("../models/gradebook.model");
const common_model_1 = require("../models/common.model");
class GradeBookRepository {
    ddb;
    constructor(ddb) {
        this.ddb = ddb;
    }
    async upsert(facultyId, courseCode, courseTitle, batchId, semester, academicYear, campus, department, deliverables, submissions, updatedBy) {
        const gradebookId = gradebook_model_1.GradeBookKeys.id(facultyId, courseCode, batchId, academicYear, semester);
        // Build per-student grade map
        const studentMap = new Map();
        const totalMaxMarks = deliverables.reduce((a, d) => a + d.totalMarks, 0);
        for (const sub of submissions.filter((s) => s.status === common_model_1.SubmissionStatus.GRADED)) {
            if (!studentMap.has(sub.studentId)) {
                studentMap.set(sub.studentId, {
                    studentId: sub.studentId,
                    studentName: sub.studentName,
                    enrollmentNo: sub.enrollmentNo,
                    totalMarksObtained: 0,
                    totalMarks: totalMaxMarks,
                    submittedDeliverables: 0,
                });
            }
            const entry = studentMap.get(sub.studentId);
            entry.totalMarksObtained += sub.finalMarks ?? sub.marksObtained ?? 0;
            entry.submittedDeliverables += 1;
        }
        const studentEntries = Array.from(studentMap.values()).map((e) => {
            const pct = totalMaxMarks > 0 ? (e.totalMarksObtained / totalMaxMarks) * 100 : 0;
            const { grade, gradePoint } = (0, gradebook_model_1.calculateGrade)(pct);
            return {
                ...e,
                totalDeliverables: deliverables.length,
                percentageScore: Math.round(pct * 100) / 100,
                grade,
                gradePoint,
                attendancePercentage: 0, // populated from attendance service if needed
            };
        });
        // Grade distribution
        const gradeDistribution = {};
        for (const e of studentEntries) {
            gradeDistribution[e.grade] = (gradeDistribution[e.grade] ?? 0) + 1;
        }
        // Deliverable summaries
        const deliverableSummaries = deliverables.map((d) => {
            const dSubs = submissions.filter((s) => s.deliverableId === d.deliverableId && s.status === common_model_1.SubmissionStatus.GRADED);
            const marks = dSubs.map((s) => s.finalMarks ?? s.marksObtained ?? 0);
            return {
                deliverableId: d.deliverableId,
                deliverableTitle: d.title,
                type: d.type,
                totalMarks: d.totalMarks,
                averageMarks: marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0,
                highestMarks: marks.length ? Math.max(...marks) : 0,
                lowestMarks: marks.length ? Math.min(...marks) : 0,
                submissionCount: dSubs.length,
                totalStudents: d.submissionCount,
            };
        });
        const scores = studentEntries.map((e) => e.percentageScore);
        const passCount = studentEntries.filter((e) => e.grade !== 'F').length;
        const now = new Date().toISOString();
        const existing = await this.getById(gradebookId);
        const gradebook = {
            gradebookId,
            facultyId,
            courseCode,
            courseTitle,
            batchId,
            semester,
            academicYear,
            campus,
            department,
            totalStudents: studentEntries.length,
            totalDeliverables: deliverables.length,
            classAverageScore: scores.length
                ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
                : 0,
            classHighestScore: scores.length ? Math.max(...scores) : 0,
            classLowestScore: scores.length ? Math.min(...scores) : 0,
            passCount,
            failCount: studentEntries.length - passCount,
            passPercentage: studentEntries.length
                ? Math.round((passCount / studentEntries.length) * 10000) / 100
                : 0,
            gradeDistribution,
            deliverableSummaries,
            studentEntries,
            lastSyncedAt: now,
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
            createdBy: existing?.createdBy ?? updatedBy,
            updatedBy,
        };
        await this.ddb.put((0, gradebook_model_1.toGradeBookDdbRecord)(gradebook));
        return gradebook;
    }
    async getById(gradebookId) {
        const [facultyId, courseCode, batchId, academicYear, semester] = gradebookId.split('#');
        const record = await this.ddb.get({
            PK: gradebook_model_1.GradeBookKeys.pk(facultyId, courseCode, batchId, academicYear, semester),
            SK: gradebook_model_1.GradeBookKeys.sk(),
        });
        return record ? (0, gradebook_model_1.fromGradeBookDdbRecord)(record) : null;
    }
    async listByFaculty(facultyId, options = {}) {
        const { limit = 20, lastKey, academicYear, semester } = options;
        const names = { '#gsi1pk': 'GSI1PK' };
        const values = {
            ':pk': gradebook_model_1.GradeBookKeys.gsi1pk(facultyId),
        };
        let keyCondition = '#gsi1pk = :pk';
        if (academicYear && semester) {
            keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
            names['#gsi1sk'] = 'GSI1SK';
            values[':skPrefix'] = `GRADEBOOK#${academicYear}#${semester}`;
        }
        const { items, lastKey: nextKey } = await this.ddb.query({
            indexName: 'GSI1',
            keyConditionExpression: keyCondition,
            expressionAttributeNames: names,
            expressionAttributeValues: values,
            limit,
            exclusiveStartKey: lastKey
                ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
                : undefined,
            scanIndexForward: false,
        });
        return {
            items: items.map(gradebook_model_1.fromGradeBookDdbRecord),
            lastKey: nextKey
                ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
                : undefined,
            count: items.length,
        };
    }
}
exports.GradeBookRepository = GradeBookRepository;
//# sourceMappingURL=gradebook.repository.js.map