"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Main CDK Stack
// Wires all infrastructure components together
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
exports.PrajnaTeachingStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
const dynamodb_construct_1 = require("../constructs/dynamodb.construct");
const eventbridge_construct_1 = require("../constructs/eventbridge.construct");
const lambda_construct_1 = require("../constructs/lambda.construct");
const api_integration_construct_1 = require("../constructs/api-integration.construct");
class PrajnaTeachingStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const { stage } = props;
        // ── External Dependencies (from SSM) ──────────────────────────────────────
        const documentsBucketName = ssm.StringParameter.valueForStringParameter(this, `/prajna/${stage}/storage/documents-bucket-name`);
        // ── DynamoDB (Imports Shared Table) ───────────────────────────────────────
        const database = new dynamodb_construct_1.DynamoDbConstruct(this, 'Database', { stage });
        // ── EventBridge (Imports Shared Bus & Adds Rules) ─────────────────────────
        const eventBridge = new eventbridge_construct_1.EventBridgeConstruct(this, 'EventBridge', { stage });
        // ── Lambda Functions ──────────────────────────────────────────────────────
        const lambdas = new lambda_construct_1.LambdaConstruct(this, 'Lambdas', {
            stage,
            tableName: database.tableName,
            tableArn: database.tableArn,
            eventBusName: eventBridge.eventBusName,
            documentsBucketName,
        });
        // ── API Gateway Integration ───────────────────────────────────────────────
        new api_integration_construct_1.ApiIntegrationConstruct(this, 'ApiIntegration', {
            stage,
            deliverableHandler: lambdas.deliverableHandler,
            submissionHandler: lambdas.submissionHandler,
            uploadHandler: lambdas.uploadHandler,
            feedbackHandler: lambdas.feedbackHandler,
            scheduleHandler: lambdas.scheduleHandler,
            gradebookHandler: lambdas.gradebookHandler,
        });
        // ── Outputs ───────────────────────────────────────────────────────────────
        new cdk.CfnOutput(this, 'DeliverableLambdaArn', {
            value: lambdas.deliverableHandler.functionArn,
            exportName: `Prajna-${stage}-Teaching-DeliverableLambdaArn`,
        });
        new cdk.CfnOutput(this, 'ScheduleLambdaArn', {
            value: lambdas.scheduleHandler.functionArn,
            exportName: `Prajna-${stage}-Teaching-ScheduleLambdaArn`,
        });
    }
}
exports.PrajnaTeachingStack = PrajnaTeachingStack;
//# sourceMappingURL=prajna-teaching.stack.js.map