// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Shared Error Types & RBAC Helper
// ─────────────────────────────────────────────────────────────────────────────

import { AuthorizerContext, UserRole } from '../models/common.model';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, `${resource} not found: ${id}`, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(403, message, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
  }
}

// ── RBAC Roles ────────────────────────────────────────────────────────────────

const READ_ROLES: UserRole[] = [
  UserRole.FACULTY,
  UserRole.HOD,
  UserRole.DIRECTOR,
  UserRole.PVC,
  UserRole.IQAC,
  UserRole.ADMIN,
];

const WRITE_ROLES: UserRole[] = [UserRole.FACULTY, UserRole.ADMIN];

const MANAGE_ROLES: UserRole[] = [
  UserRole.HOD,
  UserRole.DIRECTOR,
  UserRole.IQAC,
  UserRole.ADMIN,
];

export function assertCanRead(ctx: AuthorizerContext): void {
  if (!READ_ROLES.includes(ctx.role)) {
    throw new ForbiddenError(`Role ${ctx.role} cannot read teaching resources`);
  }
}

export function assertCanWrite(ctx: AuthorizerContext): void {
  if (!WRITE_ROLES.includes(ctx.role)) {
    throw new ForbiddenError(
      `Role ${ctx.role} cannot create/modify teaching resources`
    );
  }
}

export function assertCanManage(ctx: AuthorizerContext): void {
  if (!MANAGE_ROLES.includes(ctx.role)) {
    throw new ForbiddenError(
      `Role ${ctx.role} cannot manage teaching resources`
    );
  }
}

export function assertIsFacultyOrAdmin(
  ctx: AuthorizerContext,
  targetFacultyId: string
): void {
  if (ctx.role === UserRole.ADMIN) return;
  if (ctx.facultyId === targetFacultyId) return;
  if (MANAGE_ROLES.includes(ctx.role)) return;
  throw new ForbiddenError(
    'You can only access your own teaching resources'
  );
}
