"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_service_1 = require("../../../src/services/upload.service");
const common_model_1 = require("../../../src/models/common.model");
describe('UploadService', () => {
    let service;
    let mockS3;
    const mockCtx = {
        facultyId: 'fac-1',
        role: common_model_1.UserRole.FACULTY,
        campus: 'MAIN',
        department: 'CS',
        userId: 'usr-1',
    };
    beforeEach(() => {
        mockS3 = {
            generatePresignedUploadUrl: jest.fn(),
            generatePresignedDownloadUrl: jest.fn(),
            buildDeliverableKey: jest.fn().mockReturnValue('del-key'),
            buildSubmissionKey: jest.fn().mockReturnValue('sub-key'),
            buildTeachingUploadKey: jest.fn().mockReturnValue('teach-key'),
        };
        service = new upload_service_1.UploadService(mockS3);
    });
    describe('uploads', () => {
        it('should generate pre-signed upload post for deliverable', async () => {
            mockS3.generatePresignedUploadUrl.mockResolvedValue({ uploadUrl: 'http://upload', s3Key: 'k', expiresIn: 300 });
            const res = await service.requestDeliverableUpload({ contentType: 'application/pdf', fileName: 'test.pdf', sizeBytes: 100 }, 'del-1', mockCtx);
            expect(res.uploadUrl).toBe('http://upload');
        });
        it('should generate pre-signed upload post for submission', async () => {
            mockS3.generatePresignedUploadUrl.mockResolvedValue({ uploadUrl: 'http://upload', s3Key: 'k', expiresIn: 300 });
            const res = await service.requestSubmissionUpload({ contentType: 'application/pdf', fileName: 'test.pdf', sizeBytes: 100 }, 'del-1', 'stud-1', mockCtx);
            expect(res.uploadUrl).toBe('http://upload');
        });
        it('should generate pre-signed upload post for teaching document', async () => {
            mockS3.generatePresignedUploadUrl.mockResolvedValue({ uploadUrl: 'http://upload', s3Key: 'k', expiresIn: 300 });
            const res = await service.requestTeachingDocumentUpload({ contentType: 'application/pdf', fileName: 'test.pdf', sizeBytes: 100 }, mockCtx);
            expect(res.uploadUrl).toBe('http://upload');
        });
    });
    describe('downloads', () => {
        it('should generate pre-signed download url', async () => {
            mockS3.generatePresignedDownloadUrl.mockResolvedValue({ downloadUrl: 'http://download', expiresIn: 300 });
            const res = await service.generateDownloadUrl('some/key', mockCtx);
            expect(res.downloadUrl).toBe('http://download');
        });
    });
});
//# sourceMappingURL=upload.service.test.js.map