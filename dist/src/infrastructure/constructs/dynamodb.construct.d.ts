import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
export interface DynamoDbConstructProps {
    stage: string;
}
export declare class DynamoDbConstruct extends Construct {
    readonly table: dynamodb.ITable;
    readonly tableName: string;
    readonly tableArn: string;
    constructor(scope: Construct, id: string, props: DynamoDbConstructProps);
}
