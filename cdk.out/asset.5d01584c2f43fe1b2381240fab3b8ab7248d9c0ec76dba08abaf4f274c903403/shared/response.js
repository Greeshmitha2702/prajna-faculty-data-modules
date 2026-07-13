"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Lambda Response Helpers & Context Extractor
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
exports.noContent = noContent;
exports.errorResponse = errorResponse;
exports.handleError = handleError;
exports.extractAuthContext = extractAuthContext;
exports.parseBody = parseBody;
exports.getPathParam = getPathParam;
exports.getQueryParam = getQueryParam;
const errors_1 = require("../../services/errors");
function ok(body, statusCode = 200) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: body }),
    };
}
function created(body) {
    return ok(body, 201);
}
function noContent() {
    return { statusCode: 204, body: '' };
}
function errorResponse(statusCode, message, code = 'ERROR') {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: { code, message } }),
    };
}
function handleError(err) {
    console.error('[Handler Error]', err);
    const error = err;
    if (error instanceof errors_1.AppError) {
        return errorResponse(error.statusCode, error.message, error.code);
    }
    if (error instanceof Error) {
        return errorResponse(500, error.message, 'INTERNAL_ERROR');
    }
    return errorResponse(500, 'An unexpected error occurred', 'INTERNAL_ERROR');
}
function extractAuthContext(event) {
    const claims = event.requestContext.authorizer.jwt.claims;
    return {
        facultyId: claims['custom:facultyId'] ?? claims['facultyId'] ?? '',
        role: (claims['custom:role'] ?? claims['role'] ?? 'FACULTY'),
        campus: claims['custom:campus'] ?? claims['campus'] ?? '',
        department: claims['custom:department'] ?? claims['department'] ?? '',
        userId: claims['sub'] ?? claims['userId'] ?? '',
    };
}
function parseBody(event) {
    if (!event.body) {
        throw new Error('Request body is required');
    }
    try {
        return JSON.parse(event.body);
    }
    catch {
        throw new Error('Invalid JSON in request body');
    }
}
function getPathParam(event, name) {
    const val = event.pathParameters?.[name];
    if (!val)
        throw new Error(`Missing path parameter: ${name}`);
    return decodeURIComponent(val);
}
function getQueryParam(event, name) {
    return event.queryStringParameters?.[name];
}
//# sourceMappingURL=response.js.map