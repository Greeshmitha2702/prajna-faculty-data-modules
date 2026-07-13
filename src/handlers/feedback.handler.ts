// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Handler
// Routes: POST /feedback  GET /feedback
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
  createFeedbackSchema,
  submitFeedbackResponseSchema,
  listFeedbackQuerySchema,
} from '../validators/feedback.validator';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { feedbackService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // POST /feedback
    if (method === 'POST' && path.endsWith('/feedback')) {
      const body = parseBody(event);
      const result = parseAndValidate(createFeedbackSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const feedback = await feedbackService.create(result.data, ctx);
      return created(feedback);
    }

    // GET /feedback
    if (method === 'GET' && path.endsWith('/feedback')) {
      const q = event.queryStringParameters ?? {};
      const result = parseAndValidate(listFeedbackQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await feedbackService.list(ctx, result.data);
      return ok(list);
    }

    // POST /feedback/{id}/response – submit student feedback
    if (method === 'POST' && path.includes('/feedback/') && path.endsWith('/response')) {
      const id = getPathParam(event, 'id');
      const body = parseBody<any>(event);
      const result = parseAndValidate(submitFeedbackResponseSchema, {
        ...body,
        feedbackId: id,
      });
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const resp = await feedbackService.submitResponse(result.data, ctx);
      return ok(resp);
    }

    // PUT /feedback/{id}/release
    if (method === 'PUT' && path.includes('/feedback/') && path.endsWith('/release')) {
      const id = getPathParam(event, 'id');
      const feedback = await feedbackService.release(id, ctx);
      return ok(feedback);
    }

    // GET /feedback/{id}
    if (method === 'GET' && event.pathParameters?.id) {
      const id = getPathParam(event, 'id');
      const feedback = await feedbackService.getById(id, ctx);
      return ok(feedback);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
