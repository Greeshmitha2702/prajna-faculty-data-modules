import { AuthorizerContext } from '../models/common.model';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    constructor(statusCode: number, message: string, code?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string, id: string);
}
export declare class ValidationError extends AppError {
    constructor(message: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare function assertCanRead(ctx: AuthorizerContext): void;
export declare function assertCanWrite(ctx: AuthorizerContext): void;
export declare function assertCanManage(ctx: AuthorizerContext): void;
export declare function assertIsFacultyOrAdmin(ctx: AuthorizerContext, targetFacultyId: string): void;
