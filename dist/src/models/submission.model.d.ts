import { AttachmentRef } from './deliverable.model';
import { AuditFields, SubmissionStatus } from './common.model';
export interface GradeBreakdown {
    criterionId: string;
    criterionTitle: string;
    marksObtained: number;
    maxMarks: number;
    remarks?: string;
}
export interface Submission extends AuditFields {
    submissionId: string;
    deliverableId: string;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    courseCode: string;
    batchId: string;
    facultyId: string;
    status: SubmissionStatus;
    submittedAt: string;
    isLate: boolean;
    lateDays: number;
    attachments: AttachmentRef[];
    textContent?: string;
    comments?: string;
    marksObtained?: number;
    totalMarks: number;
    gradedAt?: string;
    gradedBy?: string;
    gradeBreakdown?: GradeBreakdown[];
    feedbackNote?: string;
    latePenaltyApplied?: number;
    finalMarks?: number;
}
export declare const SubmissionKeys: {
    pk: (id: string) => string;
    sk: () => string;
    gsi1pk: (deliverableId: string) => string;
    gsi1sk: (studentId: string) => string;
    gsi2pk: (studentId: string) => string;
    gsi2sk: (submittedAt: string) => string;
};
export interface CreateSubmissionDto {
    deliverableId: string;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    courseCode: string;
    batchId: string;
    textContent?: string;
    comments?: string;
}
export interface GradeSubmissionDto {
    marksObtained: number;
    gradeBreakdown?: GradeBreakdown[];
    feedbackNote?: string;
}
export interface SubmissionDdbRecord extends Submission {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    GSI2PK: string;
    GSI2SK: string;
    entityType: 'SUBMISSION';
}
export declare function toSubmissionDdbRecord(submission: Submission): SubmissionDdbRecord;
export declare function fromSubmissionDdbRecord(record: SubmissionDdbRecord): Submission;
