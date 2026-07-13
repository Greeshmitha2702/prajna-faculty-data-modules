export type TeachingEventType = 'deliverable.published' | 'submission.received' | 'feedback.released' | 'session.scheduled' | 'session.cancelled' | 'gradebook.updated';
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
export declare class EventBridgeAdapter {
    private readonly eventBusName;
    private readonly source;
    constructor(eventBusName: string);
    publish<T>(event: TeachingEvent<T>): Promise<void>;
    publishBatch<T>(events: TeachingEvent<T>[]): Promise<void>;
}
