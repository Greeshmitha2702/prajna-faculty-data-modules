import { AuditFields, FeedbackStatus, FeedbackType } from './common.model';
export interface FeedbackQuestion {
    questionId: string;
    text: string;
    category: string;
    maxScore: number;
}
export interface FeedbackResponse {
    questionId: string;
    score: number;
    comment?: string;
}
export interface FeedbackSummary {
    questionId: string;
    averageScore: number;
    responseCount: number;
    category: string;
}
export interface Feedback extends AuditFields {
    feedbackId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    type: FeedbackType;
    status: FeedbackStatus;
    title: string;
    description?: string;
    questions: FeedbackQuestion[];
    totalResponseCount: number;
    averageScore: number;
    summary?: FeedbackSummary[];
    collectionStartDate: string;
    collectionEndDate: string;
    releasedAt?: string;
    releasedBy?: string;
}
export declare const FeedbackKeys: {
    pk: (id: string) => string;
    sk: () => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (academicYear: string, semester: string) => string;
    gsi2pk: (courseCode: string) => string;
    gsi2sk: (type: FeedbackType, status: FeedbackStatus) => string;
};
export interface CreateFeedbackDto {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    type: FeedbackType;
    title: string;
    description?: string;
    questions: FeedbackQuestion[];
    collectionStartDate: string;
    collectionEndDate: string;
}
export interface FeedbackResponseDto {
    feedbackId: string;
    responses: FeedbackResponse[];
}
export interface FeedbackDdbRecord extends Feedback {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    GSI2PK: string;
    GSI2SK: string;
    entityType: 'FEEDBACK';
}
export declare function toFeedbackDdbRecord(feedback: Feedback): FeedbackDdbRecord;
export declare function fromFeedbackDdbRecord(record: FeedbackDdbRecord): Feedback;
