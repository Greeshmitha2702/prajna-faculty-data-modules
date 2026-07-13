// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – EventBridge Adapter (AWS SDK v3)
// Source: prajna.teaching
// ─────────────────────────────────────────────────────────────────────────────

import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';

export type TeachingEventType =
  | 'deliverable.published'
  | 'submission.received'
  | 'feedback.released'
  | 'session.scheduled'
  | 'session.cancelled'
  | 'gradebook.updated';

export interface TeachingEvent<T = unknown> {
  eventType: TeachingEventType;
  payload: T;
  facultyId: string;
  campus: string;
  department: string;
  academicYear?: string;
  semester?: string;
  courseCode?: string;
}

const ebClient = new EventBridgeClient({
  region: process.env.AWS_REGION ?? 'ap-south-1',
});

export class EventBridgeAdapter {
  private readonly source = 'prajna.teaching';

  constructor(private readonly eventBusName: string) {}

  async publish<T>(event: TeachingEvent<T>): Promise<void> {
    const entry: PutEventsRequestEntry = {
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

    const result = await ebClient.send(
      new PutEventsCommand({ Entries: [entry] })
    );

    if (result.FailedEntryCount && result.FailedEntryCount > 0) {
      const failed = result.Entries?.find((e) => e.ErrorCode);
      throw new Error(
        `EventBridge publish failed: ${failed?.ErrorCode} – ${failed?.ErrorMessage}`
      );
    }
  }

  async publishBatch<T>(events: TeachingEvent<T>[]): Promise<void> {
    const entries: PutEventsRequestEntry[] = events.map((event) => ({
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
    const chunks: PutEventsRequestEntry[][] = [];
    for (let i = 0; i < entries.length; i += 10) {
      chunks.push(entries.slice(i, i + 10));
    }

    for (const chunk of chunks) {
      const result = await ebClient.send(
        new PutEventsCommand({ Entries: chunk })
      );
      if (result.FailedEntryCount && result.FailedEntryCount > 0) {
        throw new Error(
          `EventBridge batch publish partially failed: ${result.FailedEntryCount} entries failed`
        );
      }
    }
  }
}
