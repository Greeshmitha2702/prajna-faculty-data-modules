import { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AuthorizerContext } from '../../models/common.model';
export declare function ok<T>(body: T, statusCode?: number): APIGatewayProxyResultV2;
export declare function created<T>(body: T): APIGatewayProxyResultV2;
export declare function noContent(): APIGatewayProxyResultV2;
export declare function errorResponse(statusCode: number, message: string, code?: string): APIGatewayProxyResultV2;
export declare function handleError(err: unknown): APIGatewayProxyResultV2;
export declare function extractAuthContext(event: APIGatewayProxyEventV2WithJWTAuthorizer): AuthorizerContext;
export declare function parseBody<T>(event: {
    body?: string | null;
}): T;
export declare function getPathParam(event: APIGatewayProxyEventV2WithJWTAuthorizer, name: string): string;
export declare function getQueryParam(event: APIGatewayProxyEventV2WithJWTAuthorizer, name: string): string | undefined;
