// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Service
// ─────────────────────────────────────────────────────────────────────────────

import { SubmissionRepository, ListSubmissionsOptions } from '../repositories/submission.repository';
import { DeliverableRepository } from '../repositories/deliverable.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Submission } from '../models/submission.model';
import { CreateSubmissionDto, GradeSubmissionDto } from '../models/submission.model';
import {
  AuthorizerContext,
  DeliverableStatus,
  PaginatedResult,
} from '../models/common.model';
import {
  assertIsFacultyOrAdmin,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from './errors';

export class SubmissionService {
  constructor(
    private readonly submissionRepo: SubmissionRepository,
    private readonly deliverableRepo: DeliverableRepository,
    private readonly eb: EventBridgeAdapter
  ) {}

  async create(
    dto: CreateSubmissionDto,
    ctx: AuthorizerContext
  ): Promise<Submission> {
    const deliverable = await this.deliverableRepo.getById(dto.deliverableId);
    if (!deliverable) throw new NotFoundError('Deliverable', dto.deliverableId);

    if (deliverable.status !== DeliverableStatus.PUBLISHED) {
      throw new ValidationError(
        'Submissions are only accepted for PUBLISHED deliverables'
      );
    }

    if (!deliverable.allowLateSubmission) {
      const now = new Date();
      const due = new Date(deliverable.dueDate);
      if (now > due) {
        throw new ForbiddenError(
          'Late submissions are not allowed for this deliverable'
        );
      }
    }

    const submission = await this.submissionRepo.create(
      dto,
      deliverable.facultyId,
      deliverable.totalMarks,
      deliverable.dueDate,
      ctx.userId
    );

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

  async grade(
    submissionId: string,
    dto: GradeSubmissionDto,
    ctx: AuthorizerContext
  ): Promise<Submission> {
    const submission = await this.submissionRepo.getById(submissionId);
    if (!submission) throw new NotFoundError('Submission', submissionId);

    assertIsFacultyOrAdmin(ctx, submission.facultyId);

    const deliverable = await this.deliverableRepo.getById(
      submission.deliverableId
    );
    if (!deliverable) throw new NotFoundError('Deliverable', submission.deliverableId);

    if (dto.marksObtained > deliverable.totalMarks) {
      throw new ValidationError(
        `Marks obtained (${dto.marksObtained}) cannot exceed total marks (${deliverable.totalMarks})`
      );
    }

    const graded = await this.submissionRepo.grade(
      submissionId,
      dto,
      ctx.userId,
      deliverable.latePenaltyPercentPerDay
    );
    if (!graded) throw new NotFoundError('Submission', submissionId);

    return graded;
  }

  async getById(
    submissionId: string,
    ctx: AuthorizerContext
  ): Promise<Submission> {
    const submission = await this.submissionRepo.getById(submissionId);
    if (!submission) throw new NotFoundError('Submission', submissionId);
    assertIsFacultyOrAdmin(ctx, submission.facultyId);
    return submission;
  }

  async listByDeliverable(
    deliverableId: string,
    ctx: AuthorizerContext,
    options: ListSubmissionsOptions = {}
  ): Promise<PaginatedResult<Submission>> {
    const deliverable = await this.deliverableRepo.getById(deliverableId);
    if (!deliverable) throw new NotFoundError('Deliverable', deliverableId);
    assertIsFacultyOrAdmin(ctx, deliverable.facultyId);
    return this.submissionRepo.listByDeliverable(deliverableId, options);
  }

  async listByStudent(
    studentId: string,
    _ctx: AuthorizerContext,
    options: ListSubmissionsOptions = {}
  ): Promise<PaginatedResult<Submission>> {
    return this.submissionRepo.listByStudent(studentId, options);
  }
}
