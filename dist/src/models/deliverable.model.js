"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Model: Deliverable
// Single-table design:
//   PK = DELIVERABLE#{deliverableId}
//   SK = METADATA
//   GSI1PK = FACULTY#{facultyId}   GSI1SK = DELIVERABLE#{courseCode}#{dueDate}
//   GSI2PK = COURSE#{courseCode}   GSI2SK = DELIVERABLE#{status}
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliverableKeys = void 0;
exports.toDeliverableDdbRecord = toDeliverableDdbRecord;
exports.fromDeliverableDdbRecord = fromDeliverableDdbRecord;
// ── DynamoDB Keys ─────────────────────────────────────────────────────────────
exports.DeliverableKeys = {
    pk: (id) => `DELIVERABLE#${id}`,
    sk: () => 'METADATA',
    gsi1pk: (facultyId) => `FACULTY#${facultyId}`,
    gsi1sk: (courseCode, dueDate) => `DELIVERABLE#${courseCode}#${dueDate}`,
    gsi2pk: (courseCode) => `COURSE#${courseCode}`,
    gsi2sk: (status) => `DELIVERABLE#${status}`,
};
// ── Serialization ─────────────────────────────────────────────────────────────
function toDeliverableDdbRecord(deliverable) {
    return {
        ...deliverable,
        PK: exports.DeliverableKeys.pk(deliverable.deliverableId),
        SK: exports.DeliverableKeys.sk(),
        GSI1PK: exports.DeliverableKeys.gsi1pk(deliverable.facultyId),
        GSI1SK: exports.DeliverableKeys.gsi1sk(deliverable.courseCode, deliverable.dueDate),
        GSI2PK: exports.DeliverableKeys.gsi2pk(deliverable.courseCode),
        GSI2SK: exports.DeliverableKeys.gsi2sk(deliverable.status),
        entityType: 'DELIVERABLE',
    };
}
function fromDeliverableDdbRecord(record) {
    const { PK: _PK, SK: _SK, GSI1PK: _G1PK, GSI1SK: _G1SK, GSI2PK: _G2PK, GSI2SK: _G2SK, entityType: _et, ...deliverable } = record;
    return deliverable;
}
//# sourceMappingURL=deliverable.model.js.map