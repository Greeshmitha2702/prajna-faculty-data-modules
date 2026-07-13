// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DI Container Factory
// Builds all repositories, adapters, and services from environment variables.
// Called once per Lambda cold start and cached in module scope.
// ─────────────────────────────────────────────────────────────────────────────

import { DdbAdapter } from '../../adapters/ddb.adapter';
import { S3Adapter } from '../../adapters/s3.adapter';
import { EventBridgeAdapter } from '../../adapters/eventbridge.adapter';

import { DeliverableRepository } from '../../repositories/deliverable.repository';
import { SubmissionRepository } from '../../repositories/submission.repository';
import { FeedbackRepository } from '../../repositories/feedback.repository';
import {
  LessonPlanRepository,
  AttendanceRepository,
  TeachingSessionRepository,
} from '../../repositories/teaching-session.repository';
import { GradeBookRepository } from '../../repositories/gradebook.repository';

import { DeliverableService } from '../../services/deliverable.service';
import { SubmissionService } from '../../services/submission.service';
import { UploadService } from '../../services/upload.service';
import { FeedbackService } from '../../services/feedback.service';
import { ScheduleService } from '../../services/schedule.service';
import { GradeBookService } from '../../services/gradebook.service';

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

export interface Container {
  deliverableService: DeliverableService;
  submissionService: SubmissionService;
  uploadService: UploadService;
  feedbackService: FeedbackService;
  scheduleService: ScheduleService;
  gradebookService: GradeBookService;
}

let container: Container | null = null;

export function getContainer(): Container {
  if (container) return container;

  const tableName = requireEnv('DYNAMODB_TABLE_NAME');
  const bucketName = requireEnv('DOCUMENTS_BUCKET_NAME');
  const eventBusName = requireEnv('EVENT_BUS_NAME');

  // Adapters
  const ddb = new DdbAdapter(tableName);
  const s3 = new S3Adapter(bucketName);
  const eb = new EventBridgeAdapter(eventBusName);

  // Repositories
  const deliverableRepo = new DeliverableRepository(ddb);
  const submissionRepo = new SubmissionRepository(ddb);
  const feedbackRepo = new FeedbackRepository(ddb);
  const lessonPlanRepo = new LessonPlanRepository(ddb);
  const attendanceRepo = new AttendanceRepository(ddb);
  const sessionRepo = new TeachingSessionRepository(ddb);
  const gradebookRepo = new GradeBookRepository(ddb);

  // Services
  container = {
    deliverableService: new DeliverableService(deliverableRepo, eb),
    submissionService: new SubmissionService(submissionRepo, deliverableRepo, eb),
    uploadService: new UploadService(s3),
    feedbackService: new FeedbackService(feedbackRepo, eb),
    scheduleService: new ScheduleService(lessonPlanRepo, attendanceRepo, sessionRepo, eb),
    gradebookService: new GradeBookService(gradebookRepo, deliverableRepo, submissionRepo, eb),
  };

  return container;
}

// Allow resetting container for tests
export function resetContainer(): void {
  container = null;
}
