export interface PresignedUploadResult {
    uploadUrl: string;
    s3Key: string;
    expiresIn: number;
}
export interface PresignedDownloadResult {
    downloadUrl: string;
    expiresIn: number;
}
export declare class S3Adapter {
    private readonly bucketName;
    constructor(bucketName: string);
    generatePresignedUploadUrl(s3Key: string, contentType: string, expiresInSeconds?: number): Promise<PresignedUploadResult>;
    generatePresignedDownloadUrl(s3Key: string, expiresInSeconds?: number): Promise<PresignedDownloadResult>;
    deleteObject(s3Key: string): Promise<void>;
    headObject(s3Key: string): Promise<boolean>;
    buildTeachingUploadKey(facultyId: string, fileName: string): string;
    buildDeliverableKey(facultyId: string, deliverableId: string, fileName: string): string;
    buildSubmissionKey(facultyId: string, deliverableId: string, studentId: string, fileName: string): string;
}
