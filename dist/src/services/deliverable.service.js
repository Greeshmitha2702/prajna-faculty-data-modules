"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Service
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverableService = void 0;
const common_model_1 = require("../models/common.model");
const errors_1 = require("./errors");
class DeliverableService {
    repo;
    eb;
    constructor(repo, eb) {
        this.repo = repo;
        this.eb = eb;
    }
    async create(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const deliverable = await this.repo.create(dto, ctx.facultyId, ctx.campus, ctx.department, ctx.userId);
        return deliverable;
    }
    async publish(deliverableId, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const deliverable = await this.repo.getById(deliverableId);
        if (!deliverable)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, deliverable.facultyId);
        if (deliverable.status !== common_model_1.DeliverableStatus.DRAFT) {
            throw new errors_1.ValidationError(`Cannot publish deliverable in status: ${deliverable.status}`);
        }
        const updated = await this.repo.update(deliverableId, { status: common_model_1.DeliverableStatus.PUBLISHED }, ctx.userId);
        if (!updated)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        await this.eb.publish({
            eventType: 'deliverable.published',
            facultyId: ctx.facultyId,
            campus: ctx.campus,
            department: ctx.department,
            courseCode: updated.courseCode,
            academicYear: updated.academicYear,
            semester: updated.semester,
            payload: {
                deliverableId: updated.deliverableId,
                title: updated.title,
                type: updated.type,
                dueDate: updated.dueDate,
                totalMarks: updated.totalMarks,
            },
        });
        return updated;
    }
    async getById(deliverableId, ctx) {
        const deliverable = await this.repo.getById(deliverableId);
        if (!deliverable)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, deliverable.facultyId);
        return deliverable;
    }
    async update(deliverableId, dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.repo.getById(deliverableId);
        if (!existing)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        if (existing.status === common_model_1.DeliverableStatus.CLOSED) {
            throw new errors_1.ForbiddenError('Cannot modify a closed deliverable');
        }
        const updated = await this.repo.update(deliverableId, dto, ctx.userId);
        if (!updated)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        return updated;
    }
    async delete(deliverableId, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.repo.getById(deliverableId);
        if (!existing)
            throw new errors_1.NotFoundError('Deliverable', deliverableId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        if (existing.status === common_model_1.DeliverableStatus.PUBLISHED) {
            throw new errors_1.ForbiddenError('Cannot delete a published deliverable');
        }
        await this.repo.delete(deliverableId);
    }
    async list(ctx, options = {}) {
        return this.repo.listByFaculty(ctx.facultyId, options);
    }
    async listByFacultyId(facultyId, ctx, options = {}) {
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, facultyId);
        return this.repo.listByFaculty(facultyId, options);
    }
}
exports.DeliverableService = DeliverableService;
//# sourceMappingURL=deliverable.service.js.map