// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Repository
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { DdbAdapter } from '../adapters/ddb.adapter';
import {
  Feedback,
  FeedbackDdbRecord,
  FeedbackKeys,
  CreateFeedbackDto,
  fromFeedbackDdbRecord,
  toFeedbackDdbRecord,
} from '../models/feedback.model';
import {
  FeedbackStatus,
  FeedbackType,
  PaginatedResult,
  PaginationOptions,
} from '../models/common.model';

export interface ListFeedbackOptions extends PaginationOptions {
  type?: FeedbackType;
  status?: FeedbackStatus;
  semester?: string;
  academicYear?: string;
  courseCode?: string;
}

export class FeedbackRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async create(
    dto: CreateFeedbackDto,
    facultyId: string,
    campus: string,
    department: string,
    createdBy: string
  ): Promise<Feedback> {
    const now = new Date().toISOString();
    const feedback: Feedback = {
      feedbackId: uuidv4(),
      facultyId,
      campus,
      department,
      courseCode: dto.courseCode,
      courseTitle: dto.courseTitle,
      batchId: dto.batchId,
      semester: dto.semester,
      academicYear: dto.academicYear,
      type: dto.type,
      status: FeedbackStatus.PENDING,
      title: dto.title,
      description: dto.description,
      questions: dto.questions,
      totalResponseCount: 0,
      averageScore: 0,
      collectionStartDate: dto.collectionStartDate,
      collectionEndDate: dto.collectionEndDate,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    await this.ddb.put(toFeedbackDdbRecord(feedback));
    return feedback;
  }

  async getById(feedbackId: string): Promise<Feedback | null> {
    const record = await this.ddb.get<FeedbackDdbRecord>({
      PK: FeedbackKeys.pk(feedbackId),
      SK: FeedbackKeys.sk(),
    });
    return record ? fromFeedbackDdbRecord(record) : null;
  }

  async release(
    feedbackId: string,
    summary: Feedback['summary'],
    averageScore: number,
    totalResponseCount: number,
    releasedBy: string
  ): Promise<Feedback | null> {
    const existing = await this.getById(feedbackId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Feedback = {
      ...existing,
      status: FeedbackStatus.RELEASED,
      summary,
      averageScore,
      totalResponseCount,
      releasedAt: now,
      releasedBy,
      updatedAt: now,
      updatedBy: releasedBy,
    };

    await this.ddb.put(toFeedbackDdbRecord(updated));
    return updated;
  }

  async listByFaculty(
    facultyId: string,
    options: ListFeedbackOptions = {}
  ): Promise<PaginatedResult<Feedback>> {
    const { limit = 20, lastKey } = options;
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': FeedbackKeys.gsi1pk(facultyId),
    };

    let keyCondition = '#gsi1pk = :pk';
    if (options.academicYear && options.semester) {
      keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
      names['#gsi1sk'] = 'GSI1SK';
      values[':skPrefix'] = `FEEDBACK#${options.academicYear}#${options.semester}`;
    }

    const filters: string[] = [];
    if (options.type) {
      filters.push('#feedbackType = :feedbackType');
      names['#feedbackType'] = 'type';
      values[':feedbackType'] = options.type;
    }
    if (options.status) {
      filters.push('#feedbackStatus = :feedbackStatus');
      names['#feedbackStatus'] = 'status';
      values[':feedbackStatus'] = options.status;
    }
    if (options.courseCode) {
      filters.push('#courseCode = :courseCode');
      names['#courseCode'] = 'courseCode';
      values[':courseCode'] = options.courseCode;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<FeedbackDdbRecord>({
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
      items: items.map(fromFeedbackDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}
