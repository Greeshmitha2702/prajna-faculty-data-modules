import { z } from 'zod';
import { SubmissionStatus } from '../models/common.model';
export declare const createSubmissionSchema: z.ZodObject<{
    deliverableId: z.ZodString;
    studentId: z.ZodString;
    studentName: z.ZodString;
    enrollmentNo: z.ZodString;
    courseCode: z.ZodString;
    batchId: z.ZodString;
    textContent: z.ZodOptional<z.ZodString>;
    comments: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deliverableId: string;
    courseCode: string;
    batchId: string;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    textContent?: string | undefined;
    comments?: string | undefined;
}, {
    deliverableId: string;
    courseCode: string;
    batchId: string;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    textContent?: string | undefined;
    comments?: string | undefined;
}>;
export declare const gradeBreakdownItemSchema: z.ZodObject<{
    criterionId: z.ZodString;
    criterionTitle: z.ZodString;
    marksObtained: z.ZodNumber;
    maxMarks: z.ZodNumber;
    remarks: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    marksObtained: number;
    remarks: string;
    maxMarks: number;
    criterionId: string;
    criterionTitle: string;
}, {
    marksObtained: number;
    maxMarks: number;
    criterionId: string;
    criterionTitle: string;
    remarks?: string | undefined;
}>;
export declare const gradeSubmissionSchema: z.ZodObject<{
    marksObtained: z.ZodNumber;
    gradeBreakdown: z.ZodOptional<z.ZodArray<z.ZodObject<{
        criterionId: z.ZodString;
        criterionTitle: z.ZodString;
        marksObtained: z.ZodNumber;
        maxMarks: z.ZodNumber;
        remarks: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        marksObtained: number;
        remarks: string;
        maxMarks: number;
        criterionId: string;
        criterionTitle: string;
    }, {
        marksObtained: number;
        maxMarks: number;
        criterionId: string;
        criterionTitle: string;
        remarks?: string | undefined;
    }>, "many">>;
    feedbackNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    marksObtained: number;
    gradeBreakdown?: {
        marksObtained: number;
        remarks: string;
        maxMarks: number;
        criterionId: string;
        criterionTitle: string;
    }[] | undefined;
    feedbackNote?: string | undefined;
}, {
    marksObtained: number;
    gradeBreakdown?: {
        marksObtained: number;
        maxMarks: number;
        criterionId: string;
        criterionTitle: string;
        remarks?: string | undefined;
    }[] | undefined;
    feedbackNote?: string | undefined;
}>;
export declare const listSubmissionsQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    deliverableId: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof SubmissionStatus>>;
    courseCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    deliverableId?: string | undefined;
    courseCode?: string | undefined;
    status?: SubmissionStatus | undefined;
    studentId?: string | undefined;
}, {
    lastKey?: string | undefined;
    deliverableId?: string | undefined;
    courseCode?: string | undefined;
    status?: SubmissionStatus | undefined;
    limit?: number | undefined;
    studentId?: string | undefined;
}>;
export declare const uploadRequestSchema: z.ZodObject<{
    fileName: z.ZodString;
    contentType: z.ZodString;
    sizeBytes: z.ZodNumber;
    deliverableId: z.ZodOptional<z.ZodString>;
    submissionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    contentType: string;
    sizeBytes: number;
    deliverableId?: string | undefined;
    submissionId?: string | undefined;
}, {
    fileName: string;
    contentType: string;
    sizeBytes: number;
    deliverableId?: string | undefined;
    submissionId?: string | undefined;
}>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
export type ListSubmissionsQuery = z.infer<typeof listSubmissionsQuerySchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
