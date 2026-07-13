"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Service
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_model_1 = require("../models/common.model");
const errors_1 = require("./errors");
class FeedbackService {
    repo;
    eb;
    constructor(repo, eb) {
        this.repo = repo;
        this.eb = eb;
    }
    async create(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        return this.repo.create(dto, ctx.facultyId, ctx.campus, ctx.department, ctx.userId);
    }
    async getById(feedbackId, ctx) {
        const feedback = await this.repo.getById(feedbackId);
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback', feedbackId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, feedback.facultyId);
        return feedback;
    }
    async submitResponse(dto, _ctx) {
        const feedback = await this.repo.getById(dto.feedbackId);
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback', dto.feedbackId);
        if (feedback.status !== common_model_1.FeedbackStatus.PENDING) {
            throw new errors_1.ForbiddenError(`Feedback is not accepting responses (status: ${feedback.status})`);
        }
        const today = new Date().toISOString().slice(0, 10);
        if (today < feedback.collectionStartDate || today > feedback.collectionEndDate) {
            throw new errors_1.ForbiddenError(`Feedback collection is closed (${feedback.collectionStartDate} – ${feedback.collectionEndDate})`);
        }
        // Build running summary (in a production system this would be via atomic counter updates)
        const questionMap = new Map(feedback.questions.map((q) => [q.questionId, q]));
        const updatedSummary = (feedback.summary ?? []).map((s) => ({ ...s }));
        for (const response of dto.responses) {
            const question = questionMap.get(response.questionId);
            if (!question)
                continue;
            const existing = updatedSummary.find((s) => s.questionId === response.questionId);
            if (existing) {
                const newTotal = existing.averageScore * existing.responseCount + response.score;
                existing.responseCount += 1;
                existing.averageScore = newTotal / existing.responseCount;
            }
            else {
                updatedSummary.push({
                    questionId: response.questionId,
                    averageScore: response.score,
                    responseCount: 1,
                    category: question.category,
                });
            }
        }
        const totalCount = feedback.totalResponseCount + 1;
        const avgScore = updatedSummary.length > 0
            ? updatedSummary.reduce((a, s) => a + s.averageScore, 0) /
                updatedSummary.length
            : 0;
        await this.repo.release(dto.feedbackId, updatedSummary, avgScore, totalCount, 'SYSTEM');
        return { message: 'Response recorded successfully' };
    }
    async release(feedbackId, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const feedback = await this.repo.getById(feedbackId);
        if (!feedback)
            throw new errors_1.NotFoundError('Feedback', feedbackId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, feedback.facultyId);
        if (feedback.status === common_model_1.FeedbackStatus.RELEASED) {
            throw new errors_1.ValidationError('Feedback is already released');
        }
        const updated = await this.repo.release(feedbackId, feedback.summary, feedback.averageScore, feedback.totalResponseCount, ctx.userId);
        if (!updated)
            throw new errors_1.NotFoundError('Feedback', feedbackId);
        await this.eb.publish({
            eventType: 'feedback.released',
            facultyId: ctx.facultyId,
            campus: ctx.campus,
            department: ctx.department,
            courseCode: updated.courseCode,
            academicYear: updated.academicYear,
            semester: updated.semester,
            payload: {
                feedbackId: updated.feedbackId,
                title: updated.title,
                averageScore: updated.averageScore,
                totalResponseCount: updated.totalResponseCount,
                releasedAt: updated.releasedAt,
            },
        });
        return updated;
    }
    async list(ctx, options = {}) {
        return this.repo.listByFaculty(ctx.facultyId, options);
    }
}
exports.FeedbackService = FeedbackService;
//# sourceMappingURL=feedback.service.js.map