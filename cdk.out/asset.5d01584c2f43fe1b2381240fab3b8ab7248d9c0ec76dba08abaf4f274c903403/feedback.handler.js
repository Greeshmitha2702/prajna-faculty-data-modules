"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Feedback Handler
// Routes: POST /feedback  GET /feedback
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const response_1 = require("./shared/response");
const container_1 = require("./shared/container");
const common_validator_1 = require("../validators/common.validator");
const feedback_validator_1 = require("../validators/feedback.validator");
const errors_1 = require("../services/errors");
const handler = async (event) => {
    try {
        const { feedbackService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        // POST /feedback
        if (method === 'POST' && path.endsWith('/feedback')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(feedback_validator_1.createFeedbackSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const feedback = await feedbackService.create(result.data, ctx);
            return (0, response_1.created)(feedback);
        }
        // GET /feedback
        if (method === 'GET' && path.endsWith('/feedback')) {
            const q = event.queryStringParameters ?? {};
            const result = (0, common_validator_1.parseAndValidate)(feedback_validator_1.listFeedbackQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await feedbackService.list(ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // POST /feedback/{id}/response – submit student feedback
        if (method === 'POST' && path.includes('/feedback/') && path.endsWith('/response')) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(feedback_validator_1.submitFeedbackResponseSchema, {
                ...body,
                feedbackId: id,
            });
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const resp = await feedbackService.submitResponse(result.data, ctx);
            return (0, response_1.ok)(resp);
        }
        // PUT /feedback/{id}/release
        if (method === 'PUT' && path.includes('/feedback/') && path.endsWith('/release')) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const feedback = await feedbackService.release(id, ctx);
            return (0, response_1.ok)(feedback);
        }
        // GET /feedback/{id}
        if (method === 'GET' && event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const feedback = await feedbackService.getById(id, ctx);
            return (0, response_1.ok)(feedback);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=feedback.handler.js.map