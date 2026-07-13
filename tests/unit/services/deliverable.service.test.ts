import { DeliverableService } from '../../../src/services/deliverable.service';
import { DeliverableRepository } from '../../../src/repositories/deliverable.repository';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { DeliverableStatus, DeliverableType, UserRole } from '../../../src/models/common.model';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../src/services/errors';

describe('DeliverableService', () => {
  let service: DeliverableService;
  let mockRepo: jest.Mocked<DeliverableRepository>;
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
    courseCode: 'CS101',
    courseTitle: 'Intro to CS',
    batchId: 'B1',
    semester: 'S1',
    academicYear: '2023-2024',
    campus: 'MAIN',
    department: 'CS',
    title: 'Assignment 1',
    description: 'Desc',
    type: DeliverableType.ASSIGNMENT,
    status: DeliverableStatus.DRAFT,
    totalMarks: 100,
    passingMarks: 40,
    weightagePercent: 10,
    dueDate: '2023-12-01',
    allowLateSubmission: false,
    latePenaltyPercentPerDay: 0,
    attachments: [],
    rubric: [],
    submissionCount: 0,
    gradedCount: 0,
    createdAt: 'now',
    updatedAt: 'now',
    createdBy: 'usr-1',
    updatedBy: 'usr-1',
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      listByFaculty: jest.fn(),
      listByCourse: jest.fn(),
      incrementSubmissionCount: jest.fn(),
    } as unknown as jest.Mocked<DeliverableRepository>;

    mockEb = {
      publish: jest.fn(),
      publishBatch: jest.fn(),
    } as unknown as jest.Mocked<EventBridgeAdapter>;

    service = new DeliverableService(mockRepo, mockEb);
  });

  describe('create', () => {
    it('should create a deliverable if user has write access', async () => {
      mockRepo.create.mockResolvedValue(mockDeliverable);
      const result = await service.create({} as any, mockCtx);
      expect(result).toEqual(mockDeliverable);
      expect(mockRepo.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenError if user cannot write', async () => {
      await expect(
        service.create({} as any, { ...mockCtx, role: 'STUDENT' as any })
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe('publish', () => {
    it('should publish draft deliverable and emit event', async () => {
      mockRepo.getById.mockResolvedValue(mockDeliverable);
      mockRepo.update.mockResolvedValue({ ...mockDeliverable, status: DeliverableStatus.PUBLISHED });

      const result = await service.publish('del-1', mockCtx);
      
      expect(result.status).toBe(DeliverableStatus.PUBLISHED);
      expect(mockRepo.update).toHaveBeenCalledWith('del-1', { status: DeliverableStatus.PUBLISHED }, 'usr-1');
      expect(mockEb.publish).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'deliverable.published',
      }));
    });

    it('should throw ValidationError if already published', async () => {
      mockRepo.getById.mockResolvedValue({ ...mockDeliverable, status: DeliverableStatus.PUBLISHED });
      await expect(service.publish('del-1', mockCtx)).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should delete if status is not PUBLISHED', async () => {
      mockRepo.getById.mockResolvedValue(mockDeliverable);
      mockRepo.delete.mockResolvedValue();
      await service.delete('del-1', mockCtx);
      expect(mockRepo.delete).toHaveBeenCalledWith('del-1');
    });

    it('should throw ForbiddenError if status is PUBLISHED', async () => {
      mockRepo.getById.mockResolvedValue({ ...mockDeliverable, status: DeliverableStatus.PUBLISHED });
      await expect(service.delete('del-1', mockCtx)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('update', () => {
    it('should update deliverable', async () => {
      mockRepo.getById.mockResolvedValue(mockDeliverable);
      mockRepo.update.mockResolvedValue({ ...mockDeliverable, title: 'Updated' });
      const res = await service.update('del-1', { title: 'Updated' } as any, mockCtx);
      expect(res.title).toBe('Updated');
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('should throw ForbiddenError if user cannot write', async () => {
      mockRepo.getById.mockResolvedValue(mockDeliverable);
      await expect(service.update('del-1', {} as any, { ...mockCtx, role: 'STUDENT' as any })).rejects.toThrow(ForbiddenError);
    });
  });

  describe('list and queries', () => {
    it('should list by course', async () => {
      mockRepo.listByFaculty.mockResolvedValue({ items: [mockDeliverable], count: 1 });
      const res = await service.list(mockCtx, { courseCode: 'CS101' });
      expect(res.items.length).toBe(1);
    });

    it('should list by faculty id', async () => {
      mockRepo.listByFaculty.mockResolvedValue({ items: [mockDeliverable], count: 1 });
      const res = await service.listByFacultyId('fac-1', mockCtx, {});
      expect(res.items.length).toBe(1);
    });
  });
});
