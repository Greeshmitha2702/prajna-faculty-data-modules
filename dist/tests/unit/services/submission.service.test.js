"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const submission_service_1 = require("../../../src/services/submission.service");
const common_model_1 = require("../../../src/models/common.model");
const errors_1 = require("../../../src/services/errors");
describe('SubmissionService', () => {
    let service;
    let mockSubRepo;
    let mockDelRepo;
    let mockEb;
    const mockCtx = {
        facultyId: 'fac-1',
        role: common_model_1.UserRole.FACULTY,
        campus: 'MAIN',
        department: 'CS',
        userId: 'usr-1',
    };
    const mockDeliverable = {
        deliverableId: 'del-1',
        facultyId: 'fac-1',
        totalMarks: 100,
        passingMarks: 40,
        status: common_model_1.DeliverableStatus.PUBLISHED,
    };
    const mockSubmission = {
        submissionId: 'sub-1',
        deliverableId: 'del-1',
        studentId: 'stud-1',
        status: common_model_1.SubmissionStatus.SUBMITTED,
        facultyId: 'fac-1',
    };
    beforeEach(() => {
        mockSubRepo = {
            create: jest.fn(),
            getById: jest.fn(),
            grade: jest.fn(),
            listByDeliverable: jest.fn(),
            listByStudent: jest.fn(),
        };
        mockDelRepo = {
            getById: jest.fn(),
            incrementSubmissionCount: jest.fn(),
        };
        mockEb = {
            publish: jest.fn(),
        };
        service = new submission_service_1.SubmissionService(mockSubRepo, mockDelRepo, mockEb);
    });
    describe('create', () => {
        it('should create submission', async () => {
            mockDelRepo.getById.mockResolvedValue(mockDeliverable);
            mockSubRepo.create.mockResolvedValue(mockSubmission);
            const res = await service.create({ deliverableId: 'del-1', studentId: 'stud-1' }, mockCtx);
            expect(res).toEqual(mockSubmission);
        });
    });
    describe('grade', () => {
        it('should grade submission', async () => {
            mockSubRepo.getById.mockResolvedValue(mockSubmission);
            mockDelRepo.getById.mockResolvedValue(mockDeliverable);
            mockSubRepo.grade.mockResolvedValue({ ...mockSubmission, status: common_model_1.SubmissionStatus.GRADED });
            const res = await service.grade('sub-1', { marksObtained: 80 }, mockCtx);
            expect(res.status).toBe(common_model_1.SubmissionStatus.GRADED);
        });
        it('should throw ForbiddenError if not authorized', async () => {
            mockSubRepo.getById.mockResolvedValue({ ...mockSubmission, facultyId: 'fac-2' });
            await expect(service.grade('sub-1', { marksObtained: 80 }, mockCtx)).rejects.toThrow(errors_1.ForbiddenError);
        });
    });
    describe('queries', () => {
        it('should get by id', async () => {
            mockSubRepo.getById.mockResolvedValue(mockSubmission);
            const res = await service.getById('sub-1', mockCtx);
            expect(res).toEqual(mockSubmission);
        });
        it('should list by deliverable', async () => {
            mockDelRepo.getById.mockResolvedValue(mockDeliverable);
            mockSubRepo.listByDeliverable.mockResolvedValue({ items: [mockSubmission], count: 1 });
            const res = await service.listByDeliverable('del-1', mockCtx);
            expect(res.items.length).toBe(1);
        });
    });
});
//# sourceMappingURL=submission.service.test.js.map