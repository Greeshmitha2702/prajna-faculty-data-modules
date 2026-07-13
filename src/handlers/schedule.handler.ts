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

import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import {
  ok,
  created,
  noContent,
  handleError,
  extractAuthContext,
  parseBody,
  getPathParam,
} from './shared/response';
import { getContainer } from './shared/container';
import { parseAndValidate } from '../validators/common.validator';
import {
  createLessonPlanSchema,
  updateLessonPlanSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
  createSessionSchema,
  updateSessionSchema,
  listLessonPlansQuerySchema,
  listAttendanceQuerySchema,
  listSessionsQuerySchema,
} from '../validators/session.validator';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { scheduleService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;
    const q = event.queryStringParameters ?? {};

    // ── Teaching Load ─────────────────────────────────────────────────────────
    if (method === 'GET' && path.endsWith('/teaching/load')) {
      const facultyId = event.pathParameters?.facultyId ?? ctx.facultyId;
      const load = await scheduleService.getTeachingLoad(facultyId, ctx);
      return ok(load);
    }

    // ── Timetable ─────────────────────────────────────────────────────────────
    if (method === 'GET' && path.endsWith('/teaching/timetable')) {
      const facultyId = event.pathParameters?.facultyId ?? ctx.facultyId;
      const timetable = await scheduleService.getTimetable(facultyId, ctx);
      return ok(timetable);
    }

    // ── GET /faculty/{facultyId}/teaching – Module 17 endpoint ───────────────
    if (
      method === 'GET' &&
      event.pathParameters?.facultyId &&
      path.endsWith('/teaching')
    ) {
      const facultyId = getPathParam(event, 'facultyId');
      const [load, timetable] = await Promise.all([
        scheduleService.getTeachingLoad(facultyId, ctx),
        scheduleService.getTimetable(facultyId, ctx),
      ]);
      return ok({ load, timetable });
    }

    // ── Lesson Plans ──────────────────────────────────────────────────────────

    // POST /faculty/teaching/lesson-plan
    if (method === 'POST' && path.endsWith('/lesson-plan')) {
      const body = parseBody<any>(event);
      const result = parseAndValidate(createLessonPlanSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const plan = await scheduleService.createLessonPlan(result.data, ctx);
      return created(plan);
    }

    // GET /faculty/teaching/lesson-plan
    if (method === 'GET' && path.endsWith('/lesson-plan')) {
      const result = parseAndValidate(listLessonPlansQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await scheduleService.listLessonPlans(ctx, result.data);
      return ok(list);
    }

    // PUT /faculty/teaching/lesson-plan/{id}
    if (
      method === 'PUT' &&
      path.includes('/lesson-plan/') &&
      event.pathParameters?.id
    ) {
      const id = getPathParam(event, 'id');
      const body = parseBody<any>(event);
      const result = parseAndValidate(updateLessonPlanSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const updated = await scheduleService.updateLessonPlan(id, result.data, ctx);
      return ok(updated);
    }

    // DELETE /faculty/teaching/lesson-plan/{id}
    if (
      method === 'DELETE' &&
      path.includes('/lesson-plan/') &&
      event.pathParameters?.id
    ) {
      const id = getPathParam(event, 'id');
      await scheduleService.deleteLessonPlan(id, ctx);
      return noContent();
    }

    // ── Attendance ────────────────────────────────────────────────────────────

    // POST /faculty/teaching/attendance
    if (method === 'POST' && path.endsWith('/attendance')) {
      const body = parseBody(event);
      const result = parseAndValidate(createAttendanceSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const session = await scheduleService.createAttendance(result.data, ctx);
      return created(session);
    }

    // GET /faculty/teaching/attendance
    if (method === 'GET' && path.endsWith('/attendance')) {
      const result = parseAndValidate(listAttendanceQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await scheduleService.listAttendance(ctx, result.data);
      return ok(list);
    }

    // PUT /faculty/teaching/attendance/{id}
    if (
      method === 'PUT' &&
      path.includes('/attendance/') &&
      event.pathParameters?.id
    ) {
      const id = getPathParam(event, 'id');
      const body = parseBody<any>(event);
      const result = parseAndValidate(updateAttendanceSchema, {
        ...body,
        sessionId: id,
      });
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      await scheduleService.updateAttendance(result.data, ctx);
      return ok({ message: 'Attendance updated' });
    }

    // ── Sessions ──────────────────────────────────────────────────────────────

    // POST /sessions
    if (method === 'POST' && path.endsWith('/sessions')) {
      const body = parseBody(event);
      const result = parseAndValidate(createSessionSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const session = await scheduleService.scheduleSession(result.data, ctx);
      return created(session);
    }

    // GET /sessions
    if (method === 'GET' && path.endsWith('/sessions')) {
      const result = parseAndValidate(listSessionsQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await scheduleService.listSessions(ctx, result.data);
      return ok(list);
    }

    // PUT /sessions/{id}/cancel
    if (
      method === 'PUT' &&
      path.includes('/sessions/') &&
      path.endsWith('/cancel')
    ) {
      const id = getPathParam(event, 'id');
      const body = parseBody<{ reason: string }>(event);
      if (!body.reason) throw new ValidationError('Cancellation reason is required');

      const session = await scheduleService.cancelSession(id, body.reason, ctx);
      return ok(session);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
