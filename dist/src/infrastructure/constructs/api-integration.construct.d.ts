import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
export interface ApiIntegrationConstructProps {
    stage: string;
    deliverableHandler: lambda.IFunction;
    submissionHandler: lambda.IFunction;
    uploadHandler: lambda.IFunction;
    feedbackHandler: lambda.IFunction;
    scheduleHandler: lambda.IFunction;
    gradebookHandler: lambda.IFunction;
}
export declare class ApiIntegrationConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ApiIntegrationConstructProps);
}
