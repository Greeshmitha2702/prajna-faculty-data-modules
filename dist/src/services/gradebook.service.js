"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Service
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeBookService = void 0;
const common_model_1 = require("../models/common.model");
const errors_1 = require("./errors");
class GradeBookService {
    gradebookRepo;
    deliverableRepo;
    submissionRepo;
    eb;
    constructor(gradebookRepo, deliverableRepo, submissionRepo, eb) {
        this.gradebookRepo = gradebookRepo;
        this.deliverableRepo = deliverableRepo;
        this.submissionRepo = submissionRepo;
        this.eb = eb;
    }
    async getOrSync(courseCode, batchId, semester, academicYear, ctx) {
        // Fetch published deliverables for the course
        const deliverableResult = await this.deliverableRepo.listByCourse(courseCode, common_model_1.DeliverableStatus.PUBLISHED, { limit: 100 });
        const deliverables = deliverableResult.items;
        // Collect all submissions across all deliverables
        const allSubmissions = [];
        for (const d of deliverables) {
            const subResult = await this.submissionRepo.listByDeliverable(d.deliverableId, {
                limit: 500,
            });
            allSubmissions.push(...subResult.items);
        }
        // Upsert gradebook
        const gradebook = await this.gradebookRepo.upsert(ctx.facultyId, courseCode, deliverables[0]?.courseTitle ?? courseCode, batchId, semester, academicYear, ctx.campus, ctx.department, deliverables, allSubmissions, ctx.userId);
        await this.eb.publish({
            eventType: 'gradebook.updated',
            facultyId: ctx.facultyId,
            campus: ctx.campus,
            department: ctx.department,
            courseCode,
            academicYear,
            semester,
            payload: {
                gradebookId: gradebook.gradebookId,
                classAverageScore: gradebook.classAverageScore,
                totalStudents: gradebook.totalStudents,
                passPercentage: gradebook.passPercentage,
                lastSyncedAt: gradebook.lastSyncedAt,
            },
        });
        return gradebook;
    }
    async listByFaculty(ctx, options = {}) {
        return this.gradebookRepo.listByFaculty(ctx.facultyId, options);
    }
    async getByFacultyId(facultyId, courseCode, batchId, semester, academicYear, ctx) {
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, facultyId);
        const gradebookId = `${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`;
        const gradebook = await this.gradebookRepo.getById(gradebookId);
        if (!gradebook)
            throw new errors_1.NotFoundError('GradeBook', gradebookId);
        return gradebook;
    }
}
exports.GradeBookService = GradeBookService;
//# sourceMappingURL=gradebook.service.js.map