// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Handler
// Routes: POST /submissions  GET /submissions
// ─────────────────────────────────────────────────────────────────────────────

import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import {
  ok,
  created,
  handleError,
  extractAuthContext,
  parseBody,
  getPathParam,
} from './shared/response';
import { getContainer } from './shared/container';
import { parseAndValidate } from '../validators/common.validator';
import {
  createSubmissionSchema,
  gradeSubmissionSchema,
  listSubmissionsQuerySchema,
} from '../validators/submission.validator';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { submissionService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // POST /submissions
    if (method === 'POST' && path.endsWith('/submissions')) {
      const body = parseBody(event);
      const result = parseAndValidate(createSubmissionSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const submission = await submissionService.create(result.data, ctx);
      return created(submission);
    }

    // GET /submissions
    if (method === 'GET' && path.endsWith('/submissions')) {
      const q = event.queryStringParameters ?? {};
      const result = parseAndValidate(listSubmissionsQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const deliverableId = q.deliverableId;
      if (!deliverableId) {
        throw new ValidationError('deliverableId query parameter is required');
      }

      const list = await submissionService.listByDeliverable(
        deliverableId,
        ctx,
        result.data
      );
      return ok(list);
    }

    // PUT /submissions/{id}/grade
    if (method === 'PUT' && event.pathParameters?.id) {
      const id = getPathParam(event, 'id');
      const body = parseBody<any>(event);
      const result = parseAndValidate(gradeSubmissionSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const graded = await submissionService.grade(id, result.data, ctx);
      return ok(graded);
    }

    // GET /submissions/{id}
    if (method === 'GET' && event.pathParameters?.id) {
      const id = getPathParam(event, 'id');
      const submission = await submissionService.getById(id, ctx);
      return ok(submission);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
