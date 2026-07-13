// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Main CDK Stack
// Wires all infrastructure components together
// ─────────────────────────────────────────────────────────────────────────────

import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

import { DynamoDbConstruct } from '../constructs/dynamodb.construct';
import { EventBridgeConstruct } from '../constructs/eventbridge.construct';
import { LambdaConstruct } from '../constructs/lambda.construct';
import { ApiIntegrationConstruct } from '../constructs/api-integration.construct';

export interface PrajnaTeachingStackProps extends cdk.StackProps {
  stage: string;
}

export class PrajnaTeachingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PrajnaTeachingStackProps) {
    super(scope, id, props);

    const { stage } = props;

    // ── External Dependencies (from SSM) ──────────────────────────────────────
    const documentsBucketName = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${stage}/storage/documents-bucket-name`
    );

    // ── DynamoDB (Imports Shared Table) ───────────────────────────────────────
    const database = new DynamoDbConstruct(this, 'Database', { stage });

    // ── EventBridge (Imports Shared Bus & Adds Rules) ─────────────────────────
    const eventBridge = new EventBridgeConstruct(this, 'EventBridge', { stage });

    // ── Lambda Functions ──────────────────────────────────────────────────────
    const lambdas = new LambdaConstruct(this, 'Lambdas', {
      stage,
      tableName: database.tableName,
      tableArn: database.tableArn,
      eventBusName: eventBridge.eventBusName,
      documentsBucketName,
    });

    // ── API Gateway Integration ───────────────────────────────────────────────
    new ApiIntegrationConstruct(this, 'ApiIntegration', {
      stage,
      deliverableHandler: lambdas.deliverableHandler,
      submissionHandler: lambdas.submissionHandler,
      uploadHandler: lambdas.uploadHandler,
      feedbackHandler: lambdas.feedbackHandler,
      scheduleHandler: lambdas.scheduleHandler,
      gradebookHandler: lambdas.gradebookHandler,
    });

    // ── Outputs ───────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'DeliverableLambdaArn', {
      value: lambdas.deliverableHandler.functionArn,
      exportName: `Prajna-${stage}-Teaching-DeliverableLambdaArn`,
    });

    new cdk.CfnOutput(this, 'ScheduleLambdaArn', {
      value: lambdas.scheduleHandler.functionArn,
      exportName: `Prajna-${stage}-Teaching-ScheduleLambdaArn`,
    });
  }
}
