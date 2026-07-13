"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DI Container Factory
// Builds all repositories, adapters, and services from environment variables.
// Called once per Lambda cold start and cached in module scope.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContainer = getContainer;
exports.resetContainer = resetContainer;
const ddb_adapter_1 = require("../../adapters/ddb.adapter");
const s3_adapter_1 = require("../../adapters/s3.adapter");
const eventbridge_adapter_1 = require("../../adapters/eventbridge.adapter");
const deliverable_repository_1 = require("../../repositories/deliverable.repository");
const submission_repository_1 = require("../../repositories/submission.repository");
const feedback_repository_1 = require("../../repositories/feedback.repository");
const teaching_session_repository_1 = require("../../repositories/teaching-session.repository");
const gradebook_repository_1 = require("../../repositories/gradebook.repository");
const deliverable_service_1 = require("../../services/deliverable.service");
const submission_service_1 = require("../../services/submission.service");
const upload_service_1 = require("../../services/upload.service");
const feedback_service_1 = require("../../services/feedback.service");
const schedule_service_1 = require("../../services/schedule.service");
const gradebook_service_1 = require("../../services/gradebook.service");
function requireEnv(name) {
    const val = process.env[name];
    if (!val)
        throw new Error(`Missing required environment variable: ${name}`);
    return val;
}
let container = null;
function getContainer() {
    if (container)
        return container;
    const tableName = requireEnv('DYNAMODB_TABLE_NAME');
    const bucketName = requireEnv('DOCUMENTS_BUCKET_NAME');
    const eventBusName = requireEnv('EVENT_BUS_NAME');
    // Adapters
    const ddb = new ddb_adapter_1.DdbAdapter(tableName);
    const s3 = new s3_adapter_1.S3Adapter(bucketName);
    const eb = new eventbridge_adapter_1.EventBridgeAdapter(eventBusName);
    // Repositories
    const deliverableRepo = new deliverable_repository_1.DeliverableRepository(ddb);
    const submissionRepo = new submission_repository_1.SubmissionRepository(ddb);
    const feedbackRepo = new feedback_repository_1.FeedbackRepository(ddb);
    const lessonPlanRepo = new teaching_session_repository_1.LessonPlanRepository(ddb);
    const attendanceRepo = new teaching_session_repository_1.AttendanceRepository(ddb);
    const sessionRepo = new teaching_session_repository_1.TeachingSessionRepository(ddb);
    const gradebookRepo = new gradebook_repository_1.GradeBookRepository(ddb);
    // Services
    container = {
        deliverableService: new deliverable_service_1.DeliverableService(deliverableRepo, eb),
        submissionService: new submission_service_1.SubmissionService(submissionRepo, deliverableRepo, eb),
        uploadService: new upload_service_1.UploadService(s3),
        feedbackService: new feedback_service_1.FeedbackService(feedbackRepo, eb),
        scheduleService: new schedule_service_1.ScheduleService(lessonPlanRepo, attendanceRepo, sessionRepo, eb),
        gradebookService: new gradebook_service_1.GradeBookService(gradebookRepo, deliverableRepo, submissionRepo, eb),
    };
    return container;
}
// Allow resetting container for tests
function resetContainer() {
    container = null;
}
//# sourceMappingURL=container.js.map