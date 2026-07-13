import { handler as deliverableHandler } from '../../../src/handlers/deliverable.handler';
import { handler as feedbackHandler } from '../../../src/handlers/feedback.handler';
import { handler as gradebookHandler } from '../../../src/handlers/gradebook.handler';
import { handler as scheduleHandler } from '../../../src/handlers/schedule.handler';
import { handler as submissionHandler } from '../../../src/handlers/submission.handler';
import { handler as uploadHandler } from '../../../src/handlers/upload.handler';

import { getContainer } from '../../../src/handlers/shared/container';
import { UserRole } from '../../../src/models/common.model';
import { parseAndValidate } from '../../../src/validators/common.validator';

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
  let mockContainer: any;

  const mockClaims = {
    'custom:facultyId': 'fac-1',
    'custom:role': UserRole.FACULTY,
    'custom:campus': 'MAIN',
    'custom:department': 'CS',
    sub: 'usr-1',
  };

  const createEvent = (method: string, path: string, body: any = null, pathParameters: any = null, queryStringParameters: any = null): any => ({
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

    (getContainer as jest.Mock).mockReturnValue(mockContainer);
  });

  describe('Deliverable Handler', () => {
    it('routes POST /deliverables', async () => {
      mockContainer.deliverableService.create.mockResolvedValue({ id: '1' });
      const event = createEvent('POST', '/deliverables', { title: 'Test' });
      const res = await deliverableHandler(event);
      expect((res as any).statusCode).toBe(201);
    });

    it('routes GET /deliverables', async () => {
      mockContainer.deliverableService.list.mockResolvedValue({ items: [], count: 0 });
      const event = createEvent('GET', '/deliverables');
      const res = await deliverableHandler(event);
      expect((res as any).statusCode).toBe(200);
    });
  });

  describe('Feedback Handler', () => {
    it('routes POST /feedback', async () => {
      mockContainer.feedbackService.create.mockResolvedValue({ id: 'fb-1' });
      const event = createEvent('POST', '/feedback', { title: 'Test' });
      const res = await feedbackHandler(event);
      expect((res as any).statusCode).toBe(201);
    });
  });

  describe('Gradebook Handler', () => {
    it('routes GET /gradebook', async () => {
      mockContainer.gradebookService.listByFaculty.mockResolvedValue({ items: [], count: 0 });
      const event = createEvent('GET', '/gradebook');
      const res = await gradebookHandler(event);
      expect((res as any).statusCode).toBe(200);
    });
  });

  describe('Schedule Handler', () => {
    it('routes GET /faculty/teaching/load', async () => {
      mockContainer.scheduleService.getTeachingLoad.mockResolvedValue({});
      const event = createEvent('GET', '/faculty/teaching/load');
      const res = await scheduleHandler(event);
      expect((res as any).statusCode).toBe(200);
    });
  });

  describe('Submission Handler', () => {
    it('routes POST /submissions', async () => {
      mockContainer.submissionService.create.mockResolvedValue({ id: 'sub-1' });
      const event = createEvent('POST', '/submissions', { deliverableId: 'd1' });
      const res = await submissionHandler(event);
      expect((res as any).statusCode).toBe(201);
    });
  });

  describe('Upload Handler', () => {
    it('routes POST /upload/teaching', async () => {
      mockContainer.uploadService.requestTeachingDocumentUpload.mockResolvedValue({ url: 'u' });
      const event = createEvent('POST', '/upload/teaching', { fileName: 'd.pdf' });
      const res = await uploadHandler(event);
      expect((res as any).statusCode).toBe(200);
    });
  });
});
