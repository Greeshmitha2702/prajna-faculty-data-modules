import { DdbAdapter } from '../adapters/ddb.adapter';
import { Deliverable, CreateDeliverableDto, UpdateDeliverableDto } from '../models/deliverable.model';
import { DeliverableStatus, PaginatedResult, PaginationOptions } from '../models/common.model';
export interface DeliverableFilterOptions extends PaginationOptions {
    courseCode?: string;
    status?: DeliverableStatus;
    semester?: string;
    academicYear?: string;
    batchId?: string;
}
export declare class DeliverableRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    create(dto: CreateDeliverableDto, facultyId: string, campus: string, department: string, createdBy: string): Promise<Deliverable>;
    getById(deliverableId: string): Promise<Deliverable | null>;
    update(deliverableId: string, dto: UpdateDeliverableDto, updatedBy: string): Promise<Deliverable | null>;
    delete(deliverableId: string): Promise<void>;
    listByFaculty(facultyId: string, options?: DeliverableFilterOptions): Promise<PaginatedResult<Deliverable>>;
    listByCourse(courseCode: string, status?: DeliverableStatus, options?: PaginationOptions): Promise<PaginatedResult<Deliverable>>;
    incrementSubmissionCount(deliverableId: string): Promise<void>;
}
