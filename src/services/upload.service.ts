// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Upload Service (Pre-signed URL Architecture)
// ─────────────────────────────────────────────────────────────────────────────

import { S3Adapter, PresignedUploadResult } from '../adapters/s3.adapter';
import { AuthorizerContext } from '../models/common.model';
import { assertCanWrite } from './errors';

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

export class UploadService {
  constructor(private readonly s3: S3Adapter) {}

  async requestDeliverableUpload(
    request: UploadRequest,
    deliverableId: string,
    ctx: AuthorizerContext
  ): Promise<UploadResponse> {
    assertCanWrite(ctx);

    const s3Key = this.s3.buildDeliverableKey(
      ctx.facultyId,
      deliverableId,
      request.fileName
    );

    const result = await this.s3.generatePresignedUploadUrl(
      s3Key,
      request.contentType,
      300
    );

    return {
      ...result,
      instructions:
        'PUT the file directly to the uploadUrl. After uploading, call PUT /deliverables/{id} with the s3Key to attach it.',
    };
  }

  async requestSubmissionUpload(
    request: UploadRequest,
    deliverableId: string,
    studentId: string,
    ctx: AuthorizerContext
  ): Promise<UploadResponse> {
    const s3Key = this.s3.buildSubmissionKey(
      ctx.facultyId,
      deliverableId,
      studentId,
      request.fileName
    );

    const result = await this.s3.generatePresignedUploadUrl(
      s3Key,
      request.contentType,
      300
    );

    return {
      ...result,
      instructions:
        'PUT the file directly to the uploadUrl. After uploading, call POST /submissions with the s3Key to create your submission.',
    };
  }

  async requestTeachingDocumentUpload(
    request: UploadRequest,
    ctx: AuthorizerContext
  ): Promise<UploadResponse> {
    assertCanWrite(ctx);

    const s3Key = this.s3.buildTeachingUploadKey(
      ctx.facultyId,
      request.fileName
    );

    const result = await this.s3.generatePresignedUploadUrl(
      s3Key,
      request.contentType,
      300
    );

    return {
      ...result,
      instructions:
        'PUT the file directly to the uploadUrl using a PUT HTTP request with the Content-Type header.',
    };
  }

  async generateDownloadUrl(
    s3Key: string,
    _ctx: AuthorizerContext
  ): Promise<{ downloadUrl: string; expiresIn: number }> {
    return this.s3.generatePresignedDownloadUrl(s3Key, 300);
  }
}
