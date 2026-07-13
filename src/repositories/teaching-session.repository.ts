// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Teaching Session Repository
// Covers: LessonPlans, Attendance Sessions, Teaching Sessions
// ─────────────────────────────────────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';
import { DdbAdapter } from '../adapters/ddb.adapter';
import {
  LessonPlan,
  LessonPlanDdbRecord,
  LessonPlanKeys,
  CreateLessonPlanDto,
  UpdateLessonPlanDto,
  AttendanceSession,
  AttendanceRecord,
  AttendanceKeys,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  TeachingSession,
  SessionDdbRecord,
  SessionKeys,
  CreateSessionDto,
  UpdateSessionDto,
  TeachingLoad,
  Timetable,
} from '../models/teaching-session.model';
import {
  AttendanceStatus,
  PaginatedResult,
  PaginationOptions,
  SessionStatus,
} from '../models/common.model';

// ── Lesson Plan Repository ────────────────────────────────────────────────────

export class LessonPlanRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async create(
    dto: CreateLessonPlanDto,
    facultyId: string,
    campus: string,
    department: string,
    createdBy: string
  ): Promise<LessonPlan> {
    const now = new Date().toISOString();
    const plan: LessonPlan = {
      planId: uuidv4(),
      facultyId,
      campus,
      department,
      ...dto,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    const record: LessonPlanDdbRecord = {
      ...plan,
      PK: LessonPlanKeys.pk(plan.planId),
      SK: LessonPlanKeys.sk(),
      GSI1PK: LessonPlanKeys.gsi1pk(facultyId),
      GSI1SK: LessonPlanKeys.gsi1sk(dto.courseCode, dto.date),
      entityType: 'LESSON_PLAN',
    };

    await this.ddb.put(record);
    return plan;
  }

  async getById(planId: string): Promise<LessonPlan | null> {
    const record = await this.ddb.get<LessonPlanDdbRecord>({
      PK: LessonPlanKeys.pk(planId),
      SK: LessonPlanKeys.sk(),
    });
    if (!record) return null;
    const { PK: _pk, SK: _sk, GSI1PK: _g1pk, GSI1SK: _g1sk, entityType: _et, ...plan } = record;
    return plan;
  }

  async update(
    planId: string,
    dto: UpdateLessonPlanDto,
    updatedBy: string
  ): Promise<LessonPlan | null> {
    const existing = await this.getById(planId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: LessonPlan = { ...existing, ...dto, updatedAt: now, updatedBy };
    const record: LessonPlanDdbRecord = {
      ...updated,
      PK: LessonPlanKeys.pk(planId),
      SK: LessonPlanKeys.sk(),
      GSI1PK: LessonPlanKeys.gsi1pk(updated.facultyId),
      GSI1SK: LessonPlanKeys.gsi1sk(updated.courseCode, updated.date),
      entityType: 'LESSON_PLAN',
    };

    await this.ddb.put(record);
    return updated;
  }

  async delete(planId: string): Promise<void> {
    await this.ddb.delete({
      PK: LessonPlanKeys.pk(planId),
      SK: LessonPlanKeys.sk(),
    });
  }

  async listByFaculty(
    facultyId: string,
    options: PaginationOptions & { courseCode?: string; from?: string; to?: string } = {}
  ): Promise<PaginatedResult<LessonPlan>> {
    const { limit = 20, lastKey, courseCode, from, to } = options;
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': LessonPlanKeys.gsi1pk(facultyId),
    };

    let keyCondition = '#gsi1pk = :pk';
    if (courseCode) {
      keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
      names['#gsi1sk'] = 'GSI1SK';
      values[':skPrefix'] = `LESSON_PLAN#${courseCode}#`;
    }

    const filters: string[] = [];
    if (from) {
      filters.push('#date >= :from');
      names['#date'] = 'date';
      values[':from'] = from;
    }
    if (to) {
      filters.push('#date <= :to');
      names['#date'] = 'date';
      values[':to'] = to;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<LessonPlanDdbRecord>({
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
      items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1pk, GSI1SK: _g1sk, entityType: _et, ...p }) => p),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}

// ── Attendance Repository ─────────────────────────────────────────────────────

export class AttendanceRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async createSession(
    dto: CreateAttendanceDto,
    facultyId: string,
    campus: string,
    department: string,
    createdBy: string
  ): Promise<AttendanceSession> {
    const now = new Date().toISOString();
    const sessionId = uuidv4();
    const presentCount = dto.records.filter(
      (r) => r.status === AttendanceStatus.PRESENT
    ).length;
    const absentCount = dto.records.filter(
      (r) => r.status === AttendanceStatus.ABSENT
    ).length;
    const lateCount = dto.records.filter(
      (r) => r.status === AttendanceStatus.LATE
    ).length;
    const excusedCount = dto.records.filter(
      (r) => r.status === AttendanceStatus.EXCUSED
    ).length;
    const total = dto.records.length;

    const session: AttendanceSession = {
      sessionId,
      facultyId,
      campus,
      department,
      courseCode: dto.courseCode,
      courseTitle: dto.courseTitle,
      batchId: dto.batchId,
      semester: dto.semester,
      academicYear: dto.academicYear,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      topic: dto.topic,
      totalStudents: total,
      presentCount,
      absentCount,
      lateCount,
      excusedCount,
      attendancePercentage: total > 0 ? (presentCount / total) * 100 : 0,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    // Store session metadata
    await this.ddb.put({
      PK: AttendanceKeys.sessionPk(sessionId),
      SK: AttendanceKeys.sessionSk(),
      GSI1PK: AttendanceKeys.gsi1pk(facultyId),
      GSI1SK: AttendanceKeys.gsi1sk(dto.courseCode, dto.date),
      entityType: 'ATTENDANCE_SESSION',
      ...session,
    });

    // Store individual student records
    for (const record of dto.records) {
      const studentRecord: AttendanceRecord = {
        sessionId,
        studentId: record.studentId,
        studentName: record.studentName,
        enrollmentNo: record.enrollmentNo,
        courseCode: dto.courseCode,
        batchId: dto.batchId,
        facultyId,
        campus,
        department,
        date: dto.date,
        status: record.status,
        remarks: record.remarks,
        createdAt: now,
        updatedAt: now,
        createdBy,
        updatedBy: createdBy,
      };
      await this.ddb.put({
        PK: AttendanceKeys.sessionPk(sessionId),
        SK: AttendanceKeys.studentSk(record.studentId),
        entityType: 'ATTENDANCE_RECORD',
        ...studentRecord,
      });
    }

    return session;
  }

  async getSessionById(sessionId: string): Promise<AttendanceSession | null> {
    const record = await this.ddb.get<AttendanceSession & { PK: string; SK: string; entityType: string }>({
      PK: AttendanceKeys.sessionPk(sessionId),
      SK: AttendanceKeys.sessionSk(),
    });
    if (!record) return null;
    const { PK: _pk, SK: _sk, entityType: _et, ...session } = record;
    return session;
  }

  async updateSession(
    dto: UpdateAttendanceDto,
    updatedBy: string
  ): Promise<void> {
    const { sessionId, records } = dto;
    const now = new Date().toISOString();

    for (const r of records) {
      await this.ddb.updateItem({
        key: {
          PK: AttendanceKeys.sessionPk(sessionId),
          SK: AttendanceKeys.studentSk(r.studentId),
        },
        updateExpression: 'SET #status = :status, #remarks = :remarks, #updatedAt = :now, #updatedBy = :by',
        expressionAttributeNames: {
          '#status': 'status',
          '#remarks': 'remarks',
          '#updatedAt': 'updatedAt',
          '#updatedBy': 'updatedBy',
        },
        expressionAttributeValues: {
          ':status': r.status,
          ':remarks': r.remarks ?? '',
          ':now': now,
          ':by': updatedBy,
        },
      });
    }
  }

  async listByFaculty(
    facultyId: string,
    options: PaginationOptions & { courseCode?: string; from?: string; to?: string } = {}
  ): Promise<PaginatedResult<AttendanceSession>> {
    const { limit = 20, lastKey, courseCode, from, to } = options;
    const names: Record<string, string> = {
      '#gsi1pk': 'GSI1PK',
      '#sk': 'SK',
    };
    const values: Record<string, unknown> = {
      ':pk': AttendanceKeys.gsi1pk(facultyId),
      ':skMeta': 'SESSION_META',
    };

    let keyCondition = '#gsi1pk = :pk';
    if (courseCode) {
      keyCondition += ' AND begins_with(#gsi1sk, :skPrefix)';
      names['#gsi1sk'] = 'GSI1SK';
      values[':skPrefix'] = `ATTENDANCE#${courseCode}#`;
    }

    const filters: string[] = ['#sk = :skMeta'];
    if (from) {
      filters.push('#date >= :from');
      names['#date'] = 'date';
      values[':from'] = from;
    }
    if (to) {
      filters.push('#date <= :to');
      names['#date'] = 'date';
      values[':to'] = to;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<AttendanceSession & { PK: string; SK: string; GSI1PK: string; GSI1SK: string; entityType: string }>({
      indexName: 'GSI1',
      keyConditionExpression: keyCondition,
      filterExpression: filters.join(' AND '),
      expressionAttributeNames: names,
      expressionAttributeValues: values,
      limit,
      exclusiveStartKey: lastKey
        ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
        : undefined,
      scanIndexForward: false,
    });

    return {
      items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...s }) => s),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}

// ── Teaching Session Repository ───────────────────────────────────────────────

export class TeachingSessionRepository {
  constructor(private readonly ddb: DdbAdapter) {}

  async create(
    dto: CreateSessionDto,
    facultyId: string,
    campus: string,
    department: string,
    createdBy: string
  ): Promise<TeachingSession> {
    const now = new Date().toISOString();
    const startMs = new Date(`${dto.date}T${dto.startTime}:00`).getTime();
    const endMs = new Date(`${dto.date}T${dto.endTime}:00`).getTime();
    const duration = Math.round((endMs - startMs) / 60000);

    const session: TeachingSession = {
      sessionId: uuidv4(),
      facultyId,
      campus,
      department,
      courseCode: dto.courseCode,
      courseTitle: dto.courseTitle,
      batchId: dto.batchId,
      semester: dto.semester,
      academicYear: dto.academicYear,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      duration,
      room: dto.room,
      dayOfWeek: dto.dayOfWeek,
      status: SessionStatus.SCHEDULED,
      topic: dto.topic,
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    const record: SessionDdbRecord = {
      ...session,
      PK: SessionKeys.pk(session.sessionId),
      SK: SessionKeys.sk(),
      GSI1PK: SessionKeys.gsi1pk(facultyId),
      GSI1SK: SessionKeys.gsi1sk(dto.date),
      entityType: 'SESSION',
    };

    await this.ddb.put(record);
    return session;
  }

  async getById(sessionId: string): Promise<TeachingSession | null> {
    const record = await this.ddb.get<SessionDdbRecord>({
      PK: SessionKeys.pk(sessionId),
      SK: SessionKeys.sk(),
    });
    if (!record) return null;
    const { PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...session } = record;
    return session;
  }

  async update(
    sessionId: string,
    dto: UpdateSessionDto,
    updatedBy: string
  ): Promise<TeachingSession | null> {
    const existing = await this.getById(sessionId);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: TeachingSession = { ...existing, ...dto, updatedAt: now, updatedBy };
    const record: SessionDdbRecord = {
      ...updated,
      PK: SessionKeys.pk(sessionId),
      SK: SessionKeys.sk(),
      GSI1PK: SessionKeys.gsi1pk(updated.facultyId),
      GSI1SK: SessionKeys.gsi1sk(updated.date),
      entityType: 'SESSION',
    };

    await this.ddb.put(record);
    return updated;
  }

  async listByFaculty(
    facultyId: string,
    options: PaginationOptions & { from?: string; to?: string; status?: SessionStatus; courseCode?: string } = {}
  ): Promise<PaginatedResult<TeachingSession>> {
    const { limit = 20, lastKey, from, to, status, courseCode } = options;
    const names: Record<string, string> = { '#gsi1pk': 'GSI1PK' };
    const values: Record<string, unknown> = {
      ':pk': SessionKeys.gsi1pk(facultyId),
    };

    let keyCondition = '#gsi1pk = :pk';
    if (from && to) {
      keyCondition += ' AND #gsi1sk BETWEEN :from AND :to';
      names['#gsi1sk'] = 'GSI1SK';
      values[':from'] = `SESSION#${from}`;
      values[':to'] = `SESSION#${to}`;
    } else if (from) {
      keyCondition += ' AND #gsi1sk >= :from';
      names['#gsi1sk'] = 'GSI1SK';
      values[':from'] = `SESSION#${from}`;
    }

    const filters: string[] = [];
    if (status) {
      filters.push('#sessionStatus = :sessionStatus');
      names['#sessionStatus'] = 'status';
      values[':sessionStatus'] = status;
    }
    if (courseCode) {
      filters.push('#courseCode = :courseCode');
      names['#courseCode'] = 'courseCode';
      values[':courseCode'] = courseCode;
    }

    const { items, lastKey: nextKey } = await this.ddb.query<SessionDdbRecord>({
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
      items: items.map(({ PK: _pk, SK: _sk, GSI1PK: _g1, GSI1SK: _g2, entityType: _et, ...s }) => s),
      lastKey: nextKey
        ? Buffer.from(JSON.stringify(nextKey)).toString('base64')
        : undefined,
      count: items.length,
    };
  }
}
