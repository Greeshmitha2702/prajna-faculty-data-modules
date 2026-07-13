"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Schedule Service (Teaching Sessions, Lesson Plans, Attendance)
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_model_1 = require("../models/common.model");
const errors_1 = require("./errors");
class ScheduleService {
    lessonPlanRepo;
    attendanceRepo;
    sessionRepo;
    eb;
    constructor(lessonPlanRepo, attendanceRepo, sessionRepo, eb) {
        this.lessonPlanRepo = lessonPlanRepo;
        this.attendanceRepo = attendanceRepo;
        this.sessionRepo = sessionRepo;
        this.eb = eb;
    }
    // ── Lesson Plans ────────────────────────────────────────────────────────────
    async createLessonPlan(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        return this.lessonPlanRepo.create(dto, ctx.facultyId, ctx.campus, ctx.department, ctx.userId);
    }
    async updateLessonPlan(planId, dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.lessonPlanRepo.getById(planId);
        if (!existing)
            throw new errors_1.NotFoundError('LessonPlan', planId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        const updated = await this.lessonPlanRepo.update(planId, dto, ctx.userId);
        if (!updated)
            throw new errors_1.NotFoundError('LessonPlan', planId);
        return updated;
    }
    async deleteLessonPlan(planId, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.lessonPlanRepo.getById(planId);
        if (!existing)
            throw new errors_1.NotFoundError('LessonPlan', planId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        await this.lessonPlanRepo.delete(planId);
    }
    async listLessonPlans(ctx, options = {}) {
        return this.lessonPlanRepo.listByFaculty(ctx.facultyId, options);
    }
    async getLessonPlan(planId, ctx) {
        const plan = await this.lessonPlanRepo.getById(planId);
        if (!plan)
            throw new errors_1.NotFoundError('LessonPlan', planId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, plan.facultyId);
        return plan;
    }
    // ── Attendance ──────────────────────────────────────────────────────────────
    async createAttendance(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        return this.attendanceRepo.createSession(dto, ctx.facultyId, ctx.campus, ctx.department, ctx.userId);
    }
    async updateAttendance(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.attendanceRepo.getSessionById(dto.sessionId);
        if (!existing)
            throw new errors_1.NotFoundError('AttendanceSession', dto.sessionId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        await this.attendanceRepo.updateSession(dto, ctx.userId);
    }
    async listAttendance(ctx, options = {}) {
        return this.attendanceRepo.listByFaculty(ctx.facultyId, options);
    }
    // ── Teaching Sessions ───────────────────────────────────────────────────────
    async scheduleSession(dto, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const session = await this.sessionRepo.create(dto, ctx.facultyId, ctx.campus, ctx.department, ctx.userId);
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
    async cancelSession(sessionId, reason, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const existing = await this.sessionRepo.getById(sessionId);
        if (!existing)
            throw new errors_1.NotFoundError('Session', sessionId);
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, existing.facultyId);
        if (existing.status === common_model_1.SessionStatus.CANCELLED) {
            throw new errors_1.ValidationError('Session is already cancelled');
        }
        const updated = await this.sessionRepo.update(sessionId, { status: common_model_1.SessionStatus.CANCELLED, cancelledReason: reason }, ctx.userId);
        if (!updated)
            throw new errors_1.NotFoundError('Session', sessionId);
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
    async listSessions(ctx, options = {}) {
        return this.sessionRepo.listByFaculty(ctx.facultyId, options);
    }
    // ── Teaching Load & Timetable ───────────────────────────────────────────────
    async getTeachingLoad(facultyId, ctx) {
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, facultyId);
        // In a full implementation, courses would be fetched from a course enrollment service
        // Here we return a representative structure populated from session data
        const sessions = await this.sessionRepo.listByFaculty(facultyId, {
            limit: 100,
        });
        const courseMap = new Map();
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
            courseMap.get(s.courseCode).sessionCount += 1;
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
    async getTimetable(facultyId, ctx) {
        (0, errors_1.assertIsFacultyOrAdmin)(ctx, facultyId);
        const sessions = await this.sessionRepo.listByFaculty(facultyId, {
            limit: 200,
        });
        const entries = sessions.items.map((s) => ({
            day: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            courseCode: s.courseCode,
            courseTitle: s.courseTitle,
            batchId: s.batchId,
            room: s.room,
            sessionType: 'LECTURE',
        }));
        // Deduplicate recurring slots
        const seen = new Set();
        const uniqueEntries = entries.filter((e) => {
            const key = `${e.day}#${e.startTime}#${e.courseCode}`;
            if (seen.has(key))
                return false;
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
exports.ScheduleService = ScheduleService;
//# sourceMappingURL=schedule.service.js.map