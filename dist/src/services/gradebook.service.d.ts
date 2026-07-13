import { GradeBookRepository } from '../repositories/gradebook.repository';
import { DeliverableRepository } from '../repositories/deliverable.repository';
import { SubmissionRepository } from '../repositories/submission.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { GradeBookSummary } from '../models/gradebook.model';
import { AuthorizerContext, PaginatedResult, PaginationOptions } from '../models/common.model';
export declare class GradeBookService {
    private readonly gradebookRepo;
    private readonly deliverableRepo;
    private readonly submissionRepo;
    private readonly eb;
    constructor(gradebookRepo: GradeBookRepository, deliverableRepo: DeliverableRepository, submissionRepo: SubmissionRepository, eb: EventBridgeAdapter);
    getOrSync(courseCode: string, batchId: string, semester: string, academicYear: string, ctx: AuthorizerContext): Promise<GradeBookSummary>;
    listByFaculty(ctx: AuthorizerContext, options?: PaginationOptions & {
        academicYear?: string;
        semester?: string;
    }): Promise<PaginatedResult<GradeBookSummary>>;
    getByFacultyId(facultyId: string, courseCode: string, batchId: string, semester: string, academicYear: string, ctx: AuthorizerContext): Promise<GradeBookSummary>;
}
