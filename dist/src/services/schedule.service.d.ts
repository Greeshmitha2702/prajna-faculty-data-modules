import { LessonPlanRepository, AttendanceRepository, TeachingSessionRepository } from '../repositories/teaching-session.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { LessonPlan, AttendanceSession, TeachingSession, CreateLessonPlanDto, UpdateLessonPlanDto, CreateAttendanceDto, UpdateAttendanceDto, CreateSessionDto, TeachingLoad, Timetable } from '../models/teaching-session.model';
import { AuthorizerContext, PaginatedResult, PaginationOptions, SessionStatus } from '../models/common.model';
export declare class ScheduleService {
    private readonly lessonPlanRepo;
    private readonly attendanceRepo;
    private readonly sessionRepo;
    private readonly eb;
    constructor(lessonPlanRepo: LessonPlanRepository, attendanceRepo: AttendanceRepository, sessionRepo: TeachingSessionRepository, eb: EventBridgeAdapter);
    createLessonPlan(dto: CreateLessonPlanDto, ctx: AuthorizerContext): Promise<LessonPlan>;
    updateLessonPlan(planId: string, dto: UpdateLessonPlanDto, ctx: AuthorizerContext): Promise<LessonPlan>;
    deleteLessonPlan(planId: string, ctx: AuthorizerContext): Promise<void>;
    listLessonPlans(ctx: AuthorizerContext, options?: PaginationOptions & {
        courseCode?: string;
        from?: string;
        to?: string;
    }): Promise<PaginatedResult<LessonPlan>>;
    getLessonPlan(planId: string, ctx: AuthorizerContext): Promise<LessonPlan>;
    createAttendance(dto: CreateAttendanceDto, ctx: AuthorizerContext): Promise<AttendanceSession>;
    updateAttendance(dto: UpdateAttendanceDto, ctx: AuthorizerContext): Promise<void>;
    listAttendance(ctx: AuthorizerContext, options?: PaginationOptions & {
        courseCode?: string;
        from?: string;
        to?: string;
    }): Promise<PaginatedResult<AttendanceSession>>;
    scheduleSession(dto: CreateSessionDto, ctx: AuthorizerContext): Promise<TeachingSession>;
    cancelSession(sessionId: string, reason: string, ctx: AuthorizerContext): Promise<TeachingSession>;
    listSessions(ctx: AuthorizerContext, options?: PaginationOptions & {
        from?: string;
        to?: string;
        status?: SessionStatus;
        courseCode?: string;
    }): Promise<PaginatedResult<TeachingSession>>;
    getTeachingLoad(facultyId: string, ctx: AuthorizerContext): Promise<TeachingLoad>;
    getTimetable(facultyId: string, ctx: AuthorizerContext): Promise<Timetable>;
}
