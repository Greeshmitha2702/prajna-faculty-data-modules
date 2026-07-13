import { z } from 'zod';
import { AttendanceStatus, DayOfWeek, SessionStatus } from '../models/common.model';
export declare const topicCoverageSchema: z.ZodObject<{
    topicId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    duration: z.ZodNumber;
    learningOutcomes: z.ZodArray<z.ZodString, "many">;
    teachingMethods: z.ZodArray<z.ZodString, "many">;
    resources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    duration: number;
    topicId: string;
    learningOutcomes: string[];
    teachingMethods: string[];
    resources?: string[] | undefined;
}, {
    title: string;
    description: string;
    duration: number;
    topicId: string;
    learningOutcomes: string[];
    teachingMethods: string[];
    resources?: string[] | undefined;
}>;
export declare const createLessonPlanSchema: z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
} & {
    date: z.ZodString;
    weekNumber: z.ZodNumber;
    sessionNumber: z.ZodNumber;
    duration: z.ZodNumber;
    objectives: z.ZodArray<z.ZodString, "many">;
    topics: z.ZodArray<z.ZodObject<{
        topicId: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        duration: z.ZodNumber;
        learningOutcomes: z.ZodArray<z.ZodString, "many">;
        teachingMethods: z.ZodArray<z.ZodString, "many">;
        resources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }, {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }>, "many">;
    assessmentStrategy: z.ZodString;
    teachingAids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    homework: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    weekNumber: number;
    sessionNumber: number;
    duration: number;
    objectives: string[];
    topics: {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }[];
    assessmentStrategy: string;
    teachingAids?: string[] | undefined;
    homework?: string | undefined;
    notes?: string | undefined;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    weekNumber: number;
    sessionNumber: number;
    duration: number;
    objectives: string[];
    topics: {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }[];
    assessmentStrategy: string;
    teachingAids?: string[] | undefined;
    homework?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateLessonPlanSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
    weekNumber: z.ZodOptional<z.ZodNumber>;
    sessionNumber: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    objectives: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    topics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        topicId: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        duration: z.ZodNumber;
        learningOutcomes: z.ZodArray<z.ZodString, "many">;
        teachingMethods: z.ZodArray<z.ZodString, "many">;
        resources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }, {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }>, "many">>;
    assessmentStrategy: z.ZodOptional<z.ZodString>;
    teachingAids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    homework: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    weekNumber?: number | undefined;
    sessionNumber?: number | undefined;
    duration?: number | undefined;
    objectives?: string[] | undefined;
    topics?: {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }[] | undefined;
    assessmentStrategy?: string | undefined;
    teachingAids?: string[] | undefined;
    homework?: string | undefined;
    notes?: string | undefined;
}, {
    date?: string | undefined;
    weekNumber?: number | undefined;
    sessionNumber?: number | undefined;
    duration?: number | undefined;
    objectives?: string[] | undefined;
    topics?: {
        title: string;
        description: string;
        duration: number;
        topicId: string;
        learningOutcomes: string[];
        teachingMethods: string[];
        resources?: string[] | undefined;
    }[] | undefined;
    assessmentStrategy?: string | undefined;
    teachingAids?: string[] | undefined;
    homework?: string | undefined;
    notes?: string | undefined;
}>;
export declare const listLessonPlansQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    courseCode: z.ZodOptional<z.ZodString>;
    semester: z.ZodOptional<z.ZodString>;
    academicYear: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    semester?: string | undefined;
    academicYear?: string | undefined;
    limit?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const attendanceRecordItemSchema: z.ZodObject<{
    studentId: z.ZodString;
    studentName: z.ZodString;
    enrollmentNo: z.ZodString;
    status: z.ZodNativeEnum<typeof AttendanceStatus>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: AttendanceStatus;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    remarks?: string | undefined;
}, {
    status: AttendanceStatus;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    remarks?: string | undefined;
}>;
export declare const createAttendanceSchema: z.ZodEffects<z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
} & {
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    topic: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        studentName: z.ZodString;
        enrollmentNo: z.ZodString;
        status: z.ZodNativeEnum<typeof AttendanceStatus>;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }, {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }[];
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }[];
}>, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }[];
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        remarks?: string | undefined;
    }[];
}>;
export declare const updateAttendanceSchema: z.ZodObject<{
    sessionId: z.ZodString;
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        status: z.ZodNativeEnum<typeof AttendanceStatus>;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: AttendanceStatus;
        studentId: string;
        remarks?: string | undefined;
    }, {
        status: AttendanceStatus;
        studentId: string;
        remarks?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        remarks?: string | undefined;
    }[];
}, {
    sessionId: string;
    records: {
        status: AttendanceStatus;
        studentId: string;
        remarks?: string | undefined;
    }[];
}>;
export declare const listAttendanceQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    courseCode: z.ZodOptional<z.ZodString>;
    batchId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    batchId?: string | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    batchId?: string | undefined;
    limit?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export declare const createSessionSchema: z.ZodEffects<z.ZodObject<{
    courseCode: z.ZodString;
    courseTitle: z.ZodString;
    batchId: z.ZodString;
    semester: z.ZodString;
    academicYear: z.ZodString;
} & {
    date: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    room: z.ZodString;
    dayOfWeek: z.ZodNativeEnum<typeof DayOfWeek>;
    topic: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: DayOfWeek;
    notes?: string | undefined;
    topic?: string | undefined;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: DayOfWeek;
    notes?: string | undefined;
    topic?: string | undefined;
}>, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: DayOfWeek;
    notes?: string | undefined;
    topic?: string | undefined;
}, {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    room: string;
    dayOfWeek: DayOfWeek;
    notes?: string | undefined;
    topic?: string | undefined;
}>;
export declare const updateSessionSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    room: z.ZodOptional<z.ZodString>;
    topic: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof SessionStatus>>;
    cancelledReason: z.ZodOptional<z.ZodString>;
    rescheduledTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: SessionStatus | undefined;
    date?: string | undefined;
    notes?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    topic?: string | undefined;
    room?: string | undefined;
    cancelledReason?: string | undefined;
    rescheduledTo?: string | undefined;
}, {
    status?: SessionStatus | undefined;
    date?: string | undefined;
    notes?: string | undefined;
    startTime?: string | undefined;
    endTime?: string | undefined;
    topic?: string | undefined;
    room?: string | undefined;
    cancelledReason?: string | undefined;
    rescheduledTo?: string | undefined;
}>;
export declare const listSessionsQuerySchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    lastKey: z.ZodOptional<z.ZodString>;
} & {
    courseCode: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof SessionStatus>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    status?: SessionStatus | undefined;
    from?: string | undefined;
    to?: string | undefined;
}, {
    lastKey?: string | undefined;
    courseCode?: string | undefined;
    status?: SessionStatus | undefined;
    limit?: number | undefined;
    from?: string | undefined;
    to?: string | undefined;
}>;
export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
export type UpdateLessonPlanInput = z.infer<typeof updateLessonPlanSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
