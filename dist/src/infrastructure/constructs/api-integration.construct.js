"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – API Integration Construct
// Adds all Module 8 routes to the shared API Gateway HTTP API
// Consumes existing Cognito Authorizer from Module 3
// ─────────────────────────────────────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiIntegrationConstruct = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const apigwv2 = __importStar(require("aws-cdk-lib/aws-apigatewayv2"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
const constructs_1 = require("constructs");
class ApiIntegrationConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const { stage } = props;
        // ── Import shared HTTP API ────────────────────────────────────────────────
        const apiId = ssm.StringParameter.valueForStringParameter(this, `/prajna/${stage}/api/http-api-id`);
        const httpApi = apigwv2.HttpApi.fromHttpApiAttributes(this, 'SharedHttpApi', {
            httpApiId: apiId,
        });
        // ── Import Cognito Authorizer from Module 3 ──────────────────────────────
        const authorizerId = ssm.StringParameter.valueForStringParameter(this, `/prajna/${stage}/auth/cognito-authorizer-id`);
        // ── Helper: Lambda Integration ──
        const addRoute = (id, path, method, fn) => {
            const integration = new apigwv2.CfnIntegration(this, `${id}Integration`, {
                apiId,
                integrationType: 'AWS_PROXY',
                integrationUri: fn.functionArn,
                payloadFormatVersion: '2.0',
            });
            new apigwv2.CfnRoute(this, `${id}Route`, {
                apiId,
                routeKey: `${method} ${path}`,
                authorizationType: 'JWT',
                authorizerId,
                target: `integrations/${integration.ref}`,
            });
            // Grant API Gateway permission to invoke lambda
            fn.addPermission(`${id}Invoke`, {
                principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
                action: 'lambda:InvokeFunction',
            });
        };
        // ── Teaching Routes ──
        addRoute('Load', '/faculty/teaching/load', 'GET', props.scheduleHandler);
        addRoute('Timetable', '/faculty/teaching/timetable', 'GET', props.scheduleHandler);
        addRoute('TeachingDeps', '/faculty/{facultyId}/teaching', 'GET', props.scheduleHandler);
        // ── Lesson Plan Routes ──
        addRoute('LPPost', '/faculty/teaching/lesson-plan', 'POST', props.scheduleHandler);
        addRoute('LPGet', '/faculty/teaching/lesson-plan', 'GET', props.scheduleHandler);
        addRoute('LPPut', '/faculty/teaching/lesson-plan/{id}', 'PUT', props.scheduleHandler);
        addRoute('LPDel', '/faculty/teaching/lesson-plan/{id}', 'DELETE', props.scheduleHandler);
        // ── Attendance Routes ──
        addRoute('AttPost', '/faculty/teaching/attendance', 'POST', props.scheduleHandler);
        addRoute('AttGet', '/faculty/teaching/attendance', 'GET', props.scheduleHandler);
        addRoute('AttPut', '/faculty/teaching/attendance/{id}', 'PUT', props.scheduleHandler);
        // ── Deliverable Routes ──
        addRoute('DelPost', '/deliverables', 'POST', props.deliverableHandler);
        addRoute('DelGet', '/deliverables', 'GET', props.deliverableHandler);
        addRoute('DelPutId', '/deliverables/{id}', 'PUT', props.deliverableHandler);
        addRoute('DelDelId', '/deliverables/{id}', 'DELETE', props.deliverableHandler);
        addRoute('DelGetId', '/deliverables/{id}', 'GET', props.deliverableHandler);
        // ── Feedback Routes ──
        addRoute('FbPost', '/feedback', 'POST', props.feedbackHandler);
        addRoute('FbGet', '/feedback', 'GET', props.feedbackHandler);
        addRoute('FbGetId', '/feedback/{id}', 'GET', props.feedbackHandler);
        addRoute('FbPutId', '/feedback/{id}/release', 'PUT', props.feedbackHandler);
        addRoute('FbPostResp', '/feedback/{id}/response', 'POST', props.feedbackHandler);
        // ── GradeBook Routes ──
        addRoute('GbGet', '/gradebook', 'GET', props.gradebookHandler);
        addRoute('GbSync', '/gradebook/sync', 'GET', props.gradebookHandler);
        // ── Upload Routes ──
        addRoute('UpTeaching', '/upload/teaching', 'POST', props.uploadHandler);
        addRoute('UpDel', '/upload/deliverable/{deliverableId}', 'POST', props.uploadHandler);
        addRoute('UpSub', '/upload/submission/{deliverableId}/{studentId}', 'POST', props.uploadHandler);
        addRoute('UpDl', '/download', 'POST', props.uploadHandler);
    }
}
exports.ApiIntegrationConstruct = ApiIntegrationConstruct;
//# sourceMappingURL=api-integration.construct.js.map