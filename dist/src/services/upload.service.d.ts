import { S3Adapter, PresignedUploadResult } from '../adapters/s3.adapter';
import { AuthorizerContext } from '../models/common.model';
export interface UploadRequest {
    fileName: string;
    contentType: string;
    sizeBytes: number;
    deliverableId?: string;
    submissionId?: string;
}
export interface UploadResponse extends PresignedUploadResult {
    instructions: string;
}
export declare class UploadService {
    private readonly s3;
    constructor(s3: S3Adapter);
    requestDeliverableUpload(request: UploadRequest, deliverableId: string, ctx: AuthorizerContext): Promise<UploadResponse>;
    requestSubmissionUpload(request: UploadRequest, deliverableId: string, studentId: string, ctx: AuthorizerContext): Promise<UploadResponse>;
    requestTeachingDocumentUpload(request: UploadRequest, ctx: AuthorizerContext): Promise<UploadResponse>;
    generateDownloadUrl(s3Key: string, _ctx: AuthorizerContext): Promise<{
        downloadUrl: string;
        expiresIn: number;
    }>;
}
