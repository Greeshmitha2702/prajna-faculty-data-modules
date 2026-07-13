"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – S3 Adapter (AWS SDK v3) – Pre-signed URL Architecture
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Adapter = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_2 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION ?? 'ap-south-1',
});
class S3Adapter {
    bucketName;
    constructor(bucketName) {
        this.bucketName = bucketName;
    }
    async generatePresignedUploadUrl(s3Key, contentType, expiresInSeconds = 300) {
        const command = new client_s3_2.PutObjectCommand({
            Bucket: this.bucketName,
            Key: s3Key,
            ContentType: contentType,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, {
            expiresIn: expiresInSeconds,
        });
        return {
            uploadUrl,
            s3Key,
            expiresIn: expiresInSeconds,
        };
    }
    async generatePresignedDownloadUrl(s3Key, expiresInSeconds = 300) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: s3Key,
        });
        const downloadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, {
            expiresIn: expiresInSeconds,
        });
        return {
            downloadUrl,
            expiresIn: expiresInSeconds,
        };
    }
    async deleteObject(s3Key) {
        await s3Client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucketName, Key: s3Key }));
    }
    async headObject(s3Key) {
        try {
            await s3Client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucketName, Key: s3Key }));
            return true;
        }
        catch {
            return false;
        }
    }
    buildTeachingUploadKey(facultyId, fileName) {
        return `documents/faculty/${facultyId}/teaching/${Date.now()}_${fileName}`;
    }
    buildDeliverableKey(facultyId, deliverableId, fileName) {
        return `documents/faculty/${facultyId}/teaching/deliverables/${deliverableId}/${Date.now()}_${fileName}`;
    }
    buildSubmissionKey(facultyId, deliverableId, studentId, fileName) {
        return `documents/faculty/${facultyId}/teaching/deliverables/${deliverableId}/submissions/${studentId}/${Date.now()}_${fileName}`;
    }
}
exports.S3Adapter = S3Adapter;
//# sourceMappingURL=s3.adapter.js.map