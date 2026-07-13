"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Upload Handler (Pre-signed URL generation)
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
        const { uploadService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        // POST /upload/deliverable/{deliverableId}
        if (method === 'POST' && path.includes('/upload/deliverable/')) {
            const deliverableId = event.pathParameters?.deliverableId;
            if (!deliverableId)
                throw new errors_1.ValidationError('deliverableId is required');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.uploadRequestSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const uploadResult = await uploadService.requestDeliverableUpload(result.data, deliverableId, ctx);
            return (0, response_1.ok)(uploadResult);
        }
        // POST /upload/submission/{deliverableId}/{studentId}
        if (method === 'POST' && path.includes('/upload/submission/')) {
            const deliverableId = event.pathParameters?.deliverableId;
            const studentId = event.pathParameters?.studentId ?? ctx.userId;
            if (!deliverableId)
                throw new errors_1.ValidationError('deliverableId is required');
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.uploadRequestSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const uploadResult = await uploadService.requestSubmissionUpload(result.data, deliverableId, studentId, ctx);
            return (0, response_1.ok)(uploadResult);
        }
        // POST /upload/teaching
        if (method === 'POST' && path.endsWith('/upload/teaching')) {
            const body = (0, response_1.parseBody)(event);
            const result = (0, common_validator_1.parseAndValidate)(submission_validator_1.uploadRequestSchema, body);
            if (!result.success)
                throw new errors_1.ValidationError(result.errors.join('; '));
            const uploadResult = await uploadService.requestTeachingDocumentUpload(result.data, ctx);
            return (0, response_1.ok)(uploadResult);
        }
        // POST /download
        if (method === 'POST' && path.endsWith('/download')) {
            const body = (0, response_1.parseBody)(event);
            if (!body.s3Key)
                throw new errors_1.ValidationError('s3Key is required');
            const downloadResult = await uploadService.generateDownloadUrl(body.s3Key, ctx);
            return (0, response_1.ok)(downloadResult);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=upload.handler.js.map