// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Repository
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { DdbAdapter } from '../adapters/ddb.adapter';
import {
  Submission,
  SubmissionDdbRecord,
  SubmissionKeys,
  CreateSubmissionDto,
  GradeSubmissionDto,
  fromSubmissionDdbRecord,
  toSubmissionDdbRecord,
} from '../models/submission.model';
import {
  PaginatedResult,
  PaginationOptions,
  SubmissionStatus,
} from '../models/common.model';

export interface ListSubmissionsOptions extends PaginationOptions {
  status?: SubmissionStatus;
}

export class SubmissionRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async create(
    dto: CreateSubmissionDto,
    facultyId: string,
    totalMarks: number,
    dueDate: string,
    createdBy: string
  ): Promise<Submission> {
    const now = new Date().toISOString();
    const submittedAt = now;
    const dueDateMs = new Date(dueDate).getTime();
    const submittedMs = new Date(submittedAt).getTime();
    const isLate = submittedMs > dueDateMs;
    const lateDays = isLate
      ? Math.ceil((submittedMs - dueDateMs) / (1000 * 60 * 60 * 24))
      : 0;

    const submission: Submission = {
      submissionId: uuidv4(),
      deliverableId: dto.deliverableId,
      studentId: dto.studentId,
      studentName: dto.studentName,
      enrollmentNo: dto.enrollmentNo,
      courseCode: dto.courseCode,
      batchId: dto.batchId,
      facultyId,
      status: isLate ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED,
      submittedAt,
      isLate,
      lateDays,
      attachments: [],
      textContent: dto.textContent,
      comments: dto.comments,
      totalMarks,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    await this.ddb.put(toSubmissionDdbRecord(submission));
    return submission;
  }

  async getById(submissionId: string): Promise<Submission | null> {
    const record = await this.ddb.get<SubmissionDdbRecord>({
      PK: SubmissionKeys.pk(submissionId),
      SK: SubmissionKeys.sk(),
    });
    return record ? fromSubmissionDdbRecord(record) : null;
  }

  async grade(
    submissionId: string,
    dto: GradeSubmissionDto,
    gradedBy: string,
    latePenaltyPercentPerDay: number
  ): Promise<Submission | null> {
    const existing = await this.getById(submissionId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const penaltyPercent = existing.isLate
      ? Math.min(existing.lateDays * latePenaltyPercentPerDay, 100)
      : 0;
    const penaltyDeduction = (dto.marksObtained * penaltyPercent) / 100;
    const finalMarks = Math.max(0, dto.marksObtained - penaltyDeduction);

    const updated: Submission = {
      ...existing,
      status: SubmissionStatus.GRADED,
      marksObtained: dto.marksObtained,
      gradeBreakdown: dto.gradeBreakdown,
      feedbackNote: dto.feedbackNote,
      latePenaltyApplied: penaltyDeduction,
      finalMarks,
      gradedAt: now,
      gradedBy,
      updatedAt: now,
      updatedBy: gradedBy,
    };

    await this.ddb.put(toSubmissionDdbRecord(updated));
    return updated;
  }

  async listByDeliverable(
    deliverableId: string,
    options: ListSubmissionsOptions = {}
  ): Promise<PaginatedResult<Submission>> {
    const { limit = 20, lastKey, status } = options;
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': SubmissionKeys.gsi1pk(deliverableId),
    };

    const filters: string[] = [];
    if (status) {
      filters.push('#status = :status');
      names['#status'] = 'status';
      values[':status'] = status;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<SubmissionDdbRecord>({
      indexName: 'GSI1',
      keyConditionExpression: '#gsi1pk = :pk',
      filterExpression: filters.length ? filters.join(' AND ') : undefined,
      expressionAttributeNames: names,
      expressionAttributeValues: values,
      limit,
      exclusiveStartKey: lastKey
        ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
        : undefined,
    });

    return {
      items: items.map(fromSubmissionDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }

  async listByStudent(
    studentId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Submission>> {
    const { limit = 20, lastKey } = options;

    const { items, lastKey: nextKey } = await this.ddb.query<SubmissionDdbRecord>({
      indexName: 'GSI2',
      keyConditionExpression: '#gsi2pk = :pk',
      expressionAttributeNames: { '#gsi2pk': 'GSI2PK' },
      expressionAttributeValues: { ':pk': SubmissionKeys.gsi2pk(studentId) },
      limit,
      exclusiveStartKey: lastKey
        ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
        : undefined,
      scanIndexForward: false,
    });

    return {
      items: items.map(fromSubmissionDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}
