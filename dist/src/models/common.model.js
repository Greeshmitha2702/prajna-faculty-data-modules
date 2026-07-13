"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Domain Models: Common Types & Enums
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayOfWeek = exports.AttendanceStatus = exports.SessionStatus = exports.FeedbackStatus = exports.FeedbackType = exports.SubmissionStatus = exports.DeliverableStatus = exports.DeliverableType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["FACULTY"] = "FACULTY";
    UserRole["HOD"] = "HOD";
    UserRole["DIRECTOR"] = "DIRECTOR";
    UserRole["PVC"] = "PVC";
    UserRole["IQAC"] = "IQAC";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var DeliverableType;
(function (DeliverableType) {
    DeliverableType["ASSIGNMENT"] = "ASSIGNMENT";
    DeliverableType["QUIZ"] = "QUIZ";
    DeliverableType["PROJECT"] = "PROJECT";
    DeliverableType["PRESENTATION"] = "PRESENTATION";
    DeliverableType["LAB_REPORT"] = "LAB_REPORT";
    DeliverableType["CASE_STUDY"] = "CASE_STUDY";
    DeliverableType["VIVA"] = "VIVA";
    DeliverableType["EXAM"] = "EXAM";
})(DeliverableType || (exports.DeliverableType = DeliverableType = {}));
var DeliverableStatus;
(function (DeliverableStatus) {
    DeliverableStatus["DRAFT"] = "DRAFT";
    DeliverableStatus["PUBLISHED"] = "PUBLISHED";
    DeliverableStatus["CLOSED"] = "CLOSED";
    DeliverableStatus["ARCHIVED"] = "ARCHIVED";
})(DeliverableStatus || (exports.DeliverableStatus = DeliverableStatus = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "PENDING";
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["LATE"] = "LATE";
    SubmissionStatus["GRADED"] = "GRADED";
    SubmissionStatus["RESUBMIT_REQUESTED"] = "RESUBMIT_REQUESTED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var FeedbackType;
(function (FeedbackType) {
    FeedbackType["COURSE"] = "COURSE";
    FeedbackType["FACULTY"] = "FACULTY";
    FeedbackType["SESSION"] = "SESSION";
    FeedbackType["DELIVERABLE"] = "DELIVERABLE";
})(FeedbackType || (exports.FeedbackType = FeedbackType = {}));
var FeedbackStatus;
(function (FeedbackStatus) {
    FeedbackStatus["PENDING"] = "PENDING";
    FeedbackStatus["RELEASED"] = "RELEASED";
    FeedbackStatus["ARCHIVED"] = "ARCHIVED";
})(FeedbackStatus || (exports.FeedbackStatus = FeedbackStatus = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["SCHEDULED"] = "SCHEDULED";
    SessionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SessionStatus["COMPLETED"] = "COMPLETED";
    SessionStatus["CANCELLED"] = "CANCELLED";
    SessionStatus["RESCHEDULED"] = "RESCHEDULED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EXCUSED"] = "EXCUSED";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek["MONDAY"] = "MONDAY";
    DayOfWeek["TUESDAY"] = "TUESDAY";
    DayOfWeek["WEDNESDAY"] = "WEDNESDAY";
    DayOfWeek["THURSDAY"] = "THURSDAY";
    DayOfWeek["FRIDAY"] = "FRIDAY";
    DayOfWeek["SATURDAY"] = "SATURDAY";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
//# sourceMappingURL=common.model.js.map