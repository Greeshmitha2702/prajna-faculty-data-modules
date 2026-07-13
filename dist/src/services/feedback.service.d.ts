import { FeedbackRepository, ListFeedbackOptions } from '../repositories/feedback.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Feedback } from '../models/feedback.model';
import { CreateFeedbackDto, FeedbackResponseDto } from '../models/feedback.model';
import { AuthorizerContext, PaginatedResult } from '../models/common.model';
export declare class FeedbackService {
    private readonly repo;
    private readonly eb;
    constructor(repo: FeedbackRepository, eb: EventBridgeAdapter);
    create(dto: CreateFeedbackDto, ctx: AuthorizerContext): Promise<Feedback>;
    getById(feedbackId: string, ctx: AuthorizerContext): Promise<Feedback>;
    submitResponse(dto: FeedbackResponseDto, _ctx: AuthorizerContext): Promise<{
        message: string;
    }>;
    release(feedbackId: string, ctx: AuthorizerContext): Promise<Feedback>;
    list(ctx: AuthorizerContext, options?: ListFeedbackOptions): Promise<PaginatedResult<Feedback>>;
}
