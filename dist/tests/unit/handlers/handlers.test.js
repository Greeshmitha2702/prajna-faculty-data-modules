"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deliverable_handler_1 = require("../../../src/handlers/deliverable.handler");
const feedback_handler_1 = require("../../../src/handlers/feedback.handler");
const gradebook_handler_1 = require("../../../src/handlers/gradebook.handler");
const schedule_handler_1 = require("../../../src/handlers/schedule.handler");
const submission_handler_1 = require("../../../src/handlers/submission.handler");
const upload_handler_1 = require("../../../src/handlers/upload.handler");
const container_1 = require("../../../src/handlers/shared/container");
const common_model_1 = require("../../../src/models/common.model");
jest.mock('../../../src/handlers/shared/container');
jest.mock('../../../src/validators/common.validator', () => {
    const original = jest.requireActual('../../../src/validators/common.validator');
    return {
        ...original,
        parseAndValidate: jest.fn().mockImplementation((schema, val) => ({
            success: true,
            data: val,
        })),
    };
});
describe('API Lambda Handlers Routing Tests', () => {
    let mockContainer;
    const mockClaims = {
        'custom:facultyId': 'fac-1',
        'custom:role': common_model_1.UserRole.FACULTY,
        'custom:campus': 'MAIN',
        'custom:department': 'CS',
        sub: 'usr-1',
    };
    const createEvent = (method, path, body = null, pathParameters = null, queryStringParameters = null) => ({
        requestContext: {
            http: {
                method,
                path,
            },
            authorizer: {
                jwt: {
                    claims: mockClaims,
                },
            },
        },
        body: body ? JSON.stringify(body) : null,
        pathParameters,
        queryStringParameters,
    });
    beforeEach(() => {
        mockContainer = {
            deliverableService: {
                create: jest.fn(),
                list: jest.fn(),
                publish: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
                listByFacultyId: jest.fn(),
            },
            submissionService: {
                create: jest.fn(),
                listByDeliverable: jest.fn(),
                grade: jest.fn(),
                getById: jest.fn(),
            },
            uploadService: {
                requestDeliverableUpload: jest.fn(),
                requestSubmissionUpload: jest.fn(),
                requestTeachingDocumentUpload: jest.fn(),
                generateDownloadUrl: jest.fn(),
            },
            feedbackService: {
                create: jest.fn(),
                list: jest.fn(),
                submitResponse: jest.fn(),
                release: jest.fn(),
                getById: jest.fn(),
            },
            scheduleService: {
                getTeachingLoad: jest.fn(),
                getTimetable: jest.fn(),
                createLessonPlan: jest.fn(),
                listLessonPlans: jest.fn(),
                updateLessonPlan: jest.fn(),
                deleteLessonPlan: jest.fn(),
                createAttendance: jest.fn(),
                listAttendance: jest.fn(),
                updateAttendance: jest.fn(),
                scheduleSession: jest.fn(),
                listSessions: jest.fn(),
                cancelSession: jest.fn(),
            },
            gradebookService: {
                listByFaculty: jest.fn(),
                getOrSync: jest.fn(),
            },
        };
        container_1.getContainer.mockReturnValue(mockContainer);
    });
    describe('Deliverable Handler', () => {
        it('routes POST /deliverables', async () => {
            mockContainer.deliverableService.create.mockResolvedValue({ id: '1' });
            const event = createEvent('POST', '/deliverables', { title: 'Test' });
            const res = await (0, deliverable_handler_1.handler)(event);
            expect(res.statusCode).toBe(201);
        });
        it('routes GET /deliverables', async () => {
            mockContainer.deliverableService.list.mockResolvedValue({ items: [], count: 0 });
            const event = createEvent('GET', '/deliverables');
            const res = await (0, deliverable_handler_1.handler)(event);
            expect(res.statusCode).toBe(200);
        });
    });
    describe('Feedback Handler', () => {
        it('routes POST /feedback', async () => {
            mockContainer.feedbackService.create.mockResolvedValue({ id: 'fb-1' });
            const event = createEvent('POST', '/feedback', { title: 'Test' });
            const res = await (0, feedback_handler_1.handler)(event);
            expect(res.statusCode).toBe(201);
        });
    });
    describe('Gradebook Handler', () => {
        it('routes GET /gradebook', async () => {
            mockContainer.gradebookService.listByFaculty.mockResolvedValue({ items: [], count: 0 });
            const event = createEvent('GET', '/gradebook');
            const res = await (0, gradebook_handler_1.handler)(event);
            expect(res.statusCode).toBe(200);
        });
    });
    describe('Schedule Handler', () => {
        it('routes GET /faculty/teaching/load', async () => {
            mockContainer.scheduleService.getTeachingLoad.mockResolvedValue({});
            const event = createEvent('GET', '/faculty/teaching/load');
            const res = await (0, schedule_handler_1.handler)(event);
            expect(res.statusCode).toBe(200);
        });
    });
    describe('Submission Handler', () => {
        it('routes POST /submissions', async () => {
            mockContainer.submissionService.create.mockResolvedValue({ id: 'sub-1' });
            const event = createEvent('POST', '/submissions', { deliverableId: 'd1' });
            const res = await (0, submission_handler_1.handler)(event);
            expect(res.statusCode).toBe(201);
        });
    });
    describe('Upload Handler', () => {
        it('routes POST /upload/teaching', async () => {
            mockContainer.uploadService.requestTeachingDocumentUpload.mockResolvedValue({ url: 'u' });
            const event = createEvent('POST', '/upload/teaching', { fileName: 'd.pdf' });
            const res = await (0, upload_handler_1.handler)(event);
            expect(res.statusCode).toBe(200);
        });
    });
});
//# sourceMappingURL=handlers.test.js.map