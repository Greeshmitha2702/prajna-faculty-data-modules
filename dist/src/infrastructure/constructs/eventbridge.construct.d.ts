import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
export interface EventBridgeConstructProps {
    stage: string;
}
export declare class EventBridgeConstruct extends Construct {
    readonly eventBus: events.IEventBus;
    readonly eventBusName: string;
    constructor(scope: Construct, id: string, props: EventBridgeConstructProps);
}
