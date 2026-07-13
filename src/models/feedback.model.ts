// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Feedback
// Single-table design:
//   PK = FEEDBACK#{feedbackId}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}   GSI1SK = FEEDBACK#{academicYear}#{semester}
//   GSI2PK = COURSE#{courseCode}   GSI2SK = FEEDBACK#{type}#{status}
// ─────────────────────────────────────────────────────────────────────────────

import { AuditFields, FeedbackStatus, FeedbackType } from './common.model';

export interface FeedbackQuestion {
  questionId: string;
  text: string;
  category: string;
  maxScore: number;
}

export interface FeedbackResponse {
  questionId: string;
  score: number;
  comment?: string;
}

export interface FeedbackSummary {
  questionId: string;
  averageScore: number;
  responseCount: number;
  category: string;
}

export interface Feedback extends AuditFields {
  feedbackId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;

  type: FeedbackType;
  status: FeedbackStatus;

  title: string;
  description?: string;
  questions: FeedbackQuestion[];

  totalResponseCount: number;
  averageScore: number;
  summary?: FeedbackSummary[];

  collectionStartDate: string;
  collectionEndDate: string;
  releasedAt?: string;
  releasedBy?: string;
}

// ── DynamoDB Keys ─────────────────────────────────────────────────────────────

export const FeedbackKeys = {
  pk: (id: string) => `FEEDBACK#${id}`,
  sk: () => 'METADATA',
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (academicYear: string, semester: string) =>
    `FEEDBACK#${academicYear}#${semester}`,
  gsi2pk: (courseCode: string) => `COURSE#${courseCode}`,
  gsi2sk: (type: FeedbackType, status: FeedbackStatus) =>
    `FEEDBACK#${type}#${status}`,
};

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateFeedbackDto {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  type: FeedbackType;
  title: string;
  description?: string;
  questions: FeedbackQuestion[];
  collectionStartDate: string;
  collectionEndDate: string;
}

export interface FeedbackResponseDto {
  feedbackId: string;
  responses: FeedbackResponse[];
}

// ── DDB Record ────────────────────────────────────────────────────────────────

export interface FeedbackDdbRecord extends Feedback {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  entityType: 'FEEDBACK';
}

// ── Serialization ─────────────────────────────────────────────────────────────

export function toFeedbackDdbRecord(feedback: Feedback): FeedbackDdbRecord {
  return {
    ...feedback,
    PK: FeedbackKeys.pk(feedback.feedbackId),
    SK: FeedbackKeys.sk(),
    GSI1PK: FeedbackKeys.gsi1pk(feedback.facultyId),
    GSI1SK: FeedbackKeys.gsi1sk(feedback.academicYear, feedback.semester),
    GSI2PK: FeedbackKeys.gsi2pk(feedback.courseCode),
    GSI2SK: FeedbackKeys.gsi2sk(feedback.type, feedback.status),
    entityType: 'FEEDBACK',
  };
}

export function fromFeedbackDdbRecord(record: FeedbackDdbRecord): Feedback {
  const {
    PK: _PK,
    SK: _SK,
    GSI1PK: _G1PK,
    GSI1SK: _G1SK,
    GSI2PK: _G2PK,
    GSI2SK: _G2SK,
    entityType: _et,
    ...feedback
  } = record;
  return feedback;
}
