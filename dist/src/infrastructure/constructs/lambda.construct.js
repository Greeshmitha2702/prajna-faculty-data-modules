"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Lambda Construct
// Creates all Module 8 Lambda functions with shared role and log groups
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
exports.LambdaConstruct = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const constructs_1 = require("constructs");
const foundation_construct_1 = require("./foundation.construct");
class LambdaConstruct extends constructs_1.Construct {
    deliverableHandler;
    submissionHandler;
    uploadHandler;
    feedbackHandler;
    scheduleHandler;
    gradebookHandler;
    sharedRole;
    constructor(scope, id, props) {
        super(scope, id);
        const { stage, tableName, tableArn, eventBusName, documentsBucketName } = props;
        // ── Shared IAM Role ──────────────────────────────────────────────────────
        const roleConstruct = new foundation_construct_1.SharedRole(this, 'LambdaRole', {
            roleName: 'prajna-teaching-lambda',
            stage,
            inlinePolicies: {
                DynamoDBAccess: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                'dynamodb:GetItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:Query',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:TransactWriteItems',
                            ],
                            resources: [
                                tableArn,
                                `${tableArn}/index/*`,
                            ],
                        }),
                    ],
                }),
                EventBridgeAccess: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: ['events:PutEvents'],
                            resources: [`arn:aws:events:ap-south-1:*:event-bus/${eventBusName}`],
                        }),
                    ],
                }),
                S3Access: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: [
                                's3:GetObject',
                                's3:PutObject',
                                's3:DeleteObject',
                                's3:HeadObject',
                            ],
                            resources: [`arn:aws:s3:::${documentsBucketName}/documents/faculty/*`],
                        }),
                        new iam.PolicyStatement({
                            actions: ['s3:GeneratePresignedPost'],
                            resources: [`arn:aws:s3:::${documentsBucketName}`],
                        }),
                    ],
                }),
                SSMAccess: new iam.PolicyDocument({
                    statements: [
                        new iam.PolicyStatement({
                            actions: ['ssm:GetParameter', 'ssm:GetParameters'],
                            resources: [
                                `arn:aws:ssm:ap-south-1:*:parameter/prajna/${stage}/*`,
                            ],
                        }),
                    ],
                }),
            },
        });
        this.sharedRole = roleConstruct.role;
        const commonEnv = {
            DYNAMODB_TABLE_NAME: tableName,
            EVENT_BUS_NAME: eventBusName,
            DOCUMENTS_BUCKET_NAME: documentsBucketName,
            STAGE: stage,
        };
        // ── Lambda Functions ─────────────────────────────────────────────────────
        const makeLogGroup = (name) => new foundation_construct_1.SharedLogGroup(this, `${name}LogGroup`, {
            logGroupName: `module8/${name}`,
            stage,
        }).logGroup;
        const deliverableLog = makeLogGroup('deliverable');
        const submissionLog = makeLogGroup('submission');
        const uploadLog = makeLogGroup('upload');
        const feedbackLog = makeLogGroup('feedback');
        const scheduleLog = makeLogGroup('schedule');
        const gradebookLog = makeLogGroup('gradebook');
        this.deliverableHandler = new foundation_construct_1.SharedLambda(this, 'DeliverableHandler', {
            functionName: 'prajna-teaching-deliverable',
            handlerFile: 'deliverable.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: deliverableLog,
            stage,
        }).fn;
        this.submissionHandler = new foundation_construct_1.SharedLambda(this, 'SubmissionHandler', {
            functionName: 'prajna-teaching-submission',
            handlerFile: 'submission.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: submissionLog,
            stage,
        }).fn;
        this.uploadHandler = new foundation_construct_1.SharedLambda(this, 'UploadHandler', {
            functionName: 'prajna-teaching-upload',
            handlerFile: 'upload.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: uploadLog,
            timeoutSeconds: 15,
            stage,
        }).fn;
        this.feedbackHandler = new foundation_construct_1.SharedLambda(this, 'FeedbackHandler', {
            functionName: 'prajna-teaching-feedback',
            handlerFile: 'feedback.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: feedbackLog,
            stage,
        }).fn;
        this.scheduleHandler = new foundation_construct_1.SharedLambda(this, 'ScheduleHandler', {
            functionName: 'prajna-teaching-schedule',
            handlerFile: 'schedule.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: scheduleLog,
            stage,
        }).fn;
        this.gradebookHandler = new foundation_construct_1.SharedLambda(this, 'GradebookHandler', {
            functionName: 'prajna-teaching-gradebook',
            handlerFile: 'gradebook.handler',
            environment: commonEnv,
            role: this.sharedRole,
            logGroup: gradebookLog,
            memorySize: 512,
            timeoutSeconds: 60,
            stage,
        }).fn;
        // ── Error Rate Alarms ────────────────────────────────────────────────────
        const fns = [
            { fn: this.deliverableHandler, name: 'deliverable' },
            { fn: this.submissionHandler, name: 'submission' },
            { fn: this.feedbackHandler, name: 'feedback' },
            { fn: this.scheduleHandler, name: 'schedule' },
            { fn: this.gradebookHandler, name: 'gradebook' },
        ];
        for (const { fn, name } of fns) {
            fn.metricErrors({ period: cdk.Duration.minutes(5) });
        }
    }
}
exports.LambdaConstruct = LambdaConstruct;
//# sourceMappingURL=lambda.construct.js.map