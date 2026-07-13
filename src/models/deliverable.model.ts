// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Deliverable
// Single-table design:
//   PK = DELIVERABLE#{deliverableId}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}   GSI1SK = DELIVERABLE#{courseCode}#{dueDate}
//   GSI2PK = COURSE#{courseCode}   GSI2SK = DELIVERABLE#{status}
// ─────────────────────────────────────────────────────────────────────────────

import { AuditFields, DeliverableStatus, DeliverableType } from './common.model';

export interface AttachmentRef {
  fileName: string;
  s3Key: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  maxMarks: number;
  weight: number; // percentage
}

export interface Deliverable extends AuditFields {
  deliverableId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;

  title: string;
  description: string;
  type: DeliverableType;
  status: DeliverableStatus;

  totalMarks: number;
  passingMarks: number;
  weightagePercent: number;

  publishedAt?: string;
  dueDate: string;
  closedAt?: string;

  allowLateSubmission: boolean;
  latePenaltyPercentPerDay: number;

  attachments: AttachmentRef[];
  rubric: RubricCriterion[];

  submissionCount: number;
  gradedCount: number;
}

// ── DynamoDB Keys ─────────────────────────────────────────────────────────────

export const DeliverableKeys = {
  pk: (id: string) => `DELIVERABLE#${id}`,
  sk: () => 'METADATA',
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (courseCode: string, dueDate: string) =>
    `DELIVERABLE#${courseCode}#${dueDate}`,
  gsi2pk: (courseCode: string) => `COURSE#${courseCode}`,
  gsi2sk: (status: DeliverableStatus) => `DELIVERABLE#${status}`,
};

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface CreateDeliverableDto {
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  title: string;
  description: string;
  type: DeliverableType;
  totalMarks: number;
  passingMarks: number;
  weightagePercent: number;
  dueDate: string;
  allowLateSubmission: boolean;
  latePenaltyPercentPerDay: number;
  rubric?: RubricCriterion[];
}

export interface UpdateDeliverableDto {
  title?: string;
  description?: string;
  totalMarks?: number;
  passingMarks?: number;
  weightagePercent?: number;
  dueDate?: string;
  status?: DeliverableStatus;
  allowLateSubmission?: boolean;
  latePenaltyPercentPerDay?: number;
  rubric?: RubricCriterion[];
}

// ── DDB Record ────────────────────────────────────────────────────────────────

export interface DeliverableDdbRecord extends Deliverable {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  entityType: 'DELIVERABLE';
}

// ── Serialization ─────────────────────────────────────────────────────────────

export function toDeliverableDdbRecord(
  deliverable: Deliverable
): DeliverableDdbRecord {
  return {
    ...deliverable,
    PK: DeliverableKeys.pk(deliverable.deliverableId),
    SK: DeliverableKeys.sk(),
    GSI1PK: DeliverableKeys.gsi1pk(deliverable.facultyId),
    GSI1SK: DeliverableKeys.gsi1sk(
      deliverable.courseCode,
      deliverable.dueDate
    ),
    GSI2PK: DeliverableKeys.gsi2pk(deliverable.courseCode),
    GSI2SK: DeliverableKeys.gsi2sk(deliverable.status),
    entityType: 'DELIVERABLE',
  };
}

export function fromDeliverableDdbRecord(
  record: DeliverableDdbRecord
): Deliverable {
  const {
    PK: _PK,
    SK: _SK,
    GSI1PK: _G1PK,
    GSI1SK: _G1SK,
    GSI2PK: _G2PK,
    GSI2SK: _G2SK,
    entityType: _et,
    ...deliverable
  } = record;
  return deliverable;
}
