import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
export interface SharedLambdaProps {
    functionName: string;
    handlerFile: string;
    environment: Record<string, string>;
    role: iam.IRole;
    logGroup: logs.ILogGroup;
    memorySize?: number;
    timeoutSeconds?: number;
    stage: string;
}
export declare class SharedLambda extends Construct {
    readonly fn: lambda.Function;
    constructor(scope: Construct, id: string, props: SharedLambdaProps);
}
export interface SharedRoleProps {
    roleName: string;
    stage: string;
    inlinePolicies?: Record<string, iam.PolicyDocument>;
    managedPolicies?: iam.IManagedPolicy[];
}
export declare class SharedRole extends Construct {
    readonly role: iam.Role;
    constructor(scope: Construct, id: string, props: SharedRoleProps);
}
export interface SharedLogGroupProps {
    logGroupName: string;
    stage: string;
    retentionDays?: number;
}
export declare class SharedLogGroup extends Construct {
    readonly logGroup: logs.LogGroup;
    constructor(scope: Construct, id: string, props: SharedLogGroupProps);
}
export interface SharedParameterProps {
    parameterName: string;
    value: string;
    description?: string;
}
export declare class SharedParameter extends Construct {
    readonly parameter: ssm.StringParameter;
    constructor(scope: Construct, id: string, props: SharedParameterProps);
}
export interface SharedAlarmProps {
    alarmName: string;
    metric: cloudwatch.IMetric;
    threshold: number;
    evaluationPeriods?: number;
    stage: string;
}
export declare class SharedAlarm extends Construct {
    readonly alarm: cloudwatch.Alarm;
    constructor(scope: Construct, id: string, props: SharedAlarmProps);
}
