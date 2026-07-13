"use strict";
// ─────────────────────────────────────────────────────────────────────────────
// PRAJNA Module 8 – DynamoDB Construct
// Imports shared table from Module 5 via SSM (no new table created)
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
exports.DynamoDbConstruct = void 0;
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const ssm = __importStar(require("aws-cdk-lib/aws-ssm"));
const constructs_1 = require("constructs");
class DynamoDbConstruct extends constructs_1.Construct {
    table;
    tableName;
    tableArn;
    constructor(scope, id, props) {
        super(scope, id);
        // Import the shared table name from SSM
        this.tableName = ssm.StringParameter.valueForStringParameter(this, `/prajna/${props.stage}/database/teaching-table-name`);
        // Import the shared table ARN from SSM
        this.tableArn = ssm.StringParameter.valueForStringParameter(this, `/prajna/${props.stage}/database/teaching-table-arn`);
        // Import by name without creating (single-table design from Module 5)
        this.table = dynamodb.Table.fromTableName(this, 'SharedTable', this.tableName);
    }
}
exports.DynamoDbConstruct = DynamoDbConstruct;
//# sourceMappingURL=dynamodb.construct.js.map