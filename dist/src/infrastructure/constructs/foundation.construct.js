"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – Foundation Constructs (SharedLambda, SharedRole, etc.)
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
exports.SharedAlarm = exports.SharedParameter = exports.SharedLogGroup = exports.SharedRole = exports.SharedLambda = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const logs = __importStar(require("aws-cdk-lib/aws-logs"));
const cloudwatch = __importStar(require("aws-cdk-lib/aws-cloudwatch"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
const constructs_1 = require("constructs");
const path = __importStar(require("path"));
class SharedLambda extends constructs_1.Construct {
    fn;
    constructor(scope, id, props) {
        super(scope, id);
        this.fn = new lambda.Function(this, 'Fn', {
            functionName: `${props.functionName}-${props.stage}`,
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: `${props.handlerFile}.handler`,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../../dist/src/handlers')),
            environment: {
                NODE_ENV: props.stage,
                ...props.environment,
            },
            role: props.role,
            logGroup: props.logGroup,
            memorySize: props.memorySize ?? 256,
            timeout: cdk.Duration.seconds(props.timeoutSeconds ?? 30),
            tracing: lambda.Tracing.ACTIVE,
            architecture: lambda.Architecture.ARM_64,
        });
    }
}
exports.SharedLambda = SharedLambda;
class SharedRole extends constructs_1.Construct {
    role;
    constructor(scope, id, props) {
        super(scope, id);
        this.role = new iam.Role(this, 'Role', {
            roleName: `${props.roleName}-${props.stage}`,
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
                ...(props.managedPolicies ?? []),
            ],
            inlinePolicies: props.inlinePolicies ?? {},
        });
    }
}
exports.SharedRole = SharedRole;
class SharedLogGroup extends constructs_1.Construct {
    logGroup;
    constructor(scope, id, props) {
        super(scope, id);
        this.logGroup = new logs.LogGroup(this, 'LogGroup', {
            logGroupName: `/prajna/${props.stage}/${props.logGroupName}`,
            retention: props.stage === 'prod'
                ? logs.RetentionDays.SIX_MONTHS
                : logs.RetentionDays.ONE_WEEK,
            removalPolicy: props.stage === 'prod'
                ? cdk.RemovalPolicy.RETAIN
                : cdk.RemovalPolicy.DESTROY,
        });
    }
}
exports.SharedLogGroup = SharedLogGroup;
class SharedParameter extends constructs_1.Construct {
    parameter;
    constructor(scope, id, props) {
        super(scope, id);
        this.parameter = new ssm.StringParameter(this, 'Param', {
            parameterName: props.parameterName,
            stringValue: props.value,
            description: props.description,
        });
    }
}
exports.SharedParameter = SharedParameter;
class SharedAlarm extends constructs_1.Construct {
    alarm;
    constructor(scope, id, props) {
        super(scope, id);
        this.alarm = new cloudwatch.Alarm(this, 'Alarm', {
            alarmName: `${props.alarmName}-${props.stage}`,
            metric: props.metric,
            threshold: props.threshold,
            evaluationPeriods: props.evaluationPeriods ?? 3,
            treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        });
    }
}
exports.SharedAlarm = SharedAlarm;
//# sourceMappingURL=foundation.construct.js.map