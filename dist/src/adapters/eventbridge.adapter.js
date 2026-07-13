"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – EventBridge Adapter (AWS SDK v3)
// Source: prajna.teaching
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridgeAdapter = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const ebClient = new client_eventbridge_1.EventBridgeClient({
    region: process.env.AWS_REGION ?? 'ap-south-1',
});
class EventBridgeAdapter {
    eventBusName;
    source = 'prajna.teaching';
    constructor(eventBusName) {
        this.eventBusName = eventBusName;
    }
    async publish(event) {
        const entry = {
            EventBusName: this.eventBusName,
            Source: this.source,
            DetailType: event.eventType,
            Detail: JSON.stringify({
                eventType: event.eventType,
                facultyId: event.facultyId,
                campus: event.campus,
                department: event.department,
                academicYear: event.academicYear,
                semester: event.semester,
                courseCode: event.courseCode,
                timestamp: new Date().toISOString(),
                payload: event.payload,
            }),
            Time: new Date(),
        };
        const result = await ebClient.send(new client_eventbridge_1.PutEventsCommand({ Entries: [entry] }));
        if (result.FailedEntryCount && result.FailedEntryCount > 0) {
            const failed = result.Entries?.find((e) => e.ErrorCode);
            throw new Error(`EventBridge publish failed: ${failed?.ErrorCode} – ${failed?.ErrorMessage}`);
        }
    }
    async publishBatch(events) {
        const entries = events.map((event) => ({
            EventBusName: this.eventBusName,
            Source: this.source,
            DetailType: event.eventType,
            Detail: JSON.stringify({
                eventType: event.eventType,
                facultyId: event.facultyId,
                campus: event.campus,
                department: event.department,
                academicYear: event.academicYear,
                semester: event.semester,
                courseCode: event.courseCode,
                timestamp: new Date().toISOString(),
                payload: event.payload,
            }),
            Time: new Date(),
        }));
        // EventBridge max batch = 10
        const chunks = [];
        for (let i = 0; i < entries.length; i += 10) {
            chunks.push(entries.slice(i, i + 10));
        }
        for (const chunk of chunks) {
            const result = await ebClient.send(new client_eventbridge_1.PutEventsCommand({ Entries: chunk }));
            if (result.FailedEntryCount && result.FailedEntryCount > 0) {
                throw new Error(`EventBridge batch publish partially failed: ${result.FailedEntryCount} entries failed`);
            }
        }
    }
}
exports.EventBridgeAdapter = EventBridgeAdapter;
//# sourceMappingURL=eventbridge.adapter.js.map