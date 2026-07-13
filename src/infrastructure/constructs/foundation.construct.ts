// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Foundation Constructs (SharedLambda, SharedRole, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import * as path from 'path';

// ── SharedLambda ──────────────────────────────────────────────────────────────

export interface SharedLambdaProps {
  functionName: string;
  handlerFile: string; // relative to src/handlers, e.g. 'deliverable.handler'
  environment: Record<string, string>;
  role: iam.IRole;
  logGroup: logs.ILogGroup;
  memorySize?: number;
  timeoutSeconds?: number;
  stage: string;
}

export class SharedLambda extends Construct {
  public readonly fn: lambda.Function;

  constructor(scope: Construct, id: string, props: SharedLambdaProps) {
    super(scope, id);

    this.fn = new lambda.Function(this, 'Fn', {
      functionName: `${props.functionName}-${props.stage}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: `${props.handlerFile}.handler`,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../dist/src/handlers')),
      environment: {
        NODE_ENV: props.stage,
        ...props.environment,
      },
      role: props.role,
      logGroup: props.logGroup,
      memorySize: props.memorySize ?? 256,
      timeout: cdk.Duration.seconds(props.timeoutSeconds ?? 30),
      tracing: lambda.Tracing.ACTIVE,
      architecture: lambda.Architecture.ARM_64,
    });
  }
}

// ── SharedRole ────────────────────────────────────────────────────────────────

export interface SharedRoleProps {
  roleName: string;
  stage: string;
  inlinePolicies?: Record<string, iam.PolicyDocument>;
  managedPolicies?: iam.IManagedPolicy[];
}

export class SharedRole extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: SharedRoleProps) {
    super(scope, id);

    this.role = new iam.Role(this, 'Role', {
      roleName: `${props.roleName}-${props.stage}`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
        ...(props.managedPolicies ?? []),
      ],
      inlinePolicies: props.inlinePolicies ?? {},
    });
  }
}

// ── SharedLogGroup ────────────────────────────────────────────────────────────

export interface SharedLogGroupProps {
  logGroupName: string;
  stage: string;
  retentionDays?: number;
}

export class SharedLogGroup extends Construct {
  public readonly logGroup: logs.LogGroup;

  constructor(scope: Construct, id: string, props: SharedLogGroupProps) {
    super(scope, id);

    this.logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/prajna/${props.stage}/${props.logGroupName}`,
      retention:
        props.stage === 'prod'
          ? logs.RetentionDays.SIX_MONTHS
          : logs.RetentionDays.ONE_WEEK,
      removalPolicy:
        props.stage === 'prod'
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
    });
  }
}

// ── SharedParameter ───────────────────────────────────────────────────────────

export interface SharedParameterProps {
  parameterName: string;
  value: string;
  description?: string;
}

export class SharedParameter extends Construct {
  public readonly parameter: ssm.StringParameter;

  constructor(scope: Construct, id: string, props: SharedParameterProps) {
    super(scope, id);

    this.parameter = new ssm.StringParameter(this, 'Param', {
      parameterName: props.parameterName,
      stringValue: props.value,
      description: props.description,
    });
  }
}

// ── SharedAlarm ───────────────────────────────────────────────────────────────

export interface SharedAlarmProps {
  alarmName: string;
  metric: cloudwatch.IMetric;
  threshold: number;
  evaluationPeriods?: number;
  stage: string;
}

export class SharedAlarm extends Construct {
  public readonly alarm: cloudwatch.Alarm;

  constructor(scope: Construct, id: string, props: SharedAlarmProps) {
    super(scope, id);

    this.alarm = new cloudwatch.Alarm(this, 'Alarm', {
      alarmName: `${props.alarmName}-${props.stage}`,
      metric: props.metric,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods ?? 3,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
  }
}
