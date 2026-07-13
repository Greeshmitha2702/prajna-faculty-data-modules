"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Schedule Handler
// Routes:
//   GET  /faculty/teaching/load
//   GET  /faculty/teaching/timetable
//   GET  /faculty/{facultyId}/teaching
//   POST /faculty/teaching/lesson-plan
//   GET  /faculty/teaching/lesson-plan
//   PUT  /faculty/teaching/lesson-plan/{id}
//   DELETE /faculty/teaching/lesson-plan/{id}
//   POST /faculty/teaching/attendance
//   GET  /faculty/teaching/attendance
//   PUT  /faculty/teaching/attendance/{id}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const response_1 = require("./shared/response");
const container_1 = require("./shared/container");
const common_validator_1 = require("../validators/common.validator");
const session_validator_1 = require("../validators/session.validator");
const errors_1 = require("../services/errors");
const handler = async (event) => {
    try {
        const { scheduleService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        const q = event.queryStringParameters ?? {};
        // ── Teaching Load ─────────────────────────────────────────────────────────
        if (method === 'GET' && path.endsWith('/teaching/load')) {
            const facultyId = event.pathParameters?.facultyId ?? ctx.facultyId;
            const load = await scheduleService.getTeachingLoad(facultyId, ctx);
            return (0, response_1.ok)(load);
        }
        // ── Timetable ─────────────────────────────────────────────────────────────
        if (method === 'GET' && path.endsWith('/teaching/timetable')) {
            const facultyId = event.pathParameters?.facultyId ?? ctx.facultyId;
            const timetable = await scheduleService.getTimetable(facultyId, ctx);
            return (0, response_1.ok)(timetable);
        }
        // ── GET /faculty/{facultyId}/teaching – Module 17 endpoint ───────────────
        if (method === 'GET' &&
            event.pathParameters?.facultyId &&
            path.endsWith('/teaching')) {
            const facultyId = (0, response_1.getPathParam)(event, 'facultyId');
            const [load, timetable] = await Promise.all([
                scheduleService.getTeachingLoad(facultyId, ctx),
                scheduleService.getTimetable(facultyId, ctx),
            ]);
            return (0, response_1.ok)({ load, timetable });
        }
        // ── Lesson Plans ──────────────────────────────────────────────────────────
        // POST /faculty/teaching/lesson-plan
        if (method === 'POST' && path.endsWith('/lesson-plan')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.createLessonPlanSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const plan = await scheduleService.createLessonPlan(result.data, ctx);
            return (0, response_1.created)(plan);
        }
        // GET /faculty/teaching/lesson-plan
        if (method === 'GET' && path.endsWith('/lesson-plan')) {
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.listLessonPlansQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await scheduleService.listLessonPlans(ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // PUT /faculty/teaching/lesson-plan/{id}
        if (method === 'PUT' &&
            path.includes('/lesson-plan/') &&
            event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.updateLessonPlanSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const updated = await scheduleService.updateLessonPlan(id, result.data, ctx);
            return (0, response_1.ok)(updated);
        }
        // DELETE /faculty/teaching/lesson-plan/{id}
        if (method === 'DELETE' &&
            path.includes('/lesson-plan/') &&
            event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            await scheduleService.deleteLessonPlan(id, ctx);
            return (0, response_1.noContent)();
        }
        // ── Attendance ────────────────────────────────────────────────────────────
        // POST /faculty/teaching/attendance
        if (method === 'POST' && path.endsWith('/attendance')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.createAttendanceSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const session = await scheduleService.createAttendance(result.data, ctx);
            return (0, response_1.created)(session);
        }
        // GET /faculty/teaching/attendance
        if (method === 'GET' && path.endsWith('/attendance')) {
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.listAttendanceQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await scheduleService.listAttendance(ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // PUT /faculty/teaching/attendance/{id}
        if (method === 'PUT' &&
            path.includes('/attendance/') &&
            event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.updateAttendanceSchema, {
                ...body,
                sessionId: id,
            });
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            await scheduleService.updateAttendance(result.data, ctx);
            return (0, response_1.ok)({ message: 'Attendance updated' });
        }
        // ── Sessions ──────────────────────────────────────────────────────────────
        // POST /sessions
        if (method === 'POST' && path.endsWith('/sessions')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.createSessionSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const session = await scheduleService.scheduleSession(result.data, ctx);
            return (0, response_1.created)(session);
        }
        // GET /sessions
        if (method === 'GET' && path.endsWith('/sessions')) {
            const result = (0, common_validator_1.parseAndValidate)(session_validator_1.listSessionsQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await scheduleService.listSessions(ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // PUT /sessions/{id}/cancel
        if (method === 'PUT' &&
            path.includes('/sessions/') &&
            path.endsWith('/cancel')) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const body = (0, response_1.parseBody)(event);
            if (!body.reason)
                throw new errors_1.ValidationError('Cancellation reason is required');
            const session = await scheduleService.cancelSession(id, body.reason, ctx);
            return (0, response_1.ok)(session);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=schedule.handler.js.map