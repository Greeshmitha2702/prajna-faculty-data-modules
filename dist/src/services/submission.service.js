"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Service
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionService = void 0;
const common_model_1 = require("../models/common.model");
const errors_1 = require("./errors");
class SubmissionService {
    submissionRepo;
    deliverableRepo;
    eb;
    constructor(submissionRepo, deliverableRepo, eb) {
        this.submissionRepo = submissionRepo;
        this.deliverableRepo = deliverableRepo;
        this.eb = eb;
    }
    async create(dto, ctx) {
        const deliverable = await this.deliverableRepo.getById(dto.deliverableId);
        if (!deliverable)
            throw new errors_1.NotFoundError('Deliverable', dto.deliverableId);
        if (deliverable.status !== common_model_1.DeliverableStatus.PUBLISHED) {
            throw new errors_1.ValidationError('Submissions are only accepted for PUBLISHED deliverables');
        }
        if (!deliverable.allowLateSubmission) {
            const now = new Date();
            const due = new Date(deliverable.dueDate);
            if (now > due) {
                throw new errors_1.ForbiddenError('Late submissions are not allowed for this deliverable');
            }
        }
        const submission = await this.submissionRepo.create(dto, deliverable.facultyId, deliverable.totalMarks, deliverable.dueDate, ctx.userId);
        await this.deliverableRepo.incrementSubmissionCount(dto.deliverableId);
        await this.eb.publish({
            eventType: 'submission.received',
            facultyId: deliverable.facultyId,
            campus: deliverable.campus,
            department: deliverable.department,
            courseCode: deliverable.courseCode,
            academicYear: deliverable.academicYear,
            semester: deliverable.semester,
            payload: {
                submissionId: submission.submissionId,
                deliverableId: submission.deliverableId,
                studentId: submission.studentId,
                isLate: submission.isLate,
                submittedAt: submission.submittedAt,
            },
        });
        return submission;
    }
    async grade(submissionId, dto, ctx) {
        const submission = await this.submissionRepo.getById(submissionId);
        if (!submission)
            throw new errors_1.NotFoundError('Submission', submissionId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, submission.facultyId);
        const deliverable = await this.deliverableRepo.getById(submission.deliverableId);
        if (!deliverable)
            throw new errors_1.NotFoundError('Deliverable', submission.deliverableId);
        if (dto.marksObtained > deliverable.totalMarks) {
            throw new errors_1.ValidationError(`Marks obtained (${dto.marksObtained}) cannot exceed total marks (${deliverable.totalMarks})`);
        }
        const graded = await this.submissionRepo.grade(submissionId, dto, ctx.userId, deliverable.latePenaltyPercentPerDay);
        if (!graded)
            throw new errors_1.NotFoundError('Submission', submissionId);
        return graded;
    }
    async getById(submissionId, ctx) {
        const submission = await this.submissionRepo.getById(submissionId);
        if (!submission)
            throw new errors_1.NotFoundError('Submission', submissionId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, submission.facultyId);
        return submission;
    }
    async listByDeliverable(deliverableId, ctx, options = {}) {
        const deliverable = await this.deliverableRepo.getById(deliverableId);
        if (!deliverable)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, deliverable.facultyId);
        return this.submissionRepo.listByDeliverable(deliverableId, options);
    }
    async listByStudent(studentId, _ctx, options = {}) {
        return this.submissionRepo.listByStudent(studentId, options);
    }
}
exports.SubmissionService = SubmissionService;
//# sourceMappingURL=submission.service.js.map