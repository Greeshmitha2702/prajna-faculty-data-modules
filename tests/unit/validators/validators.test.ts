import { parseAndValidate } from '../../../src/validators/common.validator';
import {
  createDeliverableSchema,
  updateDeliverableSchema,
  listDeliverablesQuerySchema,
} from '../../../src/validators/deliverable.validator';
import {
  createFeedbackSchema,
  submitFeedbackResponseSchema,
  listFeedbackQuerySchema,
} from '../../../src/validators/feedback.validator';
import {
  createLessonPlanSchema,
  updateLessonPlanSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
  createSessionSchema,
  updateSessionSchema,
} from '../../../src/validators/session.validator';
import {
  createSubmissionSchema,
  gradeSubmissionSchema,
} from '../../../src/validators/submission.validator';

describe('Validators Unit Tests', () => {
  it('validates common helper validations', () => {
    const res = parseAndValidate(createDeliverableSchema, {
      courseCode: 'CS101',
      courseTitle: 'Intro',
      batchId: 'B1',
      semester: 'S1',
      academicYear: '2023-2024',
      title: 'Assignment 1',
      description: 'Test description',
      type: 'ASSIGNMENT',
      totalMarks: 100,
      passingMarks: 40,
      weightagePercent: 10,
      dueDate: '2023-12-01',
      allowLateSubmission: false,
      latePenaltyPercentPerDay: 5,
    });
    expect(res.success).toBe(true);
  });

  it('validates update deliverable', () => {
    const res = parseAndValidate(updateDeliverableSchema, {
      title: 'New Title',
    });
    expect(res.success).toBe(true);
  });

  it('validates feedback creation', () => {
    const res = parseAndValidate(createFeedbackSchema, {
      courseCode: 'CS101',
      courseTitle: 'Intro',
      batchId: 'B1',
      semester: 'S1',
      academicYear: '2023-2024',
      type: 'COURSE',
      title: 'Course Evaluation',
      description: 'Course eval feedback',
      questions: [
        {
          questionId: '550e8400-e29b-41d4-a716-446655440000',
          text: 'Rate the course',
          category: 'teaching',
          maxScore: 5,
        },
      ],
      collectionStartDate: '2023-12-01',
      collectionEndDate: '2023-12-15',
    });
    expect(res.success).toBe(true);
  });

  it('validates submit feedback response', () => {
    const res = parseAndValidate(submitFeedbackResponseSchema, {
      feedbackId: '550e8400-e29b-41d4-a716-446655440000',
      responses: [
        {
          questionId: '550e8400-e29b-41d4-a716-446655440000',
          score: 5,
          comment: 'Good',
        },
      ],
    });
    expect(res.success).toBe(true);
  });

  it('validates lesson plan creation', () => {
    const res = parseAndValidate(createLessonPlanSchema, {
      courseCode: 'CS101',
      courseTitle: 'Intro',
      batchId: 'B1',
      semester: 'S1',
      academicYear: '2023-2024',
      date: '2023-12-01',
      weekNumber: 1,
      sessionNumber: 1,
      duration: 60,
      objectives: ['Learn variables'],
      topics: [
        {
          topicId: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Variables',
          description: 'Declaring variables',
          duration: 30,
          learningOutcomes: ['outcome'],
          teachingMethods: ['methods'],
        },
      ],
      assessmentStrategy: 'Quiz',
    });
    expect(res.success).toBe(true);
  });

  it('validates update lesson plan', () => {
    const res = parseAndValidate(updateLessonPlanSchema, {
      duration: 90,
    });
    expect(res.success).toBe(true);
  });

  it('validates attendance creation', () => {
    const res = parseAndValidate(createAttendanceSchema, {
      courseCode: 'CS101',
      courseTitle: 'Intro',
      batchId: 'B1',
      semester: 'S1',
      academicYear: '2023-2024',
      date: '2023-12-01',
      startTime: '10:00',
      endTime: '11:00',
      topic: 'Conditionals',
      records: [
        {
          studentId: 'stud-1',
          studentName: 'Name',
          enrollmentNo: 'EN1',
          status: 'PRESENT',
        },
      ],
    });
    expect(res.success).toBe(true);
  });

  it('validates update attendance', () => {
    const res = parseAndValidate(updateAttendanceSchema, {
      sessionId: '550e8400-e29b-41d4-a716-446655440000',
      records: [
        {
          studentId: 'stud-1',
          status: 'ABSENT',
        },
      ],
    });
    expect(res.success).toBe(true);
  });

  it('validates teaching session scheduling', () => {
    const res = parseAndValidate(createSessionSchema, {
      courseCode: 'CS101',
      courseTitle: 'Intro',
      batchId: 'B1',
      semester: 'S1',
      academicYear: '2023-2024',
      date: '2023-12-01',
      startTime: '10:00',
      endTime: '11:00',
      room: 'Room 1',
      dayOfWeek: 'MONDAY',
    });
    expect(res.success).toBe(true);
  });

  it('validates update teaching session', () => {
    const res = parseAndValidate(updateSessionSchema, {
      room: 'Room 2',
    });
    expect(res.success).toBe(true);
  });

  it('validates submission creation', () => {
    const res = parseAndValidate(createSubmissionSchema, {
      deliverableId: '550e8400-e29b-41d4-a716-446655440000',
      studentId: 'stud-1',
      studentName: 'Name',
      enrollmentNo: 'EN1',
      courseCode: 'CS101',
      batchId: 'B1',
    });
    expect(res.success).toBe(true);
  });

  it('validates grading submission', () => {
    const res = parseAndValidate(gradeSubmissionSchema, {
      marksObtained: 85,
    });
    expect(res.success).toBe(true);
  });
});
