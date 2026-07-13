"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: GradeBookSummary
// Single-table design:
//   PK = GRADEBOOK#{facultyId}#{courseCode}#{batchId}#{academicYear}#{semester}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}
//   GSI1SK = GRADEBOOK#{academicYear}#{semester}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeBookKeys = void 0;
exports.calculateGrade = calculateGrade;
exports.toGradeBookDdbRecord = toGradeBookDdbRecord;
exports.fromGradeBookDdbRecord = fromGradeBookDdbRecord;
// ── DynamoDB Keys ─────────────────────────────────────────────────────────────
exports.GradeBookKeys = {
    pk: (facultyId, courseCode, batchId, academicYear, semester) => `GRADEBOOK#${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`,
    sk: () => 'METADATA',
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (academicYear, semester) => `GRADEBOOK#${academicYear}#${semester}`,
    id: (facultyId, courseCode, batchId, academicYear, semester) => `${facultyId}#${courseCode}#${batchId}#${academicYear}#${semester}`,
};
// ── Grade Calculation ─────────────────────────────────────────────────────────
function calculateGrade(percentage) {
    if (percentage >= 90)
        return { grade: 'O', gradePoint: 10 };
    if (percentage >= 80)
        return { grade: 'A+', gradePoint: 9 };
    if (percentage >= 70)
        return { grade: 'A', gradePoint: 8 };
    if (percentage >= 60)
        return { grade: 'B+', gradePoint: 7 };
    if (percentage >= 50)
        return { grade: 'B', gradePoint: 6 };
    if (percentage >= 45)
        return { grade: 'C', gradePoint: 5 };
    if (percentage >= 40)
        return { grade: 'D', gradePoint: 4 };
    return { grade: 'F', gradePoint: 0 };
}
// ── Serialization ─────────────────────────────────────────────────────────────
function toGradeBookDdbRecord(gradebook) {
    return {
        ...gradebook,
        PK: exports.GradeBookKeys.pk(gradebook.facultyId, gradebook.courseCode, gradebook.batchId, gradebook.academicYear, gradebook.semester),
        SK: exports.GradeBookKeys.sk(),
        GSI1PK: exports.GradeBookKeys.gsi1pk(gradebook.facultyId),
        GSI1SK: exports.GradeBookKeys.gsi1sk(gradebook.academicYear, gradebook.semester),
        entityType: 'GRADEBOOK',
    };
}
function fromGradeBookDdbRecord(record) {
    const { PK: _PK, SK: _SK, GSI1PK: _G1PK, GSI1SK: _G1SK, entityType: _et, ...gradebook } = record;
    return gradebook;
}
//# sourceMappingURL=gradebook.model.js.map