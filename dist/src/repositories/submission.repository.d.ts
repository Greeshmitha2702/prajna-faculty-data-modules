import { DdbAdapter } from '../adapters/ddb.adapter';
import { Submission, CreateSubmissionDto, GradeSubmissionDto } from '../models/submission.model';
import { PaginatedResult, PaginationOptions, SubmissionStatus } from '../models/common.model';
export interface ListSubmissionsOptions extends PaginationOptions {
    status?: SubmissionStatus;
}
export declare class SubmissionRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    create(dto: CreateSubmissionDto, facultyId: string, totalMarks: number, dueDate: string, createdBy: string): Promise<Submission>;
    getById(submissionId: string): Promise<Submission | null>;
    grade(submissionId: string, dto: GradeSubmissionDto, gradedBy: string, latePenaltyPercentPerDay: number): Promise<Submission | null>;
    listByDeliverable(deliverableId: string, options?: ListSubmissionsOptions): Promise<PaginatedResult<Submission>>;
    listByStudent(studentId: string, options?: PaginationOptions): Promise<PaginatedResult<Submission>>;
}
