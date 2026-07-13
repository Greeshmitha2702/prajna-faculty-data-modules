import { z } from 'zod';
import { UserRole } from '../models/common.model';
export declare const uuidSchema: z.ZodString;
export declare const isoDateSchema: z.ZodString;
export declare const isoDateTimeSchema: z.ZodString;
export declare const timeSchema: z.ZodString;
export declare const nonEmptyString: z.ZodString;
export declare const positiveInt: z.ZodNumber;
export declare const nonNegativeNumber: z.ZodNumber;
export declare const percentageSchema: z.ZodNumber;
export declare const paginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
}, {
    lastKey?: string | undefined;
    limit?: number | undefined;
}>;
export declare const allowedRolesSchema: z.ZodEnum<[UserRole.FACULTY, UserRole.HOD, UserRole.DIRECTOR, UserRole.PVC, UserRole.IQAC, UserRole.ADMIN]>;
export declare const attachmentRefSchema: z.ZodObject<{
    fileName: z.ZodString;
    s3Key: z.ZodString;
    contentType: z.ZodString;
    sizeBytes: z.ZodNumber;
    uploadedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    s3Key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt: string;
}, {
    s3Key: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt: string;
}>;
export declare const academicContextSchema: z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
}, "strip", z.ZodTypeAny, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
}>;
export declare const courseFilterSchema: z.ZodObject<{
    courseCode: z.ZodOptional<z.ZodString>;
    semester: z.ZodOptional<z.ZodString>;
    academicYear: z.ZodOptional<z.ZodString>;
    batchId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    courseCode?: string | undefined;
    batchId?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
}, {
    courseCode?: string | undefined;
    batchId?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
}>;
export declare function parseAndValidate<T>(schema: z.ZodType<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: string[];
};
