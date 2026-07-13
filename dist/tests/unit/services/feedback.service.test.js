"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_service_1 = require("../../../src/services/feedback.service");
const common_model_1 = require("../../../src/models/common.model");
describe('FeedbackService', () => {
    let service;
    let mockRepo;
    let mockEb;
    const mockCtx = {
        facultyId: 'fac-1',
        role: common_model_1.UserRole.FACULTY,
        campus: 'MAIN',
        department: 'CS',
        userId: 'usr-1',
    };
    const mockFeedback = {
        feedbackId: 'fb-1',
        facultyId: 'fac-1',
        status: common_model_1.FeedbackStatus.PENDING,
        responses: [],
        questions: [],
    };
    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            getById: jest.fn(),
            release: jest.fn(),
            listByFaculty: jest.fn(),
        };
        mockEb = {
            publish: jest.fn(),
        };
        service = new feedback_service_1.FeedbackService(mockRepo, mockEb);
    });
    describe('create', () => {
        it('should create feedback form', async () => {
            mockRepo.create.mockResolvedValue(mockFeedback);
            const res = await service.create({}, mockCtx);
            expect(res).toEqual(mockFeedback);
        });
    });
    describe('release', () => {
        it('should release feedback', async () => {
            mockRepo.getById.mockResolvedValue(mockFeedback);
            mockRepo.release.mockResolvedValue({ ...mockFeedback, status: common_model_1.FeedbackStatus.RELEASED });
            const res = await service.release('fb-1', mockCtx);
            expect(res.status).toBe(common_model_1.FeedbackStatus.RELEASED);
        });
    });
    describe('submitResponse', () => {
        it('should submit feedback response', async () => {
            mockRepo.getById.mockResolvedValue(mockFeedback);
            mockRepo.release.mockResolvedValue(mockFeedback);
            const res = await service.submitResponse({ feedbackId: 'fb-1', studentId: 'stud-1', responses: [] }, mockCtx);
            expect(res).toBeDefined();
        });
    });
    describe('queries', () => {
        it('should get by id', async () => {
            mockRepo.getById.mockResolvedValue(mockFeedback);
            const res = await service.getById('fb-1', mockCtx);
            expect(res).toEqual(mockFeedback);
        });
        it('should list', async () => {
            mockRepo.listByFaculty.mockResolvedValue({ items: [mockFeedback], count: 1 });
            const res = await service.list(mockCtx, {});
            expect(res.items.length).toBe(1);
        });
    });
});
//# sourceMappingURL=feedback.service.test.js.map