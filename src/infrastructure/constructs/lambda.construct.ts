// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Lambda Construct
// Creates all Module 8 Lambda functions with shared role and log groups
// ─────────────────────────────────────────────────────────────────────────────

import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { SharedLambda, SharedRole, SharedLogGroup } from './foundation.construct';

export interface LambdaConstructProps {
  stage: string;
  tableName: string;
  tableArn: string;
  eventBusName: string;
  documentsBucketName: string;
}

export class LambdaConstruct extends Construct {
  public readonly deliverableHandler: lambda.Function;
  public readonly submissionHandler: lambda.Function;
  public readonly uploadHandler: lambda.Function;
  public readonly feedbackHandler: lambda.Function;
  public readonly scheduleHandler: lambda.Function;
  public readonly gradebookHandler: lambda.Function;

  private readonly sharedRole: iam.Role;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const { stage, tableName, tableArn, eventBusName, documentsBucketName } = props;

    // ── Shared IAM Role ──────────────────────────────────────────────────────
    const roleConstruct = new SharedRole(this, 'LambdaRole', {
      roleName: 'prajna-teaching-lambda',
      stage,
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:BatchWriteItem',
                'dynamodb:TransactWriteItems',
              ],
              resources: [
                tableArn,
                `${tableArn}/index/*`,
              ],
            }),
          ],
        }),
        EventBridgeAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['events:PutEvents'],
              resources: [`arn:aws:events:ap-south-1:*:event-bus/${eventBusName}`],
            }),
          ],
        }),
        S3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:HeadObject',
              ],
              resources: [`arn:aws:s3:::${documentsBucketName}/documents/faculty/*`],
            }),
            new iam.PolicyStatement({
              actions: ['s3:GeneratePresignedPost'],
              resources: [`arn:aws:s3:::${documentsBucketName}`],
            }),
          ],
        }),
        SSMAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['ssm:GetParameter', 'ssm:GetParameters'],
              resources: [
                `arn:aws:ssm:ap-south-1:*:parameter/prajna/${stage}/*`,
              ],
            }),
          ],
        }),
      },
    });

    this.sharedRole = roleConstruct.role;

    const commonEnv = {
      DYNAMODB_TABLE_NAME: tableName,
      EVENT_BUS_NAME: eventBusName,
      DOCUMENTS_BUCKET_NAME: documentsBucketName,
      STAGE: stage,
    };

    // ── Lambda Functions ─────────────────────────────────────────────────────

    const makeLogGroup = (name: string) =>
      new SharedLogGroup(this, `${name}LogGroup`, {
        logGroupName: `module8/${name}`,
        stage,
      }).logGroup;

    const deliverableLog = makeLogGroup('deliverable');
    const submissionLog = makeLogGroup('submission');
    const uploadLog = makeLogGroup('upload');
    const feedbackLog = makeLogGroup('feedback');
    const scheduleLog = makeLogGroup('schedule');
    const gradebookLog = makeLogGroup('gradebook');

    this.deliverableHandler = new SharedLambda(this, 'DeliverableHandler', {
      functionName: 'prajna-teaching-deliverable',
      handlerFile: 'deliverable.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: deliverableLog,
      stage,
    }).fn;

    this.submissionHandler = new SharedLambda(this, 'SubmissionHandler', {
      functionName: 'prajna-teaching-submission',
      handlerFile: 'submission.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: submissionLog,
      stage,
    }).fn;

    this.uploadHandler = new SharedLambda(this, 'UploadHandler', {
      functionName: 'prajna-teaching-upload',
      handlerFile: 'upload.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: uploadLog,
      timeoutSeconds: 15,
      stage,
    }).fn;

    this.feedbackHandler = new SharedLambda(this, 'FeedbackHandler', {
      functionName: 'prajna-teaching-feedback',
      handlerFile: 'feedback.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: feedbackLog,
      stage,
    }).fn;

    this.scheduleHandler = new SharedLambda(this, 'ScheduleHandler', {
      functionName: 'prajna-teaching-schedule',
      handlerFile: 'schedule.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: scheduleLog,
      stage,
    }).fn;

    this.gradebookHandler = new SharedLambda(this, 'GradebookHandler', {
      functionName: 'prajna-teaching-gradebook',
      handlerFile: 'gradebook.handler',
      environment: commonEnv,
      role: this.sharedRole,
      logGroup: gradebookLog,
      memorySize: 512,
      timeoutSeconds: 60,
      stage,
    }).fn;

    // ── Error Rate Alarms ────────────────────────────────────────────────────

    const fns = [
      { fn: this.deliverableHandler, name: 'deliverable' },
      { fn: this.submissionHandler, name: 'submission' },
      { fn: this.feedbackHandler, name: 'feedback' },
      { fn: this.scheduleHandler, name: 'schedule' },
      { fn: this.gradebookHandler, name: 'gradebook' },
    ];

    for (const { fn, name } of fns) {
      fn.metricErrors({ period: cdk.Duration.minutes(5) });
    }
  }
}
