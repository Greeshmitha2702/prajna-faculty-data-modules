import { z } from 'zod';
import { DeliverableStatus, DeliverableType } from '../models/common.model';
export declare const rubricCriterionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    maxMarks: z.ZodNumber;
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    id: string;
    maxMarks: number;
    weight: number;
}, {
    title: string;
    description: string;
    id: string;
    maxMarks: number;
    weight: number;
}>;
export declare const createDeliverableSchema: z.ZodEffects<z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
} & {
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodNativeEnum<typeof DeliverableType>;
    totalMarks: z.ZodNumber;
    passingMarks: z.ZodNumber;
    weightagePercent: z.ZodNumber;
    dueDate: z.ZodString;
    allowLateSubmission: z.ZodBoolean;
    latePenaltyPercentPerDay: z.ZodNumber;
    rubric: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        maxMarks: z.ZodNumber;
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }, {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
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
    rubric: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[];
}, {
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
    rubric?: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[] | undefined;
}>, {
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
    rubric: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[];
}, {
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
    rubric?: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[] | undefined;
}>;
export declare const updateDeliverableSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    totalMarks: z.ZodOptional<z.ZodNumber>;
    passingMarks: z.ZodOptional<z.ZodNumber>;
    weightagePercent: z.ZodOptional<z.ZodNumber>;
    dueDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof DeliverableStatus>>;
    allowLateSubmission: z.ZodOptional<z.ZodBoolean>;
    latePenaltyPercentPerDay: z.ZodOptional<z.ZodNumber>;
    rubric: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        maxMarks: z.ZodNumber;
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }, {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    status?: DeliverableStatus | undefined;
    totalMarks?: number | undefined;
    passingMarks?: number | undefined;
    weightagePercent?: number | undefined;
    dueDate?: string | undefined;
    allowLateSubmission?: boolean | undefined;
    latePenaltyPercentPerDay?: number | undefined;
    rubric?: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[] | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    status?: DeliverableStatus | undefined;
    totalMarks?: number | undefined;
    passingMarks?: number | undefined;
    weightagePercent?: number | undefined;
    dueDate?: string | undefined;
    allowLateSubmission?: boolean | undefined;
    latePenaltyPercentPerDay?: number | undefined;
    rubric?: {
        title: string;
        description: string;
        id: string;
        maxMarks: number;
        weight: number;
    }[] | undefined;
}>;
export declare const listDeliverablesQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    courseCode: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof DeliverableStatus>>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof DeliverableType>>;
    semester: z.ZodOptional<z.ZodString>;
    academicYear: z.ZodOptional<z.ZodString>;
    batchId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    batchId?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    type?: DeliverableType | undefined;
    status?: DeliverableStatus | undefined;
}, {
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    batchId?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    type?: DeliverableType | undefined;
    status?: DeliverableStatus | undefined;
    limit?: number | undefined;
}>;
export type CreateDeliverableInput = z.infer<typeof createDeliverableSchema>;
export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>;
export type ListDeliverablesQuery = z.infer<typeof listDeliverablesQuerySchema>;
