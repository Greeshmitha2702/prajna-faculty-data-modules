"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Shared Error Types & RBAC Helper
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.ForbiddenError = exports.ValidationError = exports.NotFoundError = exports.AppError = void 0;
exports.assertCanRead = assertCanRead;
exports.assertCanWrite = assertCanWrite;
exports.assertCanManage = assertCanManage;
exports.assertIsFacultyOrAdmin = assertIsFacultyOrAdmin;
const common_model_1 = require("../models/common.model");
class AppError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(resource, id) {
        super(404, `${resource} not found: ${id}`, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends AppError {
    constructor(message) {
        super(400, message, 'VALIDATION_ERROR');
    }
}
exports.ValidationError = ValidationError;
class ForbiddenError extends AppError {
    constructor(message = 'You do not have permission to perform this action') {
        super(403, message, 'FORBIDDEN');
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message) {
        super(409, message, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
// ── RBAC Roles ────────────────────────────────────────────────────────────────
const READ_ROLES = [
    common_model_1.UserRole.FACULTY,
    common_model_1.UserRole.HOD,
    common_model_1.UserRole.DIRECTOR,
    common_model_1.UserRole.PVC,
    common_model_1.UserRole.IQAC,
    common_model_1.UserRole.ADMIN,
];
const WRITE_ROLES = [common_model_1.UserRole.FACULTY, common_model_1.UserRole.ADMIN];
const MANAGE_ROLES = [
    common_model_1.UserRole.HOD,
    common_model_1.UserRole.DIRECTOR,
    common_model_1.UserRole.IQAC,
    common_model_1.UserRole.ADMIN,
];
function assertCanRead(ctx) {
    if (!READ_ROLES.includes(ctx.role)) {
        throw new ForbiddenError(`Role ${ctx.role} cannot read teaching resources`);
    }
}
function assertCanWrite(ctx) {
    if (!WRITE_ROLES.includes(ctx.role)) {
        throw new ForbiddenError(`Role ${ctx.role} cannot create/modify teaching resources`);
    }
}
function assertCanManage(ctx) {
    if (!MANAGE_ROLES.includes(ctx.role)) {
        throw new ForbiddenError(`Role ${ctx.role} cannot manage teaching resources`);
    }
}
function assertIsFacultyOrAdmin(ctx, targetFacultyId) {
    if (ctx.role === common_model_1.UserRole.ADMIN)
        return;
    if (ctx.facultyId === targetFacultyId)
        return;
    if (MANAGE_ROLES.includes(ctx.role))
        return;
    throw new ForbiddenError('You can only access your own teaching resources');
}
//# sourceMappingURL=errors.js.map