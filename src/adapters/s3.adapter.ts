// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – S3 Adapter (AWS SDK v3) – Pre-signed URL Architecture
// ─────────────────────────────────────────────────────────────────────────────

import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export interface PresignedUploadResult {
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

export interface PresignedDownloadResult {
  downloadUrl: string;
  expiresIn: number;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION ?? 'ap-south-1',
});

export class S3Adapter {
  constructor(private readonly bucketName: string) {}

  async generatePresignedUploadUrl(
    s3Key: string,
    contentType: string,
    expiresInSeconds = 300
  ): Promise<PresignedUploadResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
    return {
      uploadUrl,
      s3Key,
      expiresIn: expiresInSeconds,
    };
  }

  async generatePresignedDownloadUrl(
    s3Key: string,
    expiresInSeconds = 300
  ): Promise<PresignedDownloadResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });
    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });
    return {
      downloadUrl,
      expiresIn: expiresInSeconds,
    };
  }

  async deleteObject(s3Key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({ Bucket: this.bucketName, Key: s3Key })
    );
  }

  async headObject(s3Key: string): Promise<boolean> {
    try {
      await s3Client.send(
        new HeadObjectCommand({ Bucket: this.bucketName, Key: s3Key })
      );
      return true;
    } catch {
      return false;
    }
  }

  buildTeachingUploadKey(facultyId: string, fileName: string): string {
    return `documents/faculty/${facultyId}/teaching/${Date.now()}_${fileName}`;
  }

  buildDeliverableKey(
    facultyId: string,
    deliverableId: string,
    fileName: string
  ): string {
    return `documents/faculty/${facultyId}/teaching/deliverables/${deliverableId}/${Date.now()}_${fileName}`;
  }

  buildSubmissionKey(
    facultyId: string,
    deliverableId: string,
    studentId: string,
    fileName: string
  ): string {
    return `documents/faculty/${facultyId}/teaching/deliverables/${deliverableId}/submissions/${studentId}/${Date.now()}_${fileName}`;
  }
}
