// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DynamoDB Adapter (AWS SDK v3)
// ─────────────────────────────────────────────────────────────────────────────

import {
  DynamoDBClient,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  QueryCommandInput,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';

export interface QueryOptions {
  indexName?: string;
  keyConditionExpression: string;
  filterExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues: Record<string, unknown>;
  limit?: number;
  exclusiveStartKey?: Record<string, unknown>;
  scanIndexForward?: boolean;
}

export interface UpdateOptions {
  key: Record<string, string>;
  updateExpression: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues: Record<string, unknown>;
  conditionExpression?: string;
}

const clientConfig: DynamoDBClientConfig = {
  region: process.env.AWS_REGION ?? 'ap-south-1',
};

const rawClient = new DynamoDBClient(clientConfig);

const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export class DdbAdapter {
  constructor(private readonly tableName: string) {}

  async get<T>(key: Record<string, string>): Promise<T | null> {
    const result = await docClient.send(
      new GetCommand({ TableName: this.tableName, Key: key })
    );
    return result.Item ? (result.Item as T) : null;
  }

  async put<T extends object>(item: T): Promise<void> {
    await docClient.send(
      new PutCommand({ TableName: this.tableName, Item: item })
    );
  }

  async putIfNotExists<T extends object>(
    item: T,
    pk: string,
    sk: string
  ): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
        ExpressionAttributeNames: { '#pk': pk, '#sk': sk },
      })
    );
  }

  async update(
    tableName: string,
    options: UpdateOptions
  ): Promise<Record<string, unknown> | null> {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: options.key,
        UpdateExpression: options.updateExpression,
        ExpressionAttributeNames: options.expressionAttributeNames,
        ExpressionAttributeValues: options.expressionAttributeValues,
        ConditionExpression: options.conditionExpression,
        ReturnValues: 'ALL_NEW',
      })
    );
    return result.Attributes ? (result.Attributes as Record<string, unknown>) : null;
  }

  async updateItem(options: UpdateOptions): Promise<Record<string, unknown> | null> {
    return this.update(this.tableName, options);
  }

  async delete(key: Record<string, string>): Promise<void> {
    await docClient.send(
      new DeleteCommand({ TableName: this.tableName, Key: key })
    );
  }

  async query<T>(
    options: QueryOptions
  ): Promise<{ items: T[]; lastKey?: Record<string, unknown> }> {
    const input: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: options.indexName,
      KeyConditionExpression: options.keyConditionExpression,
      FilterExpression: options.filterExpression,
      ExpressionAttributeNames: options.expressionAttributeNames,
      ExpressionAttributeValues: options.expressionAttributeValues,
      Limit: options.limit,
      ExclusiveStartKey: options.exclusiveStartKey,
      ScanIndexForward: options.scanIndexForward,
    };
    const result = await docClient.send(new QueryCommand(input));
    return {
      items: (result.Items ?? []) as T[],
      lastKey: result.LastEvaluatedKey,
    };
  }

  async transactWrite(
    items: TransactWriteCommandInput['TransactItems']
  ): Promise<void> {
    await docClient.send(
      new TransactWriteCommand({ TransactItems: items })
    );
  }
}
