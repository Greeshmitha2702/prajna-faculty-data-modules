// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Schedule Service (Teaching Sessions, Lesson Plans, Attendance)
// ─────────────────────────────────────────────────────────────────────────────

import {
  LessonPlanRepository,
  AttendanceRepository,
  TeachingSessionRepository,
} from '../repositories/teaching-session.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import {
  LessonPlan,
  AttendanceSession,
  TeachingSession,
  CreateLessonPlanDto,
  UpdateLessonPlanDto,
  CreateAttendanceDto,
  UpdateAttendanceDto,
  CreateSessionDto,
  UpdateSessionDto,
  TeachingLoad,
  Timetable,
  TimetableEntry,
} from '../models/teaching-session.model';
import {
  AuthorizerContext,
  PaginatedResult,
  PaginationOptions,
  SessionStatus,
} from '../models/common.model';
import {
  assertCanWrite,
  assertIsFacultyOrAdmin,
  NotFoundError,
  ValidationError,
} from './errors';

export class ScheduleService {
  constructor(
    private readonly lessonPlanRepo: LessonPlanRepository,
    private readonly attendanceRepo: AttendanceRepository,
    private readonly sessionRepo: TeachingSessionRepository,
    private readonly eb: EventBridgeAdapter
  ) {}

  // ── Lesson Plans ────────────────────────────────────────────────────────────

  async createLessonPlan(
    dto: CreateLessonPlanDto,
    ctx: AuthorizerContext
  ): Promise<LessonPlan> {
    assertCanWrite(ctx);
    return this.lessonPlanRepo.create(
      dto,
      ctx.facultyId,
      ctx.campus,
      ctx.department,
      ctx.userId
    );
  }

  async updateLessonPlan(
    planId: string,
    dto: UpdateLessonPlanDto,
    ctx: AuthorizerContext
  ): Promise<LessonPlan> {
    assertCanWrite(ctx);
    const existing = await this.lessonPlanRepo.getById(planId);
    if (!existing) throw new NotFoundError('LessonPlan', planId);
    assertIsFacultyOrAdmin(ctx, existing.facultyId);

    const updated = await this.lessonPlanRepo.update(planId, dto, ctx.userId);
    if (!updated) throw new NotFoundError('LessonPlan', planId);
    return updated;
  }

  async deleteLessonPlan(planId: string, ctx: AuthorizerContext): Promise<void> {
    assertCanWrite(ctx);
    const existing = await this.lessonPlanRepo.getById(planId);
    if (!existing) throw new NotFoundError('LessonPlan', planId);
    assertIsFacultyOrAdmin(ctx, existing.facultyId);
    await this.lessonPlanRepo.delete(planId);
  }

  async listLessonPlans(
    ctx: AuthorizerContext,
    options: PaginationOptions & { courseCode?: string; from?: string; to?: string } = {}
  ): Promise<PaginatedResult<LessonPlan>> {
    return this.lessonPlanRepo.listByFaculty(ctx.facultyId, options);
  }

  async getLessonPlan(planId: string, ctx: AuthorizerContext): Promise<LessonPlan> {
    const plan = await this.lessonPlanRepo.getById(planId);
    if (!plan) throw new NotFoundError('LessonPlan', planId);
    assertIsFacultyOrAdmin(ctx, plan.facultyId);
    return plan;
  }

  // ── Attendance ──────────────────────────────────────────────────────────────

  async createAttendance(
    dto: CreateAttendanceDto,
    ctx: AuthorizerContext
  ): Promise<AttendanceSession> {
    assertCanWrite(ctx);
    return this.attendanceRepo.createSession(
      dto,
      ctx.facultyId,
      ctx.campus,
      ctx.department,
      ctx.userId
    );
  }

  async updateAttendance(
    dto: UpdateAttendanceDto,
    ctx: AuthorizerContext
  ): Promise<void> {
    assertCanWrite(ctx);
    const existing = await this.attendanceRepo.getSessionById(dto.sessionId);
    if (!existing) throw new NotFoundError('AttendanceSession', dto.sessionId);
    assertIsFacultyOrAdmin(ctx, existing.facultyId);
    await this.attendanceRepo.updateSession(dto, ctx.userId);
  }

  async listAttendance(
    ctx: AuthorizerContext,
    options: PaginationOptions & { courseCode?: string; from?: string; to?: string } = {}
  ): Promise<PaginatedResult<AttendanceSession>> {
    return this.attendanceRepo.listByFaculty(ctx.facultyId, options);
  }

  // ── Teaching Sessions ───────────────────────────────────────────────────────

