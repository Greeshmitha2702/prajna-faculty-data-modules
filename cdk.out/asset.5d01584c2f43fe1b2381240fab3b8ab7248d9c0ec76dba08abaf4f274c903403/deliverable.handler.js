"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Deliverable Handler
// Routes: POST /deliverables  GET /deliverables
//         PUT /deliverables/{id}  DELETE /deliverables/{id}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const response_1 = require("./shared/response");
const container_1 = require("./shared/container");
const common_validator_1 = require("../validators/common.validator");
const deliverable_validator_1 = require("../validators/deliverable.validator");
const errors_1 = require("../services/errors");
const handler = async (event) => {
    try {
        const { deliverableService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        // POST /deliverables
        if (method === 'POST' && path.endsWith('/deliverables')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(deliverable_validator_1.createDeliverableSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const deliverable = await deliverableService.create(result.data, ctx);
            return (0, response_1.created)(deliverable);
        }
        // GET /deliverables
        if (method === 'GET' && path.endsWith('/deliverables')) {
            const q = event.queryStringParameters ?? {};
            const result = (0, common_validator_1.parseAndValidate)(deliverable_validator_1.listDeliverablesQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await deliverableService.list(ctx, result.data);
            return (0, response_1.ok)(list);
        }
        // PUT /deliverables/{id} – also handles publish action
        if (method === 'PUT' && event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            const action = event.queryStringParameters?.action;
            if (action === 'publish') {
                const deliverable = await deliverableService.publish(id, ctx);
                return (0, response_1.ok)(deliverable);
            }
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(deliverable_validator_1.updateDeliverableSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const updated = await deliverableService.update(id, result.data, ctx);
            return (0, response_1.ok)(updated);
        }
        // DELETE /deliverables/{id}
        if (method === 'DELETE' && event.pathParameters?.id) {
            const id = (0, response_1.getPathParam)(event, 'id');
            await deliverableService.delete(id, ctx);
            return (0, response_1.noContent)();
        }
        // GET /faculty/{facultyId}/teaching – Module 17 dependency
        if (method === 'GET' && event.pathParameters?.facultyId) {
            const facultyId = (0, response_1.getPathParam)(event, 'facultyId');
            const q = event.queryStringParameters ?? {};
            const result = (0, common_validator_1.parseAndValidate)(deliverable_validator_1.listDeliverablesQuerySchema, q);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const list = await deliverableService.listByFacultyId(facultyId, ctx, result.data);
            return (0, response_1.ok)(list);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=deliverable.handler.js.map