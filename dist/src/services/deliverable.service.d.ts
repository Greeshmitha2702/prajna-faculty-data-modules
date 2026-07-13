import { DeliverableRepository, DeliverableFilterOptions } from '../repositories/deliverable.repository';
import { EventBridgeAdapter } from '../adapters/eventbridge.adapter';
import { Deliverable } from '../models/deliverable.model';
import { CreateDeliverableDto, UpdateDeliverableDto } from '../models/deliverable.model';
import { AuthorizerContext, PaginatedResult } from '../models/common.model';
export declare class DeliverableService {
    private readonly repo;
    private readonly eb;
    constructor(repo: DeliverableRepository, eb: EventBridgeAdapter);
    create(dto: CreateDeliverableDto, ctx: AuthorizerContext): Promise<Deliverable>;
    publish(deliverableId: string, ctx: AuthorizerContext): Promise<Deliverable>;
    getById(deliverableId: string, ctx: AuthorizerContext): Promise<Deliverable>;
    update(deliverableId: string, dto: UpdateDeliverableDto, ctx: AuthorizerContext): Promise<Deliverable>;
    delete(deliverableId: string, ctx: AuthorizerContext): Promise<void>;
    list(ctx: AuthorizerContext, options?: DeliverableFilterOptions): Promise<PaginatedResult<Deliverable>>;
    listByFacultyId(facultyId: string, ctx: AuthorizerContext, options?: DeliverableFilterOptions): Promise<PaginatedResult<Deliverable>>;
}
