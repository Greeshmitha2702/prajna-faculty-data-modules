// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Repository
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { DdbAdapter } from '../adapters/ddb.adapter';
import {
  GradeBookSummary,
  GradeBookDdbRecord,
  GradeBookKeys,
  fromGradeBookDdbRecord,
  toGradeBookDdbRecord,
  calculateGrade,
  StudentGradeEntry,
  DeliverableGradeSummary,
} from '../models/gradebook.model';
import { Submission } from '../models/submission.model';
import { Deliverable } from '../models/deliverable.model';
import { PaginatedResult, PaginationOptions, SubmissionStatus } from '../models/common.model';

export class GradeBookRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async upsert(
    facultyId: string,
    courseCode: string,
    courseTitle: string,
    batchId: string,
    semester: string,
    academicYear: string,
    campus: string,
    department: string,
    deliverables: Deliverable[],
    submissions: Submission[],
    updatedBy: string
  ): Promise<GradeBookSummary> {
    const gradebookId = GradeBookKeys.id(
      facultyId,
      courseCode,
      batchId,
      academicYear,
      semester
    );

    // Build per-student grade map
    const studentMap = new Map<string, {
      studentId: string;
      studentName: string;
      enrollmentNo: string;
      totalMarksObtained: number;
      totalMarks: number;
      submittedDeliverables: number;
    }>();

    const totalMaxMarks = deliverables.reduce((a, d) => a + d.totalMarks, 0);

    for (const sub of submissions.filter(
      (s) => s.status === SubmissionStatus.GRADED
    )) {
      if (!studentMap.has(sub.studentId)) {
        studentMap.set(sub.studentId, {
          studentId: sub.studentId,
          studentName: sub.studentName,
          enrollmentNo: sub.enrollmentNo,
          totalMarksObtained: 0,
          totalMarks: totalMaxMarks,
          submittedDeliverables: 0,
        });
      }
      const entry = studentMap.get(sub.studentId)!;
      entry.totalMarksObtained += sub.finalMarks ?? sub.marksObtained ?? 0;
      entry.submittedDeliverables += 1;
    }

    const studentEntries: StudentGradeEntry[] = Array.from(studentMap.values()).map(
      (e) => {
        const pct = totalMaxMarks > 0 ? (e.totalMarksObtained / totalMaxMarks) * 100 : 0;
        const { grade, gradePoint } = calculateGrade(pct);
        return {
          ...e,
          totalDeliverables: deliverables.length,
          percentageScore: Math.round(pct * 100) / 100,
          grade,
          gradePoint,
          attendancePercentage: 0, // populated from attendance service if needed
        };
      }
    );

    // Grade distribution
    const gradeDistribution: Record<string, number> = {};
    for (const e of studentEntries) {
      gradeDistribution[e.grade] = (gradeDistribution[e.grade] ?? 0) + 1;
    }

    // Deliverable summaries
    const deliverableSummaries: DeliverableGradeSummary[] = deliverables.map((d) => {
      const dSubs = submissions.filter(
        (s) => s.deliverableId === d.deliverableId && s.status === SubmissionStatus.GRADED
      );
      const marks = dSubs.map((s) => s.finalMarks ?? s.marksObtained ?? 0);
      return {
        deliverableId: d.deliverableId,
        deliverableTitle: d.title,
        type: d.type,
        totalMarks: d.totalMarks,
        averageMarks: marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0,
        highestMarks: marks.length ? Math.max(...marks) : 0,
        lowestMarks: marks.length ? Math.min(...marks) : 0,
        submissionCount: dSubs.length,
        totalStudents: d.submissionCount,
      };
    });

    const scores = studentEntries.map((e) => e.percentageScore);
    const passCount = studentEntries.filter((e) => e.grade !== 'F').length;

    const now = new Date().toISOString();
    const existing = await this.getById(gradebookId);

    const gradebook: GradeBookSummary = {
      gradebookId,
      facultyId,
      courseCode,
      courseTitle,
      batchId,
      semester,
      academicYear,
      campus,
      department,
      totalStudents: studentEntries.length,
      totalDeliverables: deliverables.length,
      classAverageScore:
        scores.length
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
          : 0,
      classHighestScore: scores.length ? Math.max(...scores) : 0,
      classLowestScore: scores.length ? Math.min(...scores) : 0,
      passCount,
      failCount: studentEntries.length - passCount,
      passPercentage:
        studentEntries.length
          ? Math.round((passCount / studentEntries.length) * 10000) / 100
          : 0,
      gradeDistribution,
      deliverableSummaries,
      studentEntries,
      lastSyncedAt: now,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      createdBy: existing?.createdBy ?? updatedBy,
      updatedBy,
    };

    await this.ddb.put(toGradeBookDdbRecord(gradebook));
    return gradebook;
  }

  async getById(gradebookId: string): Promise<GradeBookSummary | null> {
    const [facultyId, courseCode, batchId, academicYear, semester] =
      gradebookId.split('#');
    const record = await this.ddb.get<GradeBookDdbRecord>({
      PK: GradeBookKeys.pk(facultyId, courseCode, batchId, academicYear, semester),
      SK: GradeBookKeys.sk(),
    });
    return record ? fromGradeBookDdbRecord(record) : null;
  }

  async listByFaculty(
    facultyId: string,
    options: PaginationOptions & { academicYear?: string; semester?: string } = {}
  ): Promise<PaginatedResult<GradeBookSummary>> {
    const { limit = 20, lastKey, academicYear, semester } = options;
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': GradeBookKeys.gsi1pk(facultyId),
    };

    let keyCondition = '#gsi1pk = :pk';
    if (academicYear && semester) {
      keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
      names['#gsi1sk'] = 'GSI1SK';
      values[':skPrefix'] = `GRADEBOOK#${academicYear}#${semester}`;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<GradeBookDdbRecord>({
      indexName: 'GSI1',
      keyConditionExpression: keyCondition,
      expressionAttributeNames: names,
      expressionAttributeValues: values,
      limit,
      exclusiveStartKey: lastKey
        ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
        : undefined,
      scanIndexForward: false,
    });

    return {
      items: items.map(fromGradeBookDdbRecord),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}
