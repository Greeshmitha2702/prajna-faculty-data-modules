import { ScheduleService } from '../../../src/services/schedule.service';
import {
  LessonPlanRepository,
  AttendanceRepository,
  TeachingSessionRepository,
} from '../../../src/repositories/teaching-session.repository';
import { EventBridgeAdapter } from '../../../src/adapters/eventbridge.adapter';
import { SessionStatus, UserRole } from '../../../src/models/common.model';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let mockLessonPlanRepo: jest.Mocked<LessonPlanRepository>;
  let mockAttendanceRepo: jest.Mocked<AttendanceRepository>;
  let mockSessionRepo: jest.Mocked<TeachingSessionRepository>;
  let mockEb: jest.Mocked<EventBridgeAdapter>;

  const mockCtx = {
    facultyId: 'fac-1',
    role: UserRole.FACULTY,
    campus: 'MAIN',
    department: 'CS',
    userId: 'usr-1',
  };

  const mockLessonPlan = { planId: 'lp-1', facultyId: 'fac-1' } as any;
  const mockAttendance = { sessionId: 'sess-1', facultyId: 'fac-1', records: [] } as any;
  const mockSession = { sessionId: 'sess-1', facultyId: 'fac-1', status: SessionStatus.SCHEDULED } as any;

  beforeEach(() => {
    mockLessonPlanRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      listByFaculty: jest.fn(),
    } as any;

    mockAttendanceRepo = {
      createSession: jest.fn(),
      getSessionById: jest.fn(),
      updateSession: jest.fn(),
      listByFaculty: jest.fn(),
    } as any;

    mockSessionRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      listByFaculty: jest.fn(),
      getTeachingLoad: jest.fn(),
      getTimetable: jest.fn(),
    } as any;

    mockEb = {
      publish: jest.fn(),
    } as any;

    service = new ScheduleService(
      mockLessonPlanRepo,
      mockAttendanceRepo,
      mockSessionRepo,
      mockEb
    );
  });

  describe('Lesson Plans', () => {
    it('should create lesson plan', async () => {
      mockLessonPlanRepo.create.mockResolvedValue(mockLessonPlan);
      const res = await service.createLessonPlan({} as any, mockCtx);
      expect(res).toEqual(mockLessonPlan);
    });

    it('should list lesson plans', async () => {
      mockLessonPlanRepo.listByFaculty.mockResolvedValue({ items: [mockLessonPlan], count: 1 });
      const res = await service.listLessonPlans(mockCtx, {});
      expect(res.items.length).toBe(1);
    });
  });

  describe('Attendance', () => {
    it('should create attendance', async () => {
      mockAttendanceRepo.createSession.mockResolvedValue(mockAttendance);
      const res = await service.createAttendance({} as any, mockCtx);
      expect(res).toEqual(mockAttendance);
    });
  });

  describe('Sessions', () => {
    it('should schedule session', async () => {
      mockSessionRepo.create.mockResolvedValue(mockSession);
      const res = await service.scheduleSession({} as any, mockCtx);
      expect(res).toEqual(mockSession);
    });

    it('should cancel session', async () => {
      mockSessionRepo.getById.mockResolvedValue(mockSession);
      mockSessionRepo.update.mockResolvedValue({ ...mockSession, status: SessionStatus.CANCELLED });
      const res = await service.cancelSession('sess-1', 'Reason', mockCtx);
      expect(res.status).toBe(SessionStatus.CANCELLED);
    });
  });
});
