"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DynamoDB Adapter (AWS SDK v3)
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DdbAdapter = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const clientConfig = {
    region: process.env.AWS_REGION ?? 'ap-south-1',
};
const rawClient = new client_dynamodb_1.DynamoDBClient(clientConfig);
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(rawClient, {
    marshallOptions: {
        convertEmptyValues: false,
        removeUndefinedValues: true,
        convertClassInstanceToMap: false,
    },
    unmarshallOptions: {
        wrapNumbers: false,
    },
});
class DdbAdapter {
    tableName;
    constructor(tableName) {
        this.tableName = tableName;
    }
    async get(key) {
        const result = await docClient.send(new lib_dynamodb_1.GetCommand({ TableName: this.tableName, Key: key }));
        return result.Item ? result.Item : null;
    }
    async put(item) {
        await docClient.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: item }));
    }
    async putIfNotExists(item, pk, sk) {
        await docClient.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: item,
            ConditionExpression: 'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
            ExpressionAttributeNames: { '#pk': pk, '#sk': sk },
        }));
    }
    async update(tableName, options) {
        const result = await docClient.send(new lib_dynamodb_1.UpdateCommand({
            TableName: tableName,
            Key: options.key,
            UpdateExpression: options.updateExpression,
            ExpressionAttributeNames: options.expressionAttributeNames,
            ExpressionAttributeValues: options.expressionAttributeValues,
            ConditionExpression: options.conditionExpression,
            ReturnValues: 'ALL_NEW',
        }));
        return result.Attributes ? result.Attributes : null;
    }
    async updateItem(options) {
        return this.update(this.tableName, options);
    }
    async delete(key) {
        await docClient.send(new lib_dynamodb_1.DeleteCommand({ TableName: this.tableName, Key: key }));
    }
    async query(options) {
        const input = {
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
        const result = await docClient.send(new lib_dynamodb_1.QueryCommand(input));
        return {
            items: (result.Items ?? []),
            lastKey: result.LastEvaluatedKey,
        };
    }
    async transactWrite(items) {
        await docClient.send(new lib_dynamodb_1.TransactWriteCommand({ TransactItems: items }));
    }
}
exports.DdbAdapter = DdbAdapter;
//# sourceMappingURL=ddb.adapter.js.map