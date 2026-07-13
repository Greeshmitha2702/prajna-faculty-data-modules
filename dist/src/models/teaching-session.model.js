"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: TeachingSession
// Covers: Timetable, Lesson Plans, Attendance, Teaching Load
// Single-table design:
//   LESSON_PLAN:
//     PK = LESSON_PLAN#{planId}    SK = METADATA
//     GSI1PK = FACULTY#{facultyId} GSI1SK = LESSON_PLAN#{courseCode}#{date}
//
//   ATTENDANCE:
//     PK = ATTENDANCE#{sessionId}  SK = STUDENT#{studentId}
//     GSI1PK = FACULTY#{facultyId} GSI1SK = ATTENDANCE#{courseCode}#{date}
//
//   SESSION:
//     PK = SESSION#{sessionId}     SK = METADATA
//     GSI1PK = FACULTY#{facultyId} GSI1SK = SESSION#{date}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionKeys = exports.AttendanceKeys = exports.LessonPlanKeys = void 0;
exports.LessonPlanKeys = {
    pk: (id) => `LESSON_PLAN#${id}`,
    sk: () => 'METADATA',
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (courseCode, date) => `LESSON_PLAN#${courseCode}#${date}`,
};
exports.AttendanceKeys = {
    sessionPk: (sessionId) => `ATTENDANCE#${sessionId}`,
    sessionSk: () => 'SESSION_META',
    studentSk: (studentId) => `STUDENT#${studentId}`,
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (courseCode, date) => `ATTENDANCE#${courseCode}#${date}`,
};
exports.SessionKeys = {
    pk: (sessionId) => `SESSION#${sessionId}`,
    sk: () => 'METADATA',
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (date) => `SESSION#${date}`,
};
//# sourceMappingURL=teaching-session.model.js.map