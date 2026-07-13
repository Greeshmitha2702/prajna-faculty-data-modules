import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
export interface LambdaConstructProps {
    stage: string;
    tableName: string;
    tableArn: string;
    eventBusName: string;
    documentsBucketName: string;
}
export declare class LambdaConstruct extends Construct {
    readonly deliverableHandler: lambda.Function;
    readonly submissionHandler: lambda.Function;
    readonly uploadHandler: lambda.Function;
    readonly feedbackHandler: lambda.Function;
    readonly scheduleHandler: lambda.Function;
    readonly gradebookHandler: lambda.Function;
    private readonly sharedRole;
    constructor(scope: Construct, id: string, props: LambdaConstructProps);
}
