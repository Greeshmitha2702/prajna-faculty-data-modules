import { DeliverableRepository } from '../../../src/repositories/deliverable.repository';
import { FeedbackRepository } from '../../../src/repositories/feedback.repository';
import { GradeBookRepository } from '../../../src/repositories/gradebook.repository';
import { SubmissionRepository } from '../../../src/repositories/submission.repository';
import {
  LessonPlanRepository,
  AttendanceRepository,
  TeachingSessionRepository,
} from '../../../src/repositories/teaching-session.repository';
import { DdbAdapter } from '../../../src/adapters/ddb.adapter';

describe('Repositories Integration Tests with DdbAdapter Mocks', () => {
  let mockDdb: jest.Mocked<DdbAdapter>;

  beforeEach(() => {
    mockDdb = {
      put: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      updateItem: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
      queryAll: jest.fn(),
      batchWrite: jest.fn(),
      transactWrite: jest.fn(),
    } as any;
  });

  describe('DeliverableRepository', () => {
    it('should create and retrieve deliverable', async () => {
      const repo = new DeliverableRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ deliverableId: 'del-1' });

      await repo.create({ deliverableId: 'del-1' } as any, 'fac-1', 'CS101', '23-24', 'S1');
      const res = await repo.getById('del-1');
      expect(res?.deliverableId).toBe('del-1');
    });
  });

  describe('FeedbackRepository', () => {
    it('should create and retrieve feedback', async () => {
      const repo = new FeedbackRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ feedbackId: 'fb-1' });

      await repo.create({ feedbackId: 'fb-1' } as any, 'fac-1', 'MAIN', 'CS', 'usr-1');
      const res = await repo.getById('fb-1');
      expect(res?.feedbackId).toBe('fb-1');
    });
  });

  describe('GradeBookRepository', () => {
    it('should upsert and retrieve gradebook', async () => {
      const repo = new GradeBookRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ gradebookId: 'gb-1' });

      await repo.upsert('fac-1', 'CS101', 'Intro', 'B1', 'S1', '23-24', 'MAIN', 'CS', [], [], 'usr-1');
      const res = await repo.getById('gb-1');
      expect(res?.gradebookId).toBe('gb-1');
    });
  });

  describe('SubmissionRepository', () => {
    it('should create and retrieve submission', async () => {
      const repo = new SubmissionRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ submissionId: 'sub-1' });

      await repo.create({ submissionId: 'sub-1', deliverableId: 'del-1' } as any, 'fac-1', 100, '2023-12-01', 'usr-1');
      const res = await repo.getById('sub-1');
      expect(res?.submissionId).toBe('sub-1');
    });
  });

  describe('TeachingSessionRepositories', () => {
    it('should handle LessonPlanRepository', async () => {
      const repo = new LessonPlanRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ planId: 'lp-1' });

      await repo.create({ planId: 'lp-1', courseCode: 'CS101', date: '2023-12-01' } as any, 'fac-1', 'MAIN', 'CS', 'usr-1');
      const res = await repo.getById('lp-1');
      expect(res?.planId).toBe('lp-1');
    });

    it('should handle AttendanceRepository', async () => {
      const repo = new AttendanceRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ sessionId: 'sess-1' });

      await repo.createSession({ sessionId: 'sess-1', courseCode: 'CS101', date: '2023-12-01', records: [] } as any, 'fac-1', 'MAIN', 'CS', 'usr-1');
      const res = await repo.getSessionById('sess-1');
      expect(res?.sessionId).toBe('sess-1');
    });

    it('should handle TeachingSessionRepository', async () => {
      const repo = new TeachingSessionRepository(mockDdb);
      mockDdb.put.mockResolvedValue();
      mockDdb.get.mockResolvedValue({ sessionId: 'sess-1' });

      await repo.create({ sessionId: 'sess-1', courseCode: 'CS101', date: '2023-12-01' } as any, 'fac-1', 'MAIN', 'CS', 'usr-1');
      const res = await repo.getById('sess-1');
      expect(res?.sessionId).toBe('sess-1');
    });
  });
});
