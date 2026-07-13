import { AuditFields, DeliverableStatus, DeliverableType } from './common.model';
export interface AttachmentRef {
    fileName: string;
    s3Key: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt: string;
}
export interface RubricCriterion {
    id: string;
    title: string;
    description: string;
    maxMarks: number;
    weight: number;
}
export interface Deliverable extends AuditFields {
    deliverableId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    title: string;
    description: string;
    type: DeliverableType;
    status: DeliverableStatus;
    totalMarks: number;
    passingMarks: number;
    weightagePercent: number;
    publishedAt?: string;
    dueDate: string;
    closedAt?: string;
    allowLateSubmission: boolean;
    latePenaltyPercentPerDay: number;
    attachments: AttachmentRef[];
    rubric: RubricCriterion[];
    submissionCount: number;
    gradedCount: number;
}
export declare const DeliverableKeys: {
    pk: (id: string) => string;
    sk: () => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (courseCode: string, dueDate: string) => string;
    gsi2pk: (courseCode: string) => string;
    gsi2sk: (status: DeliverableStatus) => string;
};
export interface CreateDeliverableDto {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    title: string;
    description: string;
    type: DeliverableType;
    totalMarks: number;
    passingMarks: number;
    weightagePercent: number;
    dueDate: string;
    allowLateSubmission: boolean;
    latePenaltyPercentPerDay: number;
    rubric?: RubricCriterion[];
}
export interface UpdateDeliverableDto {
    title?: string;
    description?: string;
    totalMarks?: number;
    passingMarks?: number;
    weightagePercent?: number;
    dueDate?: string;
    status?: DeliverableStatus;
    allowLateSubmission?: boolean;
    latePenaltyPercentPerDay?: number;
    rubric?: RubricCriterion[];
}
export interface DeliverableDdbRecord extends Deliverable {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    GSI2PK: string;
    GSI2SK: string;
    entityType: 'DELIVERABLE';
}
export declare function toDeliverableDdbRecord(deliverable: Deliverable): DeliverableDdbRecord;
export declare function fromDeliverableDdbRecord(record: DeliverableDdbRecord): Deliverable;
