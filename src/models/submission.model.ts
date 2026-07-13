// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Submission
// Single-table design:
//   PK = SUBMISSION#{submissionId}
//   SK = METADATA
//   GSI1PK = DELIVERABLE#{deliverableId}   GSI1SK = SUBMISSION#{studentId}
//   GSI2PK = STUDENT#{studentId}            GSI2SK = SUBMISSION#{submittedAt}
// ─────────────────────────────────────────────────────────────────────────────

import { AttachmentRef } from './deliverable.model';
import { AuditFields, SubmissionStatus } from './common.model';

export interface GradeBreakdown {
  criterionId: string;
  criterionTitle: string;
  marksObtained: number;
  maxMarks: number;
  remarks?: string;
}

export interface Submission extends AuditFields {
  submissionId: string;
  deliverableId: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  courseCode: string;
  batchId: string;
  facultyId: string;

  status: SubmissionStatus;

  submittedAt: string;
  isLate: boolean;
  lateDays: number;

  attachments: AttachmentRef[];
  textContent?: string;
  comments?: string;

  marksObtained?: number;
  totalMarks: number;
  gradedAt?: string;
  gradedBy?: string;
  gradeBreakdown?: GradeBreakdown[];
  feedbackNote?: string;
  latePenaltyApplied?: number;
  finalMarks?: number;
}

// ── DynamoDB Keys ─────────────────────────────────────────────────────────────

export const SubmissionKeys = {
  pk: (id: string) => `SUBMISSION#${id}`,
  sk: () => 'METADATA',
  gsi1pk: (deliverableId: string) => `DELIVERABLE#${deliverableId}`,
  gsi1sk: (studentId: string) => `SUBMISSION#${studentId}`,
  gsi2pk: (studentId: string) => `STUDENT#${studentId}`,
  gsi2sk: (submittedAt: string) => `SUBMISSION#${submittedAt}`,
};

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateSubmissionDto {
  deliverableId: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  courseCode: string;
  batchId: string;
  textContent?: string;
  comments?: string;
}

export interface GradeSubmissionDto {
  marksObtained: number;
  gradeBreakdown?: GradeBreakdown[];
  feedbackNote?: string;
}

// ── DDB Record ────────────────────────────────────────────────────────────────

export interface SubmissionDdbRecord extends Submission {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  entityType: 'SUBMISSION';
}

// ── Serialization ─────────────────────────────────────────────────────────────

export function toSubmissionDdbRecord(
  submission: Submission
): SubmissionDdbRecord {
  return {
    ...submission,
    PK: SubmissionKeys.pk(submission.submissionId),
    SK: SubmissionKeys.sk(),
    GSI1PK: SubmissionKeys.gsi1pk(submission.deliverableId),
    GSI1SK: SubmissionKeys.gsi1sk(submission.studentId),
    GSI2PK: SubmissionKeys.gsi2pk(submission.studentId),
    GSI2SK: SubmissionKeys.gsi2sk(submission.submittedAt),
    entityType: 'SUBMISSION',
  };
}

export function fromSubmissionDdbRecord(
  record: SubmissionDdbRecord
): Submission {
  const {
    PK: _PK,
    SK: _SK,
    GSI1PK: _G1PK,
    GSI1SK: _G1SK,
    GSI2PK: _G2PK,
    GSI2SK: _G2SK,
    entityType: _et,
    ...submission
  } = record;
  return submission;
}
