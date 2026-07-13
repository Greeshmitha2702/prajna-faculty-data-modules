// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – EventBridge Construct
// Imports shared Event Bus via SSM. Creates routing rules for teaching events.
// ─────────────────────────────────────────────────────────────────────────────

import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface EventBridgeConstructProps {
  stage: string;
}

export class EventBridgeConstruct extends Construct {
  public readonly eventBus: events.IEventBus;
  public readonly eventBusName: string;

  constructor(scope: Construct, id: string, props: EventBridgeConstructProps) {
    super(scope, id);

    // Discover Event Bus name from SSM (no hardcoding)
    this.eventBusName = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${props.stage}/eventbridge/event-bus-name`
    );

    this.eventBus = events.EventBus.fromEventBusName(
      this,
      'SharedEventBus',
      this.eventBusName
    );

    // ── Audit / Dead-Letter Log Group for teaching events ────────────────────
    const auditLogGroup = new logs.LogGroup(this, 'TeachingEventAuditLog', {
      logGroupName: `/prajna/${props.stage}/eventbridge/teaching-events`,
    });

    // Teaching events archive rule – captures all prajna.teaching source events
    new events.Rule(this, 'TeachingEventsArchiveRule', {
      eventBus: this.eventBus,
      ruleName: `prajna-teaching-events-${props.stage}`,
      description: 'Captures all prajna.teaching domain events for audit',
      eventPattern: {
        source: ['prajna.teaching'],
        detailType: [
          'deliverable.published',
          'submission.received',
          'feedback.released',
          'session.scheduled',
          'session.cancelled',
          'gradebook.updated',
        ],
      },
      targets: [new eventsTargets.CloudWatchLogGroup(auditLogGroup)],
    });
  }
}
