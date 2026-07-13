"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Feedback
// Single-table design:
//   PK = FEEDBACK#{feedbackId}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}   GSI1SK = FEEDBACK#{academicYear}#{semester}
//   GSI2PK = COURSE#{courseCode}   GSI2SK = FEEDBACK#{type}#{status}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackKeys = void 0;
exports.toFeedbackDdbRecord = toFeedbackDdbRecord;
exports.fromFeedbackDdbRecord = fromFeedbackDdbRecord;
// ── DynamoDB Keys ─────────────────────────────────────────────────────────────
exports.FeedbackKeys = {
    pk: (id) => `FEEDBACK#${id}`,
    sk: () => 'METADATA',
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (academicYear, semester) => `FEEDBACK#${academicYear}#${semester}`,
    gsi2pk: (courseCode) => `COURSE#${courseCode}`,
    gsi2sk: (type, status) => `FEEDBACK#${type}#${status}`,
};
// ── Serialization ─────────────────────────────────────────────────────────────
function toFeedbackDdbRecord(feedback) {
    return {
        ...feedback,
        PK: exports.FeedbackKeys.pk(feedback.feedbackId),
        SK: exports.FeedbackKeys.sk(),
        GSI1PK: exports.FeedbackKeys.gsi1pk(feedback.facultyId),
        GSI1SK: exports.FeedbackKeys.gsi1sk(feedback.academicYear, feedback.semester),
        GSI2PK: exports.FeedbackKeys.gsi2pk(feedback.courseCode),
        GSI2SK: exports.FeedbackKeys.gsi2sk(feedback.type, feedback.status),
        entityType: 'FEEDBACK',
    };
}
function fromFeedbackDdbRecord(record) {
    const { PK: _PK, SK: _SK, GSI1PK: _G1PK, GSI1SK: _G1SK, GSI2PK: _G2PK, GSI2SK: _G2SK, entityType: _et, ...feedback } = record;
    return feedback;
}
//# sourceMappingURL=feedback.model.js.map