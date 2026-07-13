"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule_service_1 = require("../../../src/services/schedule.service");
const common_model_1 = require("../../../src/models/common.model");
describe('ScheduleService', () => {
    let service;
    let mockLessonPlanRepo;
    let mockAttendanceRepo;
    let mockSessionRepo;
    let mockEb;
    const mockCtx = {
        facultyId: 'fac-1',
        role: common_model_1.UserRole.FACULTY,
        campus: 'MAIN',
        department: 'CS',
        userId: 'usr-1',
    };
    const mockLessonPlan = { planId: 'lp-1', facultyId: 'fac-1' };
    const mockAttendance = { sessionId: 'sess-1', facultyId: 'fac-1', records: [] };
    const mockSession = { sessionId: 'sess-1', facultyId: 'fac-1', status: common_model_1.SessionStatus.SCHEDULED };
    beforeEach(() => {
        mockLessonPlanRepo = {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            listByFaculty: jest.fn(),
        };
        mockAttendanceRepo = {
            createSession: jest.fn(),
            getSessionById: jest.fn(),
            updateSession: jest.fn(),
            listByFaculty: jest.fn(),
        };
        mockSessionRepo = {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            listByFaculty: jest.fn(),
            getTeachingLoad: jest.fn(),
            getTimetable: jest.fn(),
        };
        mockEb = {
            publish: jest.fn(),
        };
        service = new schedule_service_1.ScheduleService(mockLessonPlanRepo, mockAttendanceRepo, mockSessionRepo, mockEb);
    });
    describe('Lesson Plans', () => {
        it('should create lesson plan', async () => {
            mockLessonPlanRepo.create.mockResolvedValue(mockLessonPlan);
            const res = await service.createLessonPlan({}, mockCtx);
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
            const res = await service.createAttendance({}, mockCtx);
            expect(res).toEqual(mockAttendance);
        });
    });
    describe('Sessions', () => {
        it('should schedule session', async () => {
            mockSessionRepo.create.mockResolvedValue(mockSession);
            const res = await service.scheduleSession({}, mockCtx);
            expect(res).toEqual(mockSession);
        });
        it('should cancel session', async () => {
            mockSessionRepo.getById.mockResolvedValue(mockSession);
            mockSessionRepo.update.mockResolvedValue({ ...mockSession, status: common_model_1.SessionStatus.CANCELLED });
            const res = await service.cancelSession('sess-1', 'Reason', mockCtx);
            expect(res.status).toBe(common_model_1.SessionStatus.CANCELLED);
        });
    });
});
//# sourceMappingURL=schedule.service.test.js.map