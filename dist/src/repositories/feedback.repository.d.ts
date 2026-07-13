import { DdbAdapter } from '../adapters/ddb.adapter';
import { Feedback, CreateFeedbackDto } from '../models/feedback.model';
import { FeedbackStatus, FeedbackType, PaginatedResult, PaginationOptions } from '../models/common.model';
export interface ListFeedbackOptions extends PaginationOptions {
    type?: FeedbackType;
    status?: FeedbackStatus;
    semester?: string;
    academicYear?: string;
    courseCode?: string;
}
export declare class FeedbackRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    create(dto: CreateFeedbackDto, facultyId: string, campus: string, department: string, createdBy: string): Promise<Feedback>;
    getById(feedbackId: string): Promise<Feedback | null>;
    release(feedbackId: string, summary: Feedback['summary'], averageScore: number, totalResponseCount: number, releasedBy: string): Promise<Feedback | null>;
    listByFaculty(facultyId: string, options?: ListFeedbackOptions): Promise<PaginatedResult<Feedback>>;
}
