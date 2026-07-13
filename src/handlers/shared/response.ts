// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Lambda Response Helpers & Context Extractor
// ─────────────────────────────────────────────────────────────────────────────

import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import { AuthorizerContext, UserRole } from '../../models/common.model';
import { AppError } from '../../services/errors';

export function ok<T>(body: T, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, data: body }),
  };
}

export function created<T>(body: T): APIGatewayProxyResultV2 {
  return ok(body, 201);
}

export function noContent(): APIGatewayProxyResultV2 {
  return { statusCode: 204, body: '' };
}

export function errorResponse(
  statusCode: number,
  message: string,
  code = 'ERROR'
): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, error: { code, message } }),
  };
}

export function handleError(err: unknown): APIGatewayProxyResultV2 {
  console.error('[Handler Error]', err);
  const error: any = err;

  if (error instanceof AppError) {
    return errorResponse(error.statusCode, error.message, error.code);
  }

  if (error instanceof Error) {
    return errorResponse(500, error.message, 'INTERNAL_ERROR');
  }

  return errorResponse(500, 'An unexpected error occurred', 'INTERNAL_ERROR');
}

export function extractAuthContext(
  event: APIGatewayProxyEventV2WithJWTAuthorizer
): AuthorizerContext {
  const claims = event.requestContext.authorizer.jwt.claims as Record<
    string,
    string
  >;

  return {
    facultyId: claims['custom:facultyId'] ?? claims['facultyId'] ?? '',
    role: (claims['custom:role'] ?? claims['role'] ?? 'FACULTY') as UserRole,
    campus: claims['custom:campus'] ?? claims['campus'] ?? '',
    department: claims['custom:department'] ?? claims['department'] ?? '',
    userId: claims['sub'] ?? claims['userId'] ?? '',
  };
}

export function parseBody<T>(event: { body?: string | null }): T {
  if (!event.body) {
    throw new Error('Request body is required');
  }
  try {
    return JSON.parse(event.body) as T;
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

export function getPathParam(
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
  name: string
): string {
  const val = event.pathParameters?.[name];
  if (!val) throw new Error(`Missing path parameter: ${name}`);
  return decodeURIComponent(val);
}

export function getQueryParam(
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
  name: string
): string | undefined {
  return event.queryStringParameters?.[name];
}
