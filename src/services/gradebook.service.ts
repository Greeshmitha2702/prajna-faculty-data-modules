// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Service
// ─────────────────────────────────────────────────────────────────────────────

import { GradeBookRepository } from '../repositories/gradebook.repository';
import { DeliverableRepository } from '../repositories/deliverable.repository';
import { SubmissionRepository } from '../repositories/submission.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { GradeBookSummary } from '../models/gradebook.model';
import {
  AuthorizerContext,
  DeliverableStatus,
  PaginatedResult,
  PaginationOptions,
} from '../models/common.model';
import {
  assertIsFacultyOrAdmin,
  NotFoundError,
} from './errors';

export class GradeBookService {
  constructor(
    private readonly gradebookRepo: GradeBookRepository,
    private readonly deliverableRepo: DeliverableRepository,
    private readonly submissionRepo: SubmissionRepository,
    private readonly eb: EventBridgeAdapter
  ) {}

  async getOrSync(
    courseCode: string,
    batchId: string,
    semester: string,
    academicYear: string,
    ctx: AuthorizerContext
  ): Promise<GradeBookSummary> {
    // Fetch published deliverables for the course
    const deliverableResult = await this.deliverableRepo.listByCourse(
      courseCode,
      DeliverableStatus.PUBLISHED,
      { limit: 100 }
    );
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
    const gradebook = await this.gradebookRepo.upsert(
      ctx.facultyId,
      courseCode,
      deliverables[0]?.courseTitle ?? courseCode,
      batchId,
      semester,
      academicYear,
      ctx.campus,
      ctx.department,
      deliverables,
      allSubmissions,
      ctx.userId
    );

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

  async listByFaculty(
    ctx: AuthorizerContext,
    options: PaginationOptions & { academicYear?: string; semester?: string } = {}
  ): Promise<PaginatedResult<GradeBookSummary>> {
    return this.gradebookRepo.listByFaculty(ctx.facultyId, options);
  }

  async getByFacultyId(
    facultyId: string,
    courseCode: string,
    batchId: string,
    semester: string,
    academicYear: string,
    ctx: AuthorizerContext
  ): Promise<GradeBookSummary> {
    assertIsFacultyOrAdmin(ctx, facultyId);
    const gradebookId = `${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`;
    const gradebook = await this.gradebookRepo.getById(gradebookId);
    if (!gradebook) throw new NotFoundError('GradeBook', gradebookId);
    return gradebook;
  }
}
