import { DdbAdapter } from '../adapters/ddb.adapter';
import { LessonPlan, CreateLessonPlanDto, UpdateLessonPlanDto, AttendanceSession, CreateAttendanceDto, UpdateAttendanceDto, TeachingSession, CreateSessionDto, UpdateSessionDto } from '../models/teaching-session.model';
import { PaginatedResult, PaginationOptions, SessionStatus } from '../models/common.model';
export declare class LessonPlanRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    create(dto: CreateLessonPlanDto, facultyId: string, campus: string, department: string, createdBy: string): Promise<LessonPlan>;
    getById(planId: string): Promise<LessonPlan | null>;
    update(planId: string, dto: UpdateLessonPlanDto, updatedBy: string): Promise<LessonPlan | null>;
    delete(planId: string): Promise<void>;
    listByFaculty(facultyId: string, options?: PaginationOptions & {
        courseCode?: string;
        from?: string;
        to?: string;
    }): Promise<PaginatedResult<LessonPlan>>;
}
export declare class AttendanceRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    createSession(dto: CreateAttendanceDto, facultyId: string, campus: string, department: string, createdBy: string): Promise<AttendanceSession>;
    getSessionById(sessionId: string): Promise<AttendanceSession | null>;
    updateSession(dto: UpdateAttendanceDto, updatedBy: string): Promise<void>;
    listByFaculty(facultyId: string, options?: PaginationOptions & {
        courseCode?: string;
        from?: string;
        to?: string;
    }): Promise<PaginatedResult<AttendanceSession>>;
}
export declare class TeachingSessionRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    create(dto: CreateSessionDto, facultyId: string, campus: string, department: string, createdBy: string): Promise<TeachingSession>;
    getById(sessionId: string): Promise<TeachingSession | null>;
    update(sessionId: string, dto: UpdateSessionDto, updatedBy: string): Promise<TeachingSession | null>;
    listByFaculty(facultyId: string, options?: PaginationOptions & {
        from?: string;
        to?: string;
        status?: SessionStatus;
        courseCode?: string;
    }): Promise<PaginatedResult<TeachingSession>>;
}
