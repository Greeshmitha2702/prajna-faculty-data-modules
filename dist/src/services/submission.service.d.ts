import { SubmissionRepository, ListSubmissionsOptions } from '../repositories/submission.repository';
import { DeliverableRepository } from '../repositories/deliverable.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Submission } from '../models/submission.model';
import { CreateSubmissionDto, GradeSubmissionDto } from '../models/submission.model';
import { AuthorizerContext, PaginatedResult } from '../models/common.model';
export declare class SubmissionService {
    private readonly submissionRepo;
    private readonly deliverableRepo;
    private readonly eb;
    constructor(submissionRepo: SubmissionRepository, deliverableRepo: DeliverableRepository, eb: EventBridgeAdapter);
    create(dto: CreateSubmissionDto, ctx: AuthorizerContext): Promise<Submission>;
    grade(submissionId: string, dto: GradeSubmissionDto, ctx: AuthorizerContext): Promise<Submission>;
    getById(submissionId: string, ctx: AuthorizerContext): Promise<Submission>;
    listByDeliverable(deliverableId: string, ctx: AuthorizerContext, options?: ListSubmissionsOptions): Promise<PaginatedResult<Submission>>;
    listByStudent(studentId: string, _ctx: AuthorizerContext, options?: ListSubmissionsOptions): Promise<PaginatedResult<Submission>>;
}
