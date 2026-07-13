// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: GradeBookSummary
// Single-table design:
//   PK = GRADEBOOK#{facultyId}#{courseCode}#{batchId}#{academicYear}#{semester}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}
//   GSI1SK = GRADEBOOK#{academicYear}#{semester}
// ─────────────────────────────────────────────────────────────────────────────

import { AuditFields } from './common.model';

export interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  totalMarksObtained: number;
  totalMarks: number;
  percentageScore: number;
  grade: string;
  gradePoint: number;
  submittedDeliverables: number;
  totalDeliverables: number;
  attendancePercentage: number;
  remarks?: string;
}

export interface DeliverableGradeSummary {
  deliverableId: string;
  deliverableTitle: string;
  type: string;
  totalMarks: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  submissionCount: number;
  totalStudents: number;
}

export interface GradeBookSummary extends AuditFields {
  gradebookId: string;
  facultyId: string;
  courseCode: string;
  courseTitle: string;
  batchId: string;
  semester: string;
  academicYear: string;
  campus: string;
  department: string;

  totalStudents: number;
  totalDeliverables: number;
  classAverageScore: number;
  classHighestScore: number;
  classLowestScore: number;
  passCount: number;
  failCount: number;
  passPercentage: number;

  gradeDistribution: Record<string, number>; // grade -> count
  deliverableSummaries: DeliverableGradeSummary[];
  studentEntries: StudentGradeEntry[];

  lastSyncedAt: string;
}

// ── DynamoDB Keys ─────────────────────────────────────────────────────────────

export const GradeBookKeys = {
  pk: (
    facultyId: string,
    courseCode: string,
    batchId: string,
    academicYear: string,
    semester: string
  ) => `GRADEBOOK#${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`,
  sk: () => 'METADATA',
  gsi1pk: (facultyId: string) => `FACULTY#${facultyId}`,
  gsi1sk: (academicYear: string, semester: string) =>
    `GRADEBOOK#${academicYear}#${semester}`,
  id: (
    facultyId: string,
    courseCode: string,
    batchId: string,
    academicYear: string,
    semester: string
  ) =>
    `${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`,
};

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface GetGradeBookDto {
  courseCode: string;
  batchId: string;
  semester: string;
  academicYear: string;
}

// ── DDB Record ────────────────────────────────────────────────────────────────

export interface GradeBookDdbRecord extends GradeBookSummary {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  entityType: 'GRADEBOOK';
}

// ── Grade Calculation ─────────────────────────────────────────────────────────

export function calculateGrade(percentage: number): { grade: string; gradePoint: number } {
  if (percentage >= 90) return { grade: 'O', gradePoint: 10 };
  if (percentage >= 80) return { grade: 'A+', gradePoint: 9 };
  if (percentage >= 70) return { grade: 'A', gradePoint: 8 };
  if (percentage >= 60) return { grade: 'B+', gradePoint: 7 };
  if (percentage >= 50) return { grade: 'B', gradePoint: 6 };
  if (percentage >= 45) return { grade: 'C', gradePoint: 5 };
  if (percentage >= 40) return { grade: 'D', gradePoint: 4 };
  return { grade: 'F', gradePoint: 0 };
}

// ── Serialization ─────────────────────────────────────────────────────────────

export function toGradeBookDdbRecord(
  gradebook: GradeBookSummary
): GradeBookDdbRecord {
  return {
    ...gradebook,
    PK: GradeBookKeys.pk(
      gradebook.facultyId,
      gradebook.courseCode,
      gradebook.batchId,
      gradebook.academicYear,
      gradebook.semester
    ),
    SK: GradeBookKeys.sk(),
    GSI1PK: GradeBookKeys.gsi1pk(gradebook.facultyId),
    GSI1SK: GradeBookKeys.gsi1sk(gradebook.academicYear, gradebook.semester),
    entityType: 'GRADEBOOK',
  };
}

export function fromGradeBookDdbRecord(
  record: GradeBookDdbRecord
): GradeBookSummary {
  const {
    PK: _PK,
    SK: _SK,
    GSI1PK: _G1PK,
    GSI1SK: _G1SK,
    entityType: _et,
    ...gradebook
  } = record;
  return gradebook;
}
