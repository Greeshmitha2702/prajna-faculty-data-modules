// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Handler
// Route: GET /gradebook
// ─────────────────────────────────────────────────────────────────────────────

import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import {
  ok,
  handleError,
  extractAuthContext,
} from './shared/response';
import { getContainer } from './shared/container';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { gradebookService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;
    const q = event.queryStringParameters ?? {};

    // GET /gradebook – list all gradebooks for the faculty
    if (method === 'GET' && path.endsWith('/gradebook')) {
      const list = await gradebookService.listByFaculty(ctx, {
        academicYear: q.academicYear,
        semester: q.semester,
        limit: q.limit ? Number(q.limit) : 20,
        lastKey: q.lastKey,
      });
      return ok(list);
    }

    // GET /gradebook/sync?courseCode=&batchId=&semester=&academicYear= – sync & return
    if (method === 'GET' && path.endsWith('/gradebook/sync')) {
      const { courseCode, batchId, semester, academicYear } = q;
      if (!courseCode) throw new ValidationError('courseCode is required');
      if (!batchId) throw new ValidationError('batchId is required');
      if (!semester) throw new ValidationError('semester is required');
      if (!academicYear) throw new ValidationError('academicYear is required');

      const gradebook = await gradebookService.getOrSync(
        courseCode,
        batchId,
        semester,
        academicYear,
        ctx
      );
      return ok(gradebook);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
