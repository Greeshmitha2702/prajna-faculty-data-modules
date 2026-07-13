// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DynamoDB Construct
// Imports shared table from Module 5 via SSM (no new table created)
// ─────────────────────────────────────────────────────────────────────────────

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface DynamoDbConstructProps {
  stage: string;
}

export class DynamoDbConstruct extends Construct {
  public readonly table: dynamodb.ITable;
  public readonly tableName: string;
  public readonly tableArn: string;

  constructor(scope: Construct, id: string, props: DynamoDbConstructProps) {
    super(scope, id);

    // Import the shared table name from SSM
    this.tableName = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${props.stage}/database/teaching-table-name`
    );

    // Import the shared table ARN from SSM
    this.tableArn = ssm.StringParameter.valueForStringParameter(
      this,
      `/prajna/${props.stage}/database/teaching-table-arn`
    );

    // Import by name without creating (single-table design from Module 5)
    this.table = dynamodb.Table.fromTableName(this, 'SharedTable', this.tableName);
  }
}

