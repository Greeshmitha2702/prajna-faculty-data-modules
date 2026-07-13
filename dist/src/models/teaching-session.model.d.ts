import { AttendanceStatus, AuditFields, DayOfWeek, SessionStatus } from './common.model';
export interface TopicCoverage {
    topicId: string;
    title: string;
    description: string;
    duration: number;
    learningOutcomes: string[];
    teachingMethods: string[];
    resources?: string[];
}
export interface LessonPlan extends AuditFields {
    planId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    date: string;
    weekNumber: number;
    sessionNumber: number;
    duration: number;
    objectives: string[];
    topics: TopicCoverage[];
    assessmentStrategy?: string;
    teachingAids?: string[];
    homework?: string;
    notes?: string;
}
export declare const LessonPlanKeys: {
    pk: (id: string) => string;
    sk: () => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (courseCode: string, date: string) => string;
};
export interface CreateLessonPlanDto {
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
    topics: TopicCoverage[];
    assessmentStrategy?: string;
    teachingAids?: string[];
    homework?: string;
    notes?: string;
}
export interface UpdateLessonPlanDto {
    date?: string;
    weekNumber?: number;
    sessionNumber?: number;
    duration?: number;
    objectives?: string[];
    topics?: TopicCoverage[];
    assessmentStrategy?: string;
    teachingAids?: string[];
    homework?: string;
    notes?: string;
}
export interface LessonPlanDdbRecord extends LessonPlan {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    entityType: 'LESSON_PLAN';
}
export interface AttendanceRecord extends AuditFields {
    sessionId: string;
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    courseCode: string;
    batchId: string;
    facultyId: string;
    campus: string;
    department: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
}
export interface AttendanceSession extends AuditFields {
    sessionId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendancePercentage: number;
}
export declare const AttendanceKeys: {
    sessionPk: (sessionId: string) => string;
    sessionSk: () => string;
    studentSk: (studentId: string) => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (courseCode: string, date: string) => string;
};
export interface CreateAttendanceDto {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    date: string;
    startTime: string;
    endTime: string;
    topic: string;
    records: Array<{
        studentId: string;
        studentName: string;
        enrollmentNo: string;
        status: AttendanceStatus;
        remarks?: string;
    }>;
}
export interface UpdateAttendanceDto {
    sessionId: string;
    records: Array<{
        studentId: string;
        status: AttendanceStatus;
        remarks?: string;
    }>;
}
export interface TeachingSession extends AuditFields {
    sessionId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    room: string;
    dayOfWeek: DayOfWeek;
    status: SessionStatus;
    topic?: string;
    notes?: string;
    cancelledReason?: string;
    rescheduledTo?: string;
}
export declare const SessionKeys: {
    pk: (sessionId: string) => string;
    sk: () => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (date: string) => string;
};
export interface CreateSessionDto {
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
    topic?: string;
    notes?: string;
}
export interface UpdateSessionDto {
    date?: string;
    startTime?: string;
    endTime?: string;
    room?: string;
    topic?: string;
    notes?: string;
    status?: SessionStatus;
    cancelledReason?: string;
    rescheduledTo?: string;
}
export interface SessionDdbRecord extends TeachingSession {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    entityType: 'SESSION';
}
export interface TeachingCourse {
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    credits: number;
    hoursPerWeek: number;
    enrolledStudents: number;
    room: string;
}
export interface TeachingLoad {
    facultyId: string;
    facultyName: string;
    designation: string;
    campus: string;
    department: string;
    academicYear: string;
    semester: string;
    courses: TeachingCourse[];
    totalCredits: number;
    totalHoursPerWeek: number;
    totalStudents: number;
}
export interface TimetableEntry {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    room: string;
    sessionType: 'LECTURE' | 'LAB' | 'TUTORIAL';
}
export interface Timetable {
    facultyId: string;
    semester: string;
    academicYear: string;
    entries: TimetableEntry[];
}
