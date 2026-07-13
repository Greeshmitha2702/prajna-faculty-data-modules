import { GradeBookService } from '../../../src/services/gradebook.service';
import { GradeBookRepository } from '../../../src/repositories/gradebook.repository';
import { DeliverableRepository } from '../../../src/repositories/deliverable.repository';
import { SubmissionRepository } from '../../../src/repositories/submission.repository';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { UserRole } from '../../../src/models/common.model';

describe('GradeBookService', () => {
  let service: GradeBookService;
  let mockGbRepo: jest.Mocked<GradeBookRepository>;
  let mockDelRepo: jest.Mocked<DeliverableRepository>;
  let mockSubRepo: jest.Mocked<SubmissionRepository>;
  let mockEb: jest.Mocked<EventBridgeAdapter>;

  const mockCtx = {
    facultyId: 'fac-1',
    role: UserRole.FACULTY,
    campus: 'MAIN',
    department: 'CS',
    userId: 'usr-1',
  };

  const mockGradebook = { gradebookId: 'gb-1', facultyId: 'fac-1' } as any;

  beforeEach(() => {
    mockGbRepo = {
      upsert: jest.fn(),
      listByFaculty: jest.fn(),
      getById: jest.fn(),
    } as any;

    mockDelRepo = {
      listByCourse: jest.fn(),
    } as any;

    mockSubRepo = {
      listByDeliverable: jest.fn(),
    } as any;

    mockEb = {
      publish: jest.fn(),
    } as any;

    service = new GradeBookService(mockGbRepo, mockDelRepo, mockSubRepo, mockEb);
  });

  describe('getOrSync', () => {
    it('should aggregate deliverables/submissions and upsert gradebook', async () => {
      mockDelRepo.listByCourse.mockResolvedValue({ items: [], count: 0 });
      mockGbRepo.upsert.mockResolvedValue(mockGradebook);

      const res = await service.getOrSync('CS101', 'B1', 'S1', '2023-2024', mockCtx);
      expect(res).toEqual(mockGradebook);
      expect(mockGbRepo.upsert).toHaveBeenCalled();
    });
  });

  describe('queries', () => {
    it('should list by faculty', async () => {
      mockGbRepo.listByFaculty.mockResolvedValue({ items: [mockGradebook], count: 1 });
      const res = await service.listByFaculty(mockCtx);
      expect(res.items.length).toBe(1);
    });

    it('should get by faculty and key fields', async () => {
      mockGbRepo.getById.mockResolvedValue(mockGradebook);
      const res = await service.getByFacultyId('fac-1', 'CS101', 'B1', 'S1', '2023-2024', mockCtx);
      expect(res).toEqual(mockGradebook);
    });
  });
});
