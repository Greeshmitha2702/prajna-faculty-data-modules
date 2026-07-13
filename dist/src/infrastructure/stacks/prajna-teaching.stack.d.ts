import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface PrajnaTeachingStackProps extends cdk.StackProps {
    stage: string;
}
export declare class PrajnaTeachingStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PrajnaTeachingStackProps);
}
