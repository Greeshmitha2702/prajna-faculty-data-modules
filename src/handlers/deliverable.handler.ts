// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Handler
// Routes: POST /deliverables  GET /deliverables
//         PUT /deliverables/{id}  DELETE /deliverables/{id}
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
  createDeliverableSchema,
  updateDeliverableSchema,
  listDeliverablesQuerySchema,
} from '../validators/deliverable.validator';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { deliverableService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // POST /deliverables
    if (method === 'POST' && path.endsWith('/deliverables')) {
      const body = parseBody(event);
      const result = parseAndValidate(createDeliverableSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const deliverable = await deliverableService.create(result.data, ctx);
      return created(deliverable);
    }

    // GET /deliverables
    if (method === 'GET' && path.endsWith('/deliverables')) {
      const q = event.queryStringParameters ?? {};
      const result = parseAndValidate(listDeliverablesQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await deliverableService.list(ctx, result.data);
      return ok(list);
    }

    // PUT /deliverables/{id} – also handles publish action
    if (method === 'PUT' && event.pathParameters?.id) {
      const id = getPathParam(event, 'id');
      const action = event.queryStringParameters?.action;

      if (action === 'publish') {
        const deliverable = await deliverableService.publish(id, ctx);
        return ok(deliverable);
      }

      const body = parseBody(event);
      const result = parseAndValidate(updateDeliverableSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const updated = await deliverableService.update(id, result.data, ctx);
      return ok(updated);
    }

    // DELETE /deliverables/{id}
    if (method === 'DELETE' && event.pathParameters?.id) {
      const id = getPathParam(event, 'id');
      await deliverableService.delete(id, ctx);
      return noContent();
    }

    // GET /faculty/{facultyId}/teaching – Module 17 dependency
    if (method === 'GET' && event.pathParameters?.facultyId) {
      const facultyId = getPathParam(event, 'facultyId');
      const q = event.queryStringParameters ?? {};
      const result = parseAndValidate(listDeliverablesQuerySchema, q);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const list = await deliverableService.listByFacultyId(facultyId, ctx, result.data);
      return ok(list);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
