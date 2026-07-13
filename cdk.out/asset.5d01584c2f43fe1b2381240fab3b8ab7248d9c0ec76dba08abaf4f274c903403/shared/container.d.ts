import { DeliverableService } from '../../services/deliverable.service';
import { SubmissionService } from '../../services/submission.service';
import { UploadService } from '../../services/upload.service';
import { FeedbackService } from '../../services/feedback.service';
import { ScheduleService } from '../../services/schedule.service';
import { GradeBookService } from '../../services/gradebook.service';
export interface Container {
    deliverableService: DeliverableService;
    submissionService: SubmissionService;
    uploadService: UploadService;
    feedbackService: FeedbackService;
    scheduleService: ScheduleService;
    gradebookService: GradeBookService;
}
export declare function getContainer(): Container;
export declare function resetContainer(): void;
