import { SubmissionService } from '../../../src/services/submission.service';
import { SubmissionRepository } from '../../../src/repositories/submission.repository';
import { DeliverableRepository } from '../../../src/repositories/deliverable.repository';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { SubmissionStatus, DeliverableStatus, UserRole } from '../../../src/models/common.model';
import { ForbiddenError } from '../../../src/services/errors';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let mockSubRepo: jest.Mocked<SubmissionRepository>;
  let mockDelRepo: jest.Mocked<DeliverableRepository>;
  let mockEb: jest.Mocked<EventBridgeAdapter>;

  const mockCtx = {
    facultyId: 'fac-1',
    role: UserRole.FACULTY,
    campus: 'MAIN',
    department: 'CS',
    userId: 'usr-1',
  };

  const mockDeliverable = {
    deliverableId: 'del-1',
    facultyId: 'fac-1',
    totalMarks: 100,
    passingMarks: 40,
    status: DeliverableStatus.PUBLISHED,
  } as any;

  const mockSubmission = {
    submissionId: 'sub-1',
    deliverableId: 'del-1',
    studentId: 'stud-1',
    status: SubmissionStatus.SUBMITTED,
    facultyId: 'fac-1',
  } as any;

  beforeEach(() => {
    mockSubRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      grade: jest.fn(),
      listByDeliverable: jest.fn(),
      listByStudent: jest.fn(),
    } as any;

    mockDelRepo = {
      getById: jest.fn(),
      incrementSubmissionCount: jest.fn(),
    } as any;

    mockEb = {
      publish: jest.fn(),
    } as any;

    service = new SubmissionService(mockSubRepo, mockDelRepo, mockEb);
  });

  describe('create', () => {
    it('should create submission', async () => {
      mockDelRepo.getById.mockResolvedValue(mockDeliverable);
      mockSubRepo.create.mockResolvedValue(mockSubmission);
      const res = await service.create({ deliverableId: 'del-1', studentId: 'stud-1' } as any, mockCtx);
      expect(res).toEqual(mockSubmission);
    });
  });

  describe('grade', () => {
    it('should grade submission', async () => {
      mockSubRepo.getById.mockResolvedValue(mockSubmission);
      mockDelRepo.getById.mockResolvedValue(mockDeliverable);
      mockSubRepo.grade.mockResolvedValue({ ...mockSubmission, status: SubmissionStatus.GRADED });
      const res = await service.grade('sub-1', { marksObtained: 80 } as any, mockCtx);
      expect(res.status).toBe(SubmissionStatus.GRADED);
    });

    it('should throw ForbiddenError if not authorized', async () => {
      mockSubRepo.getById.mockResolvedValue({ ...mockSubmission, facultyId: 'fac-2' });
      await expect(service.grade('sub-1', { marksObtained: 80 } as any, mockCtx)).rejects.toThrow(ForbiddenError);
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
