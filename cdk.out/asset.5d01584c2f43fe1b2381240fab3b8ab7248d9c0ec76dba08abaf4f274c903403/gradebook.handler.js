"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – GradeBook Handler
// Route: GET /gradebook
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const response_1 = require("./shared/response");
const container_1 = require("./shared/container");
const errors_1 = require("../services/errors");
const handler = async (event) => {
    try {
        const { gradebookService } = (0, container_1.getContainer)();
        const ctx = (0, response_1.extractAuthContext)(event);
        const method = event.requestContext.http.method;
        const path = event.requestContext.http.path;
        const q = event.queryStringParameters ?? {};
        // GET /gradebook – list all gradebooks for the faculty
        if (method === 'GET' && path.endsWith('/gradebook')) {
            const list = await gradebookService.listByFaculty(ctx, {
                academicYear: q.academicYear,
                semester: q.semester,
                limit: q.limit ? Number(q.limit) : 20,
                lastKey: q.lastKey,
            });
            return (0, response_1.ok)(list);
        }
        // GET /gradebook/sync?courseCode=&batchId=&semester=&academicYear= – sync & return
        if (method === 'GET' && path.endsWith('/gradebook/sync')) {
            const { courseCode, batchId, semester, academicYear } = q;
            if (!courseCode)
                throw new errors_1.ValidationError('courseCode is required');
            if (!batchId)
                throw new errors_1.ValidationError('batchId is required');
            if (!semester)
                throw new errors_1.ValidationError('semester is required');
            if (!academicYear)
                throw new errors_1.ValidationError('academicYear is required');
            const gradebook = await gradebookService.getOrSync(courseCode, batchId, semester, academicYear, ctx);
            return (0, response_1.ok)(gradebook);
        }
        return (0, response_1.handleError)(new Error(`Unhandled route: ${method} ${path}`));
    }
    catch (err) {
        return (0, response_1.handleError)(err);
    }
};
exports.handler = handler;
//# sourceMappingURL=gradebook.handler.js.map