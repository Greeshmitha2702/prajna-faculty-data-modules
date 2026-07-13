import { FeedbackService } from '../../../src/services/feedback.service';
import { FeedbackRepository } from '../../../src/repositories/feedback.repository';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { FeedbackStatus, UserRole } from '../../../src/models/common.model';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let mockRepo: jest.Mocked<FeedbackRepository>;
  let mockEb: jest.Mocked<EventBridgeAdapter>;

  const mockCtx = {
    facultyId: 'fac-1',
    role: UserRole.FACULTY,
    campus: 'MAIN',
    department: 'CS',
    userId: 'usr-1',
  };

  const mockFeedback = {
    feedbackId: 'fb-1',
    facultyId: 'fac-1',
    status: FeedbackStatus.PENDING,
    responses: [],
    questions: [],
  } as any;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      release: jest.fn(),
      listByFaculty: jest.fn(),
    } as any;

    mockEb = {
      publish: jest.fn(),
    } as any;

    service = new FeedbackService(mockRepo, mockEb);
  });

  describe('create', () => {
    it('should create feedback form', async () => {
      mockRepo.create.mockResolvedValue(mockFeedback);
      const res = await service.create({} as any, mockCtx);
      expect(res).toEqual(mockFeedback);
    });
  });

  describe('release', () => {
    it('should release feedback', async () => {
      mockRepo.getById.mockResolvedValue(mockFeedback);
      mockRepo.release.mockResolvedValue({ ...mockFeedback, status: FeedbackStatus.RELEASED });
      const res = await service.release('fb-1', mockCtx);
      expect(res.status).toBe(FeedbackStatus.RELEASED);
    });
  });

  describe('submitResponse', () => {
    it('should submit feedback response', async () => {
      mockRepo.getById.mockResolvedValue(mockFeedback);
      mockRepo.release.mockResolvedValue(mockFeedback);
      const res = await service.submitResponse({ feedbackId: 'fb-1', studentId: 'stud-1', responses: [] } as any, mockCtx);
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
