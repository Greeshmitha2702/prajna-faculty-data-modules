"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Submission
// Single-table design:
//   PK = SUBMISSION#{submissionId}
//   SK = METADATA
//   GSI1PK = DELIVERABLE#{deliverableId}   GSI1SK = SUBMISSION#{studentId}
//   GSI2PK = STUDENT#{studentId}            GSI2SK = SUBMISSION#{submittedAt}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionKeys = void 0;
exports.toSubmissionDdbRecord = toSubmissionDdbRecord;
exports.fromSubmissionDdbRecord = fromSubmissionDdbRecord;
// ── DynamoDB Keys ─────────────────────────────────────────────────────────────
exports.SubmissionKeys = {
    pk: (id) => `SUBMISSION#${id}`,
    sk: () => 'METADATA',
    gsi1pk: (deliverableId) => `DELIVERABLE#${deliverableId}`,
    gsi1sk: (studentId) => `SUBMISSION#${studentId}`,
    gsi2pk: (studentId) => `STUDENT#${studentId}`,
    gsi2sk: (submittedAt) => `SUBMISSION#${submittedAt}`,
};
// ── Serialization ─────────────────────────────────────────────────────────────
function toSubmissionDdbRecord(submission) {
    return {
        ...submission,
        PK: exports.SubmissionKeys.pk(submission.submissionId),
        SK: exports.SubmissionKeys.sk(),
        GSI1PK: exports.SubmissionKeys.gsi1pk(submission.deliverableId),
        GSI1SK: exports.SubmissionKeys.gsi1sk(submission.studentId),
        GSI2PK: exports.SubmissionKeys.gsi2pk(submission.studentId),
        GSI2SK: exports.SubmissionKeys.gsi2sk(submission.submittedAt),
        entityType: 'SUBMISSION',
    };
}
function fromSubmissionDdbRecord(record) {
    const { PK: _PK, SK: _SK, GSI1PK: _G1PK, GSI1SK: _G1SK, GSI2PK: _G2PK, GSI2SK: _G2SK, entityType: _et, ...submission } = record;
    return submission;
}
//# sourceMappingURL=submission.model.js.map