  async scheduleSession(
    dto: CreateSessionDto,
    ctx: AuthorizerContext
  ): Promise<TeachingSession> {
    assertCanWrite(ctx);
    const session = await this.sessionRepo.create(
      dto,
      ctx.facultyId,
      ctx.campus,
      ctx.department,
      ctx.userId
    );

    await this.eb.publish({
      eventType: 'session.scheduled',
      facultyId: ctx.facultyId,
      campus: ctx.campus,
      department: ctx.department,
      courseCode: dto.courseCode,
      academicYear: dto.academicYear,
      semester: dto.semester,
      payload: {
        sessionId: session.sessionId,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        room: session.room,
      },
    });

    return session;
  }

  async cancelSession(
    sessionId: string,
    reason: string,
    ctx: AuthorizerContext
  ): Promise<TeachingSession> {
    assertCanWrite(ctx);
    const existing = await this.sessionRepo.getById(sessionId);
    if (!existing) throw new NotFoundError('Session', sessionId);
    assertIsFacultyOrAdmin(ctx, existing.facultyId);

    if (existing.status === SessionStatus.CANCELLED) {
      throw new ValidationError('Session is already cancelled');
    }

    const updated = await this.sessionRepo.update(
      sessionId,
      { status: SessionStatus.CANCELLED, cancelledReason: reason },
      ctx.userId
    );
    if (!updated) throw new NotFoundError('Session', sessionId);

    await this.eb.publish({
      eventType: 'session.cancelled',
      facultyId: ctx.facultyId,
      campus: ctx.campus,
      department: ctx.department,
      courseCode: updated.courseCode,
      academicYear: updated.academicYear,
      semester: updated.semester,
      payload: {
        sessionId: updated.sessionId,
        date: updated.date,
        reason,
      },
    });

    return updated;
  }

  async listSessions(
    ctx: AuthorizerContext,
    options: PaginationOptions & {
      from?: string;
      to?: string;
      status?: SessionStatus;
      courseCode?: string;
    } = {}
  ): Promise<PaginatedResult<TeachingSession>> {
    return this.sessionRepo.listByFaculty(ctx.facultyId, options);
  }

  // ── Teaching Load & Timetable ───────────────────────────────────────────────

  async getTeachingLoad(
    facultyId: string,
    ctx: AuthorizerContext
  ): Promise<TeachingLoad> {
    assertIsFacultyOrAdmin(ctx, facultyId);

    // In a full implementation, courses would be fetched from a course enrollment service
    // Here we return a representative structure populated from session data
    const sessions = await this.sessionRepo.listByFaculty(facultyId, {
      limit: 100,
    });

    const courseMap = new Map<string, {
      courseCode: string;
      courseTitle: string;
      batchId: string;
      semester: string;
      room: string;
      sessionCount: number;
    }>();

    for (const s of sessions.items) {
      if (!courseMap.has(s.courseCode)) {
        courseMap.set(s.courseCode, {
          courseCode: s.courseCode,
          courseTitle: s.courseTitle,
          batchId: s.batchId,
          semester: s.semester,
          room: s.room,
          sessionCount: 0,
        });
      }
      courseMap.get(s.courseCode)!.sessionCount += 1;
    }

    const courses = Array.from(courseMap.values()).map((c) => ({
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      batchId: c.batchId,
      semester: c.semester,
      credits: 3, // Placeholder; populated from course registry
      hoursPerWeek: Math.round(c.sessionCount / 16), // Rough estimate over 16 weeks
      enrolledStudents: 0,
      room: c.room,
    }));

    return {
      facultyId,
      facultyName: '', // Populated from faculty profile service
      designation: '',
      campus: ctx.campus,
      department: ctx.department,
      academicYear: '',
      semester: '',
      courses,
      totalCredits: courses.reduce((a, c) => a + c.credits, 0),
      totalHoursPerWeek: courses.reduce((a, c) => a + c.hoursPerWeek, 0),
      totalStudents: courses.reduce((a, c) => a + c.enrolledStudents, 0),
    };
  }

  async getTimetable(
    facultyId: string,
    ctx: AuthorizerContext
  ): Promise<Timetable> {
    assertIsFacultyOrAdmin(ctx, facultyId);

    const sessions = await this.sessionRepo.listByFaculty(facultyId, {
      limit: 200,
    });

    const entries: TimetableEntry[] = sessions.items.map((s) => ({
      day: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      courseCode: s.courseCode,
      courseTitle: s.courseTitle,
      batchId: s.batchId,
      room: s.room,
      sessionType: 'LECTURE' as const,
    }));

    // Deduplicate recurring slots
    const seen = new Set<string>();
    const uniqueEntries = entries.filter((e) => {
      const key = `${e.day}#${e.startTime}#${e.courseCode}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const firstSession = sessions.items[0];
    return {
      facultyId,
      semester: firstSession?.semester ?? '',
      academicYear: firstSession?.academicYear ?? '',
      entries: uniqueEntries,
    };
  }
}
