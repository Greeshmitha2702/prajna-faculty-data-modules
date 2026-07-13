// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Repository
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { DdbAdapter } from '../adapters/ddb.adapter';
import {
  Deliverable,
  DeliverableDdbRecord,
  DeliverableKeys,
  CreateDeliverableDto,
  UpdateDeliverableDto,
  fromDeliverableDdbRecord,
  toDeliverableDdbRecord,
} from '../models/deliverable.model';
import {
  DeliverableStatus,
  PaginatedResult,
  PaginationOptions,
} from '../models/common.model';

export interface DeliverableFilterOptions extends PaginationOptions {
  courseCode?: string;
  status?: DeliverableStatus;
  semester?: string;
  academicYear?: string;
  batchId?: string;
}

export class DeliverableRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async create(
    dto: CreateDeliverableDto,
    facultyId: string,
    campus: string,
    department: string,
    createdBy: string
  ): Promise<Deliverable> {
    const now = new Date().toISOString();
    const deliverable: Deliverable = {
      deliverableId: uuidv4(),
      facultyId,
      campus,
      department,
      courseCode: dto.courseCode,
      courseTitle: dto.courseTitle,
      batchId: dto.batchId,
      semester: dto.semester,
      academicYear: dto.academicYear,
      title: dto.title,
      description: dto.description,
      type: dto.type,
      status: DeliverableStatus.DRAFT,
      totalMarks: dto.totalMarks,
      passingMarks: dto.passingMarks,
      weightagePercent: dto.weightagePercent,
      dueDate: dto.dueDate,
      allowLateSubmission: dto.allowLateSubmission,
      latePenaltyPercentPerDay: dto.latePenaltyPercentPerDay,
      attachments: [],
      rubric: dto.rubric ?? [],
      submissionCount: 0,
      gradedCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    await this.ddb.put(toDeliverableDdbRecord(deliverable));
    return deliverable;
  }

  async getById(deliverableId: string): Promise<Deliverable | null> {
    const record = await this.ddb.get<DeliverableDdbRecord>({
      PK: DeliverableKeys.pk(deliverableId),
      SK: DeliverableKeys.sk(),
    });
    return record ? fromDeliverableDdbRecord(record) : null;
  }

  async update(
    deliverableId: string,
    dto: UpdateDeliverableDto,
    updatedBy: string
  ): Promise<Deliverable | null> {
    const existing = await this.getById(deliverableId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Deliverable = {
      ...existing,
      ...dto,
      updatedAt: now,
      updatedBy,
      ...(dto.status === DeliverableStatus.PUBLISHED && !existing.publishedAt
        ? { publishedAt: now }
        : {}),
      ...(dto.status === DeliverableStatus.CLOSED && !existing.closedAt
        ? { closedAt: now }
        : {}),
    };

    await this.ddb.put(toDeliverableDdbRecord(updated));
    return updated;
  }

  async delete(deliverableId: string): Promise<void> {
    await this.ddb.delete({
      PK: DeliverableKeys.pk(deliverableId),
      SK: DeliverableKeys.sk(),
    });
  }

  async listByFaculty(
    facultyId: string,
    options: DeliverableFilterOptions = {}
  ): Promise<PaginatedResult<Deliverable>> {
    const { limit = 20, lastKey, courseCode, status } = options;

    let keyCondition = '#gsi1pk = :pk';
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': DeliverableKeys.gsi1pk(facultyId),
    };

    if (courseCode) {
      keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
      names['#gsi1sk'] = 'GSI1SK';
      values[':skPrefix'] = `DELIVERABLE#${courseCode}#`;
    }

    const filters: string[] = [];
    if (status) {
      filters.push('#status = :status');
      names['#status'] = 'status';
      values[':status'] = status;
    }
    if (options.semester) {
      filters.push('#semester = :semester');
      names['#semester'] = 'semester';
      values[':semester'] = options.semester;
    }
    if (options.academicYear) {
      filters.push('#academicYear = :academicYear');
      names['#academicYear'] = 'academicYear';
      values[':academicYear'] = options.academicYear;
    }
    if (options.batchId) {
      filters.push('#batchId = :batchId');
      names['#batchId'] = 'batchId';
      values[':batchId'] = options.batchId;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<DeliverableDdbRecord>({
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
      items: items.map(fromDeliverableDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }

  async listByCourse(
    courseCode: string,
    status?: DeliverableStatus,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Deliverable>> {
    const { limit = 20, lastKey } = options;
    const names: Record<string, string> = { '#gsi2pk': 'GSI2PK' };
    const values: Record<string, unknown> = {
      ':pk': DeliverableKeys.gsi2pk(courseCode),
    };

    let keyCondition = '#gsi2pk = :pk';
    if (status) {
      keyCondition += ' AND begins_with(#gsi2sk, :skPrefix)';
      names['#gsi2sk'] = 'GSI2SK';
      values[':skPrefix'] = `DELIVERABLE#${status}`;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<DeliverableDdbRecord>({
      indexName: 'GSI2',
      keyConditionExpression: keyCondition,
      expressionAttributeNames: names,
      expressionAttributeValues: values,
      limit,
      exclusiveStartKey: lastKey
        ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
        : undefined,
    });

    return {
      items: items.map(fromDeliverableDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }

  async incrementSubmissionCount(deliverableId: string): Promise<void> {
    await this.ddb.updateItem({
      key: {
        PK: DeliverableKeys.pk(deliverableId),
        SK: DeliverableKeys.sk(),
      },
      updateExpression:
        'SET #submissionCount = if_not_exists(#submissionCount, :zero) + :one, #updatedAt = :now',
      expressionAttributeNames: {
        '#submissionCount': 'submissionCount',
        '#updatedAt': 'updatedAt',
      },
      expressionAttributeValues: {
        ':zero': 0,
        ':one': 1,
        ':now': new Date().toISOString(),
      },
    });
  }
}
