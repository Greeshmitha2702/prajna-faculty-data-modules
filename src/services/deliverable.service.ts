// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Service
// ─────────────────────────────────────────────────────────────────────────────

import { DeliverableRepository, DeliverableFilterOptions } from '../repositories/deliverable.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Deliverable } from '../models/deliverable.model';
import { CreateDeliverableDto, UpdateDeliverableDto } from '../models/deliverable.model';
import { AuthorizerContext, DeliverableStatus, PaginatedResult } from '../models/common.model';
import {
  assertCanWrite,
  assertIsFacultyOrAdmin,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from './errors';

export class DeliverableService {
  constructor(
    private readonly repo: DeliverableRepository,
    private readonly eb: EventBridgeAdapter
  ) {}

  async create(
    dto: CreateDeliverableDto,
    ctx: AuthorizerContext
  ): Promise<Deliverable> {
    assertCanWrite(ctx);

    const deliverable = await this.repo.create(
      dto,
      ctx.facultyId,
      ctx.campus,
      ctx.department,
      ctx.userId
    );

    return deliverable;
  }

  async publish(
    deliverableId: string,
    ctx: AuthorizerContext
  ): Promise<Deliverable> {
    assertCanWrite(ctx);
    const deliverable = await this.repo.getById(deliverableId);
    if (!deliverable) throw new NotFoundError('Deliverable', deliverableId);

    assertIsFacultyOrAdmin(ctx, deliverable.facultyId);

    if (deliverable.status !== DeliverableStatus.DRAFT) {
      throw new ValidationError(
        `Cannot publish deliverable in status: ${deliverable.status}`
      );
    }

    const updated = await this.repo.update(
      deliverableId,
      { status: DeliverableStatus.PUBLISHED },
      ctx.userId
    );
    if (!updated) throw new NotFoundError('Deliverable', deliverableId);

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

  async getById(
    deliverableId: string,
    ctx: AuthorizerContext
  ): Promise<Deliverable> {
    const deliverable = await this.repo.getById(deliverableId);
    if (!deliverable) throw new NotFoundError('Deliverable', deliverableId);
    assertIsFacultyOrAdmin(ctx, deliverable.facultyId);
    return deliverable;
  }

  async update(
    deliverableId: string,
    dto: UpdateDeliverableDto,
    ctx: AuthorizerContext
  ): Promise<Deliverable> {
    assertCanWrite(ctx);
    const existing = await this.repo.getById(deliverableId);
    if (!existing) throw new NotFoundError('Deliverable', deliverableId);

    assertIsFacultyOrAdmin(ctx, existing.facultyId);

    if (existing.status === DeliverableStatus.CLOSED) {
      throw new ForbiddenError('Cannot modify a closed deliverable');
    }

    const updated = await this.repo.update(deliverableId, dto, ctx.userId);
    if (!updated) throw new NotFoundError('Deliverable', deliverableId);

    return updated;
  }

  async delete(
    deliverableId: string,
    ctx: AuthorizerContext
  ): Promise<void> {
    assertCanWrite(ctx);
    const existing = await this.repo.getById(deliverableId);
    if (!existing) throw new NotFoundError('Deliverable', deliverableId);

    assertIsFacultyOrAdmin(ctx, existing.facultyId);

    if (existing.status === DeliverableStatus.PUBLISHED) {
      throw new ForbiddenError('Cannot delete a published deliverable');
    }

    await this.repo.delete(deliverableId);
  }

  async list(
    ctx: AuthorizerContext,
    options: DeliverableFilterOptions = {}
  ): Promise<PaginatedResult<Deliverable>> {
    return this.repo.listByFaculty(ctx.facultyId, options);
  }

  async listByFacultyId(
    facultyId: string,
    ctx: AuthorizerContext,
    options: DeliverableFilterOptions = {}
  ): Promise<PaginatedResult<Deliverable>> {
    assertIsFacultyOrAdmin(ctx, facultyId);
    return this.repo.listByFaculty(facultyId, options);
  }
}
