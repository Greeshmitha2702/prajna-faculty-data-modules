import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
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
export declare class DdbAdapter {
    private readonly tableName;
    constructor(tableName: string);
    get<T>(key: Record<string, string>): Promise<T | null>;
    put<T extends object>(item: T): Promise<void>;
    putIfNotExists<T extends object>(item: T, pk: string, sk: string): Promise<void>;
    update(tableName: string, options: UpdateOptions): Promise<Record<string, unknown> | null>;
    updateItem(options: UpdateOptions): Promise<Record<string, unknown> | null>;
    delete(key: Record<string, string>): Promise<void>;
    query<T>(options: QueryOptions): Promise<{
        items: T[];
        lastKey?: Record<string, unknown>;
    }>;
    transactWrite(items: TransactWriteCommandInput['TransactItems']): Promise<void>;
}
