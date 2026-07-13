import { z } from 'zod';
import { FeedbackStatus, FeedbackType } from '../models/common.model';
export declare const feedbackQuestionSchema: z.ZodObject<{
    questionId: z.ZodString;
    text: z.ZodString;
    category: z.ZodString;
    maxScore: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    questionId: string;
    text: string;
    category: string;
    maxScore: number;
}, {
    questionId: string;
    text: string;
    category: string;
    maxScore: number;
}>;
export declare const feedbackResponseItemSchema: z.ZodObject<{
    questionId: z.ZodString;
    score: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    questionId: string;
    score: number;
    comment?: string | undefined;
}, {
    questionId: string;
    score: number;
    comment?: string | undefined;
}>;
export declare const createFeedbackSchema: z.ZodEffects<z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
} & {
    type: z.ZodNativeEnum<typeof FeedbackType>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    questions: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        text: z.ZodString;
        category: z.ZodString;
        maxScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }, {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }>, "many">;
    collectionStartDate: z.ZodString;
    collectionEndDate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    title: string;
    type: FeedbackType;
    questions: {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }[];
    collectionStartDate: string;
    collectionEndDate: string;
    description?: string | undefined;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    title: string;
    type: FeedbackType;
    questions: {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }[];
    collectionStartDate: string;
    collectionEndDate: string;
    description?: string | undefined;
}>, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    title: string;
    type: FeedbackType;
    questions: {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }[];
    collectionStartDate: string;
    collectionEndDate: string;
    description?: string | undefined;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    title: string;
    type: FeedbackType;
    questions: {
        questionId: string;
        text: string;
        category: string;
        maxScore: number;
    }[];
    collectionStartDate: string;
    collectionEndDate: string;
    description?: string | undefined;
}>;
export declare const submitFeedbackResponseSchema: z.ZodObject<{
    feedbackId: z.ZodString;
    responses: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        score: z.ZodNumber;
        comment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        questionId: string;
        score: number;
        comment?: string | undefined;
    }, {
        questionId: string;
        score: number;
        comment?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    feedbackId: string;
    responses: {
        questionId: string;
        score: number;
        comment?: string | undefined;
    }[];
}, {
    feedbackId: string;
    responses: {
        questionId: string;
        score: number;
        comment?: string | undefined;
    }[];
}>;
export declare const listFeedbackQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    courseCode: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodNativeEnum<typeof FeedbackType>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof FeedbackStatus>>;
    semester: z.ZodOptional<z.ZodString>;
    academicYear: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    type?: FeedbackType | undefined;
    status?: FeedbackStatus | undefined;
}, {
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    type?: FeedbackType | undefined;
    status?: FeedbackStatus | undefined;
    limit?: number | undefined;
}>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type SubmitFeedbackResponseInput = z.infer<typeof submitFeedbackResponseSchema>;
export type ListFeedbackQuery = z.infer<typeof listFeedbackQuerySchema>;
