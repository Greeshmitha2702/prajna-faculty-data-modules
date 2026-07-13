import { DdbAdapter } from '../adapters/ddb.adapter';
import { GradeBookSummary } from '../models/gradebook.model';
import { Submission } from '../models/submission.model';
import { Deliverable } from '../models/deliverable.model';
import { PaginatedResult, PaginationOptions } from '../models/common.model';
export declare class GradeBookRepository {
    private readonly ddb;
    constructor(ddb: DdbAdapter);
    upsert(facultyId: string, courseCode: string, courseTitle: string, batchId: string, semester: string, academicYear: string, campus: string, department: string, deliverables: Deliverable[], submissions: Submission[], updatedBy: string): Promise<GradeBookSummary>;
    getById(gradebookId: string): Promise<GradeBookSummary | null>;
    listByFaculty(facultyId: string, options?: PaginationOptions & {
        academicYear?: string;
        semester?: string;
    }): Promise<PaginatedResult<GradeBookSummary>>;
}
