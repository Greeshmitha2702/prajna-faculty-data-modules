"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gradebook_service_1 = require("../../../src/services/gradebook.service");
const common_model_1 = require("../../../src/models/common.model");
describe('GradeBookService', () => {
    let service;
    let mockGbRepo;
    let mockDelRepo;
    let mockSubRepo;
    let mockEb;
    const mockCtx = {
        facultyId: 'fac-1',
        role: common_model_1.UserRole.FACULTY,
        campus: 'MAIN',
        department: 'CS',
        userId: 'usr-1',
    };
    const mockGradebook = { gradebookId: 'gb-1', facultyId: 'fac-1' };
    beforeEach(() => {
        mockGbRepo = {
            upsert: jest.fn(),
            listByFaculty: jest.fn(),
            getById: jest.fn(),
        };
        mockDelRepo = {
            listByCourse: jest.fn(),
        };
        mockSubRepo = {
            listByDeliverable: jest.fn(),
        };
        mockEb = {
            publish: jest.fn(),
        };
        service = new gradebook_service_1.GradeBookService(mockGbRepo, mockDelRepo, mockSubRepo, mockEb);
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
//# sourceMappingURL=gradebook.service.test.js.map