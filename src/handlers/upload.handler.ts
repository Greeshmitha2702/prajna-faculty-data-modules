// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Upload Handler (Pre-signed URL generation)
// ─────────────────────────────────────────────────────────────────────────────

import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import {
  ok,
  handleError,
  extractAuthContext,
  parseBody,
} from './shared/response';
import { getContainer } from './shared/container';
import { parseAndValidate } from '../validators/common.validator';
import { uploadRequestSchema } from '../validators/submission.validator';
import { ValidationError } from '../services/errors';

export const handler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { uploadService } = getContainer();
    const ctx = extractAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // POST /upload/deliverable/{deliverableId}
    if (method === 'POST' && path.includes('/upload/deliverable/')) {
      const deliverableId = event.pathParameters?.deliverableId;
      if (!deliverableId) throw new ValidationError('deliverableId is required');

      const body = parseBody(event);
      const result = parseAndValidate(uploadRequestSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const uploadResult = await uploadService.requestDeliverableUpload(
        result.data,
        deliverableId,
        ctx
      );
      return ok(uploadResult);
    }

    // POST /upload/submission/{deliverableId}/{studentId}
    if (method === 'POST' && path.includes('/upload/submission/')) {
      const deliverableId = event.pathParameters?.deliverableId;
      const studentId = event.pathParameters?.studentId ?? ctx.userId;
      if (!deliverableId) throw new ValidationError('deliverableId is required');

      const body = parseBody(event);
      const result = parseAndValidate(uploadRequestSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const uploadResult = await uploadService.requestSubmissionUpload(
        result.data,
        deliverableId,
        studentId,
        ctx
      );
      return ok(uploadResult);
    }

    // POST /upload/teaching
    if (method === 'POST' && path.endsWith('/upload/teaching')) {
      const body = parseBody(event);
      const result = parseAndValidate(uploadRequestSchema, body);
      if (!result.success) throw new ValidationError(result.errors.join('; '));

      const uploadResult = await uploadService.requestTeachingDocumentUpload(
        result.data,
        ctx
      );
      return ok(uploadResult);
    }

    // POST /download
    if (method === 'POST' && path.endsWith('/download')) {
      const body = parseBody<{ s3Key: string }>(event);
      if (!body.s3Key) throw new ValidationError('s3Key is required');

      const downloadResult = await uploadService.generateDownloadUrl(
        body.s3Key,
        ctx
      );
      return ok(downloadResult);
    }

    return handleError(new Error(`Unhandled route: ${method} ${path}`));
  } catch (err) {
    return handleError(err);
  }
};
