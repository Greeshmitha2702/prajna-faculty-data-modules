import { AuditFields } from './common.model';
export interface StudentGradeEntry {
    studentId: string;
    studentName: string;
    enrollmentNo: string;
    totalMarksObtained: number;
    totalMarks: number;
    percentageScore: number;
    grade: string;
    gradePoint: number;
    submittedDeliverables: number;
    totalDeliverables: number;
    attendancePercentage: number;
    remarks?: string;
}
export interface DeliverableGradeSummary {
    deliverableId: string;
    deliverableTitle: string;
    type: string;
    totalMarks: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    submissionCount: number;
    totalStudents: number;
}
export interface GradeBookSummary extends AuditFields {
    gradebookId: string;
    facultyId: string;
    courseCode: string;
    courseTitle: string;
    batchId: string;
    semester: string;
    academicYear: string;
    campus: string;
    department: string;
    totalStudents: number;
    totalDeliverables: number;
    classAverageScore: number;
    classHighestScore: number;
    classLowestScore: number;
    passCount: number;
    failCount: number;
    passPercentage: number;
    gradeDistribution: Record<string, number>;
    deliverableSummaries: DeliverableGradeSummary[];
    studentEntries: StudentGradeEntry[];
    lastSyncedAt: string;
}
export declare const GradeBookKeys: {
    pk: (facultyId: string, courseCode: string, batchId: string, academicYear: string, semester: string) => string;
    sk: () => string;
    gsi1pk: (facultyId: string) => string;
    gsi1sk: (academicYear: string, semester: string) => string;
    id: (facultyId: string, courseCode: string, batchId: string, academicYear: string, semester: string) => string;
};
export interface GetGradeBookDto {
    courseCode: string;
    batchId: string;
    semester: string;
    academicYear: string;
}
export interface GradeBookDdbRecord extends GradeBookSummary {
    PK: string;
    SK: string;
    GSI1PK: string;
    GSI1SK: string;
    entityType: 'GRADEBOOK';
}
export declare function calculateGrade(percentage: number): {
    grade: string;
    gradePoint: number;
};
export declare function toGradeBookDdbRecord(gradebook: GradeBookSummary): GradeBookDdbRecord;
export declare function fromGradeBookDdbRecord(record: GradeBookDdbRecord): GradeBookSummary;
