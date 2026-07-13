"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Upload Service (Pre-signed URL Architecture)
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const errors_1 = require("./errors");
class UploadService {
    s3;
    constructor(s3) {
        this.s3 = s3;
    }
    async requestDeliverableUpload(request, deliverableId, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const s3Key = this.s3.buildDeliverableKey(ctx.facultyId, deliverableId, request.fileName);
        const result = await this.s3.generatePresignedUploadUrl(s3Key, request.contentType, 300);
        return {
            ...result,
            instructions: 'PUT the file directly to the uploadUrl. After uploading, call PUT /deliverables/{id} with the s3Key to attach it.',
        };
    }
    async requestSubmissionUpload(request, deliverableId, studentId, ctx) {
        const s3Key = this.s3.buildSubmissionKey(ctx.facultyId, deliverableId, studentId, request.fileName);
        const result = await this.s3.generatePresignedUploadUrl(s3Key, request.contentType, 300);
        return {
            ...result,
            instructions: 'PUT the file directly to the uploadUrl. After uploading, call POST /submissions with the s3Key to create your submission.',
        };
    }
    async requestTeachingDocumentUpload(request, ctx) {
        (0, errors_1.assertCanWrite)(ctx);
        const s3Key = this.s3.buildTeachingUploadKey(ctx.facultyId, request.fileName);
        const result = await this.s3.generatePresignedUploadUrl(s3Key, request.contentType, 300);
        return {
            ...result,
            instructions: 'PUT the file directly to the uploadUrl using a PUT HTTP request with the Content-Type header.',
        };
    }
    async generateDownloadUrl(s3Key, _ctx) {
        return this.s3.generatePresignedDownloadUrl(s3Key, 300);
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map