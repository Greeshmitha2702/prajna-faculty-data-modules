// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Service
// ─────────────────────────────────────────────────────────────────────────────

import { FeedbackRepository, ListFeedbackOptions } from '../repositories/feedback.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Feedback, FeedbackSummary, FeedbackQuestion } from '../models/feedback.model';
import { CreateFeedbackDto, FeedbackResponseDto } from '../models/feedback.model';
import {
  AuthorizerContext,
  FeedbackStatus,
  PaginatedResult,
} from '../models/common.model';
import {
  assertCanWrite,
  assertIsFacultyOrAdmin,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from './errors';

export class FeedbackService {
  constructor(
    private readonly repo: FeedbackRepository,
    private readonly eb: EventBridgeAdapter
  ) {}

  async create(
    dto: CreateFeedbackDto,
    ctx: AuthorizerContext
  ): Promise<Feedback> {
    assertCanWrite(ctx);

    return this.repo.create(
      dto,
      ctx.facultyId,
      ctx.campus,
      ctx.department,
      ctx.userId
    );
  }

  async getById(feedbackId: string, ctx: AuthorizerContext): Promise<Feedback> {
    const feedback = await this.repo.getById(feedbackId);
    if (!feedback) throw new NotFoundError('Feedback', feedbackId);
    assertIsFacultyOrAdmin(ctx, feedback.facultyId);
    return feedback;
  }

  async submitResponse(
    dto: FeedbackResponseDto,
    _ctx: AuthorizerContext
  ): Promise<{ message: string }> {
    const feedback = await this.repo.getById(dto.feedbackId);
    if (!feedback) throw new NotFoundError('Feedback', dto.feedbackId);

    if (feedback.status !== FeedbackStatus.PENDING) {
      throw new ForbiddenError(
        `Feedback is not accepting responses (status: ${feedback.status})`
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    if (today < feedback.collectionStartDate || today > feedback.collectionEndDate) {
      throw new ForbiddenError(
        `Feedback collection is closed (${feedback.collectionStartDate} – ${feedback.collectionEndDate})`
      );
    }

    // Build running summary (in a production system this would be via atomic counter updates)
    const questionMap = new Map<string, FeedbackQuestion>(
      feedback.questions.map((q) => [q.questionId, q])
    );

    const updatedSummary: FeedbackSummary[] = (feedback.summary ?? []).map(
      (s) => ({ ...s })
    );

    for (const response of dto.responses) {
      const question = questionMap.get(response.questionId);
      if (!question) continue;

      const existing = updatedSummary.find((s) => s.questionId === response.questionId);
      if (existing) {
        const newTotal =
          existing.averageScore * existing.responseCount + response.score;
        existing.responseCount += 1;
        existing.averageScore = newTotal / existing.responseCount;
      } else {
        updatedSummary.push({
          questionId: response.questionId,
          averageScore: response.score,
          responseCount: 1,
          category: question.category,
        });
      }
    }

    const totalCount = feedback.totalResponseCount + 1;
    const avgScore =
      updatedSummary.length > 0
        ? updatedSummary.reduce((a, s) => a + s.averageScore, 0) /
          updatedSummary.length
        : 0;

    await this.repo.release(
      dto.feedbackId,
      updatedSummary,
      avgScore,
      totalCount,
      'SYSTEM'
    );

    return { message: 'Response recorded successfully' };
  }

  async release(
    feedbackId: string,
    ctx: AuthorizerContext
  ): Promise<Feedback> {
    assertCanWrite(ctx);
    const feedback = await this.repo.getById(feedbackId);
    if (!feedback) throw new NotFoundError('Feedback', feedbackId);

    assertIsFacultyOrAdmin(ctx, feedback.facultyId);

    if (feedback.status === FeedbackStatus.RELEASED) {
      throw new ValidationError('Feedback is already released');
    }

    const updated = await this.repo.release(
      feedbackId,
      feedback.summary,
      feedback.averageScore,
      feedback.totalResponseCount,
      ctx.userId
    );
    if (!updated) throw new NotFoundError('Feedback', feedbackId);

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

  async list(
    ctx: AuthorizerContext,
    options: ListFeedbackOptions = {}
  ): Promise<PaginatedResult<Feedback>> {
    return this.repo.listByFaculty(ctx.facultyId, options);
  }
}
