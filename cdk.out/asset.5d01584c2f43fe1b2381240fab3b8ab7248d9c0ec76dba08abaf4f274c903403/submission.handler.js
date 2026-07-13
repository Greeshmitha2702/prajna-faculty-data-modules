"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Submission Handler
// Routes: POST /submissions  GET /submissions
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const response_1 = require("./shared/response");
const container_1 = require("./shared/container");
const common_validator_1 = require("../validators/common.validator");
const submission_validator_1 = require("../validators/submission.validator");
const errors_1 = require("../services/errors");
const handler = async (event) => {
    try {
        const { submissionService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        // POST /submissions
        if (method === 'POST' && path.endsWith('/submissions')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.createSubmissionSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const submission = await submissionService.create(result.data, ctx);
            return (0, response_1.created)(submission);
        }
        // GET /submissions
        if (method === 'GET' && path.endsWith('/submissions')) {
            const q = event.queryStringParameters ?? {};
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.listSubmissionsQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const deliverableId = q.deliverableId;
            if (!deliverableId) {
                throw new errors_1.ValidationError('deliverableId query parameter is required');
            }
            const list = await submissionService.listByDeliverable(deliverableId, ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // PUT /submissions/{id}/grade
        if (method === 'PUT' && event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.gradeSubmissionSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const graded = await submissionService.grade(id, result.data, ctx);
            return (0, response_1.ok)(graded);
        }
        // GET /submissions/{id}
        if (method === 'GET' && event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const submission = await submissionService.getById(id, ctx);
            return (0, response_1.ok)(submission);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=submission.handler.js.map