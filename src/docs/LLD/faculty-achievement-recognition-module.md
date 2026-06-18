# [LLD] [Template] PRAJNA — Low-Level Design Document

Status: Not started

## **Faculty Achievement & Recognition Module**

**Version:** 1.0
**Date:** 04-06-2026
**Author:** Harshitha Reddy
**Reviewer:** Greeshmitha
**Status:** Draft | In Review | Approved

## 1. Module Overview

## **Purpose**

The Faculty Achievement Module is responsible for storing ,managing, and retrieving faculty achievement and recognition data across the institution.

The module acts as a centralized repository for faculty achievements and recognition records and provides data to downstream modules such as dashboards, reporting, and APAR systems.

## **Objectives**

- Maintain a centralized repository for faculty achievements and recognition records.
- Enable efficient retrieval of achievement and recognition data for reporting, dashboarding, and analytics.
- Support campus, school, and department-level filtering and aggregation of achievement data.
- Provide secure storage and management of supporting achievement documents.
- Publish achievement-related events for consumption by downstream PRAJNA modules.

## 2. Scope

### In Scope

### **Achievement Management**

- Create achievements
- Edit achievements
- View achievements
- Delete achievements
- Search achievements

### **Document Management**

- Upload supporting documents
- Validate uploaded files
- Store files securely in S3
- Retrieve uploaded documents

### Achievement Data Management

- Create achievements
- Update achievements
- View achievements
- Delete achievements

### Recognition Data Management

- Create recognition records
- Update recognition records
- View recognition records
- Search recognition records

### **Reporting Support**

- Dashboard integration
- Institutional reporting
- APAR integration

### Out of Scope

Approval Workflow Orchestration
Recognition Eligibility Calculation
Recognition Recommendation Logic
Notification Processing

## 3. Dependencies

### Depends On (modules this needs to work)

### **1. Faculty Profile Module**

- Provides faculty details (Faculty ID, campus, school, department, role).
- Used to validate faculty identity and retrieve standardized faculty metadata.

### **2. Authentication & Authorization (Cognito / IAM)**

- Provides user authentication and JWT validation.
- Enforces role-based access control (Faculty, HoD, Admin).

### **3. Notification Service**

- Consumes achievement and recognition events published through Amazon EventBridge.
- Responsible for sending email and in-app notifications based on subscribed events.

### **4. APAR Module**

- Provides performance appraisal framework.
- Uses achievement and recognition data for evaluation scoring.

### **5. Reporting & Analytics Module**

- Provides reporting dashboards and analytics pipelines.
- Uses achievement and recognition data for institutional reports.

### **6. Dashboard Module**

- Provides UI for Faculty, HoD, and Admin.
- Displays achievements, recognitions, and related faculty activity information.

### **7. EventBridge (AWS)**

- Provides event-driven communication backbone.
- Used to publish and route achievement/recognition events.

### Depended By (modules that need this to work)

### **1. Notification Service**

- Consumes achievement and recognition events.
- Sends real-time alerts to users.

### **2. Dashboard Module**

- Consumes achievement and recognition data.
- Displays real-time status updates.

### **3. APAR Module**

- Consumes achievements and recognition data.
- Uses data for appraisal calculations.

### **4. Reporting & Analytics Module**

- Consumes historical achievement and recognition events.
- Generates institutional insights and reports.

### **5. Admin Module**

- Consumes achievement and recognition data.
- Used for institutional monitoring and oversight.

### **6. Event Consumers (via EventBridge)**

- Consumes events like:
    - AchievementCreated
    - AchievementUpdated
    - RecognitionCreated
- Enables asynchronous processing across systems.

## 4. Architecture & Design

### Component Diagram

The Faculty Achievement & Recognition Module follows a serverless data-centric architecture built using AWS services. It focuses on managing faculty achievement and recognition data and integrates with external modules through EventBridge for downstream processing.

### **Components Involved**

- API Gateway → Entry point for all requests
- Lambda Functions → Achievement and recognition data management layer
- DynamoDB → Persistent storage for achievements and recognitions
- S3 → Stores supporting documents (certificates, proofs)
- EventBridge → Event routing between services
- Cognito → Authentication and authorization
- Notification Service → Consumes achievement events
- Dashboard Module → Displays achievement and recognition data
- APAR Module → Consumes achievement and recognition data for appraisal
- Reporting Module → Generates analytics and reports

### **Component Interaction Flow**

```
Faculty
   │
   ▼
API Gateway
   │
   ▼
Lambda (Achievement Management)
   │
   ├──────────────► DynamoDB (Faculty Achievement Data)
   │
   ├──────────────► S3 (Supporting Documents)
   │
   ▼
EventBridge
   │
   ├──► Dashboard Module
   ├──► APAR Module
   ├──► Reporting Module
   ├──► Approval Workflow Module
   └──► Notification Service
   └──► Reporting Module
```

### Data Flow

The data flow describes how faculty achievement data is created, stored, and shared with downstream PRAJNA modules.

### **Step 1: Achievement Creation**

- Faculty submits achievement via API Gateway.
- Request is validated using Cognito authentication.
- Achievement Lambda processes the request.
- A unique Achievement ID is generated.
- Data is stored in DynamoDB.

### **Step 2: Document Upload**

- Faculty uploads supporting documents.
- Upload Lambda generates pre-signed S3 URL.
- File is directly uploaded to S3.
- S3 path is linked to DynamoDB record.

### **Step 3: Event Triggering**

- After successful submission, an event is published:
    - **`AchievementSubmitted`**
- EventBridge routes the event to consumers.

### Step 4: External Workflow Consumption

- Approval Workflow Module consumes **`AchievementSubmitted`** events from EventBridge.
- Approval processing is handled outside the Faculty Achievement Module.
- The Faculty Achievement Module does not orchestrate the approval steps.
- The module publishes submission and update events, and downstream workflow services manage state transitions.

### **Step 5: Recognition Data Storage**

- Recognition records generated by external PRAJNA modules may be stored and retrieved through the Faculty Achievement Module for reporting and dashboard consumption.

### **Step 6: Downstream Consumption**

- Notification Service → sends alerts
- Dashboard Module → updates UI in real-time
- APAR Module → includes achievement data in appraisal scoring
- Reporting Module → updates analytics

## 5. Data Model

### Entities

### **1. FacultyAchievement Table**

### **Purpose**

Stores all achievement records submitted by faculty members.

### **Schema**

| Field | Type | Constraints | Description |
| --- | --- | --- | --- |
| PK | String | Required | `CAMPUS#{campus}` |
| SK | String | Required | `FACULTY#{facultyId}#ACHIEVEMENT#{achievementId}` |
| achievementId | String | Unique | System-generated achievement ID |
| facultyId | String | Required | Faculty identifier |
| campus | String | Required | Campus identifier |
| school | String | Required | School name/code |
| department | String | Required | Department name/code |
| role | String | Required | Faculty role/designation (Assistant Professor, Associate Professor, Professor, etc.) |
| moduleId | String | Required | Source module identifier |
| title | String | Required | Achievement title |
| description | String | Optional | Detailed description |
| achievementType | String | Required | Award / Publication / Patent / Certification, etc. |
| achievementDate | String | Required | ISO date format (`YYYY-MM-DD`) |
| proofUrl | String | Optional | S3 document link |
| createdAt | String | Required | Record creation timestamp |
| updatedAt | String | Required | Record last updated timestamp |

### **Constraints**

- **`achievementId`** must be unique globally.
- **`facultyId`** must exist in Faculty Profile Module.
- **`campus`**, **`school`**, **`department`**, and **`moduleId`** are mandatory
- **`achievementDate`** cannot be a future date.
- **`proofUrl`** must reference a valid S3 object if provided

### **Relationships**

| Relationship | Description |
| --- | --- |
| Faculty Profile → Faculty Achievement | One Faculty can have many Achievements |
| Faculty Achievement → S3 Documents | One Achievement can have multiple supporting documents |
| Faculty Achievement → Recognition Records | Linked through `achievementId` for recognition tracking |
| Reporting & Dashboard Modules | Consume achievement data for analytics and visualization |

### **2. Faculty Recognition Table**

### **Purpose**

Stores recognition details associated with faculty achievements.

### **Schema**

| **Field** | **Type** | **Constraints** | **Description** |
| --- | --- | --- | --- |
| recognitionId | String | Required | Unique ID |
| facultyId | String | Required | Faculty reference |
| achievementId | String | Required | Source achievement |
| recognitionLevel | String | Required | Bronze / Silver / Gold / Platinum |
| recognitionStatus | String | Required | ACTIVE / INACTIVE / ARCHIVED |
| recognizedBy | String | Optional | Admin ID |
| recognizedDate | String | Optional | Timestamp |
| remarks | String | Optional | Admin comments |

### **Constraints**

- Recognition records are associated with valid achievement records.
- Recognition creation rules are governed by external business processes.

### **Relationships**

- Linked to FacultyAchievement (1:1 or 1:N depending on policy)
- Consumed by Reporting & APAR modules

### Access Patterns

The data model is designed around real query needs, not just storage.

## **AP1: Get all achievements for a faculty**

### **Business Need**

Faculty dashboard needs full achievement history.

### **Query Pattern**

```
GSI1PK = FACULTY#{facultyId}
```

### **Result**

Returns all achievements sorted by SK (latest or oldest based on design).

## **AP2: Get specific achievement**

### **Business Need**

View detailed achievement record.

### **Query Pattern**

```
PK = CAMPUS#{campus}
SK = FACULTY#{facultyId}#ACHIEVEMENT#{achievementId}
```

## **AP3: Get recognition records**

### **Business Need**

View recognition records associated with achievements.

### **Query Pattern**

```
achievementId = ACH123
```

## **AP4: Get achievements by type**

### **Business Need**

Analytics (e.g., publications vs awards distribution).

### **Query Pattern**

```
achievementType = "PUBLICATION"
```

### **Index Used**

**`AchievementTypeIndex`**

## **AP5: Get recognition history for faculty**

### **Business Need**

Faculty profile page shows recognitions.

### **Query Pattern**

```
facultyId = FAC123
```

`Query recognition records using`:

- **`facultyId`**

## 6. API Design

### Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/v1/achievements/{facultyId}` | Get all achievements of a faculty | Yes | None | List of achievements |
| PUT | `/api/v1/achievements/{achievementId}` | Update an achievement | Yes (Faculty) | title, description | Success message |
| DELETE | `/api/v1/achievements/{achievementId}` | Soft delete an achievement | Yes (Faculty) | None | Success message |
| GET | `/api/v1/recognitions` | Get recognition records | Yes | None | List of recognitions |

### Error Handling

The module follows a standardized error response format across all APIs.

### **Error Response Structure**

```
JSON

{
  "errorCode":"STRING",
  "message":"Human readable message",
  "timestamp":"ISO-8601 format",
  "path":"API endpoint"
}
```

## **Common Error Codes**

| **Error Code** | **Description** |
| --- | --- |
| INVALID_REQUEST | Missing or invalid input data |
| UNAUTHORIZED | Missing/invalid JWT token |
| FORBIDDEN | Insufficient role permissions |
| ACHIEVEMENT_NOT_FOUND | Requested record not found |
| FACULTY_NOT_FOUND | Invalid faculty ID |
| INTERNAL_SERVER_ERROR | Unexpected system failure |

## **HTTP Status Codes**

| **Status Code** | **Meaning** |
| --- | --- |
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## 7. Technology Choices

Each technology is selected to ensure scalability, maintainability, and alignment with AWS serverless architecture principles.

| Area | Choice | Why This Choice | Alternatives Considered |
| --- | --- | --- | --- |
| Compute | AWS Lambda | Fully serverless, auto-scaling, pay-per-use, no server management required | EC2 (requires server management), ECS (container overhead) |
| API Layer | Amazon API Gateway | Native integration with Lambda, secure, supports throttling, authentication | ALB (less API-focused), custom Node.js server |
| Database | Amazon DynamoDB | Highly scalable NoSQL, low latency, supports key-value access patterns | RDS (complex joins, scaling issues), MongoDB Atlas |
| Storage | Amazon S3 | Highly durable, scalable object storage for documents | EFS (higher cost), local storage (not scalable) |
| Authentication | AWS Cognito | Built-in user pools, JWT support, easy RBAC integration | Custom auth service, Auth0 |
| Eventing | Amazon EventBridge | Decoupled event-driven architecture, easy integration with AWS services | SNS/SQS (less flexible routing), direct Lambda calls |
| Monitoring | CloudWatch | Native AWS logging, metrics, alarms, centralized monitoring | ELK stack (requires setup/maintenance), Datadog |
| Infrastructure as Code | AWS CDK | Code-based infrastructure, reusable constructs, faster deployments | CloudFormation (verbose), Terraform (external tool) |
| Notification System | AWS SNS / Email service | Scalable pub-sub notifications, easy integration with Lambda | Custom email service, third-party services |
| Security | IAM + Cognito RBAC | Fine-grained access control, secure token-based authentication | Custom role system (complex, error-prone) |

## 8. Security Considerations

### **1. Authentication / Authorization**

### **Authentication**

- Implemented using **AWS Cognito**
- All users authenticate using **JWT tokens**
- Token is validated at **API Gateway + Lambda layer**

### **Authorization (RBAC Model)**

Role-based access control is enforced for all APIs:

| **Role** | **Permissions** |
| --- | --- |
| Faculty | Create, view, update own achievements |
| HoD | View department-level achievement and recognition data |
| Dean | View department-level data |
| Admin | View and manage achievement and recognition data |
| Director | Institution-wide visibility |

### **Enforcement Points**

- API Gateway authorizer (JWT validation)
- Lambda-level role verification
- IAM policies for AWS service access

### **2. Data Privacy**

### **Faculty**

- Can view only their own achievements
- Cannot access other faculty data

### **HoD**

- Can view all achievements within their department
- Can view achievement and recognition data within their department

### **Admin**

- Can view all achievements and recognition data
- Can manage recognition lifecycle

### **Director / Leadership**

- Read-only access to institution-wide reports and analytics

### **System-Level Access**

- Only backend Lambdas can directly access DynamoDB and S3
- No direct database access for users

### **3. Input Validation Approach**

### **At API Gateway Level**

- Schema validation for required fields
- Request size limits enforced
- Content-type validation (JSON only)

### **At Lambda Level**

- Business rule validation (e.g., date checks, status checks)
- Mandatory field verification
- Enum validation (achievementType, status fields)

### **Examples of Validation Rules**

| **Field** | **Rule** |
| --- | --- |
| achievementDate | Cannot be future date |
| title | Non-empty, max length enforced |
| achievementType | Must match predefined enum |
| proofUrl | Must be valid S3 URL format |

### **4. Sensitive Data Handling**

### **Data at Rest**

- DynamoDB → AES-256 encryption enabled
- S3 → Server-side encryption (SSE-S3 / SSE-KMS)

### **Data in Transit**

- All communication over HTTPS (TLS 1.2+)
- API Gateway enforces secure transport

### **Sensitive Fields**

| **Field** | **Protection** |
| --- | --- |
| JWT Token | Cognito-managed, short-lived |
| Faculty personal data | Access restricted via RBAC |
| Documents (certificates) | Stored in private S3 bucket |
| Recognition data | Restricted to authorized administrative roles |

### **Access Control for S3**

- Pre-signed URLs used for upload/download
- No public bucket access
- IAM role-based access for Lambda only

## **5. Audit & Monitoring**

- All actions logged in **CloudWatch Logs**
- Critical operations tracked via **CloudTrail**

Monitoring

- Application logs stored in CloudWatch Logs.
- Operational metrics monitored through CloudWatch.
- CloudTrail used for AWS resource-level monitoring.

## 9. Testing Strategy

| Type | What You’ll Test | Tool / Approach |
| --- | --- | --- |
| Unit Testing | Lambda business logic (achievement creation, validation, recognition rules), input validation, status transitions | `Jest / ts-jest,`local Lambda testing |
| Integration Testing | API Gateway → Lambda integration, Lambda → DynamoDB, Lambda → S3, Lambda → EventBridge | AWS SAM CLI, Testcontainers, Postman |
| End-to-End (E2E) Testing | Achievement submission → Event publication → Recognition data processing → Notification → Dashboard update | Postman collections, Cypress (UI validation), staged AWS environment |
| Security Testing | JWT validation, RBAC enforcement, unauthorized access attempts | OWASP ZAP, Postman negative testing |
| Performance Testing | High concurrent submissions, bulk achievement processing, Lambda cold start behavior | JMeter / AWS Load Testing tools |
| Event Testing | EventBridge event publishing and consumption correctness | CloudWatch logs + event replay testing |

### **Detailed Testing Flow**

### **1. Unit Testing**

- Each Lambda function is tested independently.
- Focus on:
    - Achievement validation logic
    - Recognition data validation
    - Input validation
    - Edge cases (null values, invalid enums)
- External dependencies are mocked.

### **2. Integration Testing**

- Validates interaction between AWS services.
- Covers:
    - API Gateway → Lambda invocation
    - Lambda → DynamoDB write/read
    - Lambda → S3 upload reference
    - Lambda → EventBridge event publishing

### **3. End-to-End Testing**

- Simulates real user workflow:

```
Faculty submits achievement
→ System validates request
→ Data stored in DynamoDB
→ Event published to EventBridge
→ Downstream modules consume event
→ Dashboard updated
```

- Ensures full system consistency across modules.

## 10. CDK / Infrastructure

### **1. AWS Resources Used**

| **Resource** | **Purpose** |
| --- | --- |
| API Gateway | Exposes REST APIs for achievements and recognition workflows |
| AWS Lambda | AWS Lambda | Executes business logic (achievement, recognition, upload) |
| DynamoDB | Stores achievement and recognition data |
| S3 Bucket | Stores supporting documents (certificates, proofs) |
| EventBridge | Handles event-driven communication between services |
| Cognito User Pool | Provides authentication and authorization |
| CloudWatch | Logging, monitoring, and alarms |
| IAM Roles | Secure access control between services |

#### Cross-Module Resource Sharing

Resources such as DynamoDB table names, EventBridge bus names, and API endpoints will be shared using AWS Systems Manager Parameter Store (SSM).

This avoids direct CloudFormation Export/Import dependencies between modules.

### **2. CDK Stack Design**

### **Stack Name**

**`AchievementRecognitionStack`**

### **3. CDK Constructs Breakdown**

### **1. API Gateway Construct**

- Defines REST endpoints for:
    - Achievements APIs
    - Recognition APIs
- Integrated with Cognito authorizer

### **2. Lambda Construct**

Creates multiple Lambda functions:

| Lambda | Responsibility |
| --- | --- |
| AchievementLambda | Create, update, delete achievements |
| RecognitionDataLambda | Create, update, and retrieve recognition records |
| UploadLambda | Generate S3 pre-signed URLs |

### **3. DynamoDB Construct**

Defines tables:

- **`FacultyAchievementTable`**
- **`FacultyRecognitionTable`**

Key features:

- Partition + Sort key design
- GSIs for access patterns
- Point-in-time recovery enabled

### **4. S3 Construct**

- Private bucket for document storage
- Folder structure:
    - **`/certificates/`**
    - **`/awards/`**
    - **`/membership-docs/`**
- Encryption enabled (SSE-S3 / SSE-KMS)

### **5. EventBridge Construct**

- Event bus for:
    - AchievementCreated
    - AchievementUpdated
    - RecognitionGenerated
- Rules route events to:
    - Notification service
    - Reporting module
    - APAR module

### **6. Cognito Construct**

- User pool for authentication
- User groups:
    - Faculty
    - HoD
    - Admin
    - Director
- JWT-based authentication integrated with API Gateway

### **7. CloudWatch Construct**

- Centralized logging for Lambdas
- Alarms for:
    - Lambda failures
    - High latency
    - Event delivery failures

### **4. CDK Stack Structure**

```

lib/
 ├── achievement-stack.ts
 ├── constructs/
 │     ├── api-gateway.construct.ts
 │     ├── lambda.construct.ts
 │     ├── dynamodb.construct.ts
 │     ├── s3.construct.ts
 │     ├── eventbridge.construct.ts
 │     ├── cognito.construct.ts
 │     └── monitoring.construct.ts
```

---

### **5. Stack Inputs (Parameters)**

| **Parameter** | **Description** |
| --- | --- |
| environment | dev / staging / prod |
| tableNamePrefix | Prefix for DynamoDB tables |
| bucketName | S3 bucket name |
| logRetentionDays | CloudWatch log retention policy |
| enableVersioning | Enables S3 versioning |

### **6. Stack Outputs**

| **Output** | **Description** |
| --- | --- |
| API Endpoint URL | Base URL for all APIs |
| Cognito User Pool ID | Authentication reference |
| DynamoDB Table Names | Achievement & Recognition tables |
| S3 Bucket Name | Document storage bucket |
| EventBridge Bus Name | Event routing bus |

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| High Lambda traffic during peak submission periods | Increased latency, throttling, possible request failures | Use AWS Lambda auto-scaling, reserved concurrency, and API Gateway throttling |
| Duplicate achievement submissions | Data inconsistency and incorrect reporting | Implement idempotency using `achievementId` + request hash validation |
| EventBridge delivery failure | Missed notifications and downstream processing failures | Enable retry policies, Dead Letter Queues (DLQ), and event replay mechanisms |
| Large file uploads to S3 | Slow uploads or timeout issues | Use pre-signed URLs with direct-to-S3 uploads and multipart upload support |
| Unauthorized data access | Data leakage or security breach | Enforce Cognito RBAC, IAM least privilege, and API Gateway authorizers |
| DynamoDB hot partition (frequent access to same faculty partition) | Performance degradation | Use well-distributed partition keys and introduce access pattern optimization |
| Lambda cold start latency | Increased response time for first request | Use provisioned concurrency for critical Lambdas |
| Event processing failure in downstream systems | Data inconsistency across modules | Use EventBridge retry policies and Dead Letter Queues (DLQ) |
| Schema evolution issues in DynamoDB | Backward compatibility problems | Use flexible schema design and versioned attributes |

---

## 12. Milestones & Timeline

| Week | Deliverable |
| --- | --- |
| Week 1–2 | Finalize LLD, architecture design, and approval from stakeholders |
| Week 3–4 | Setup AWS infrastructure using CDK (API Gateway, Lambda, DynamoDB, S3, Cognito) |
| Week 5–6 | Develop core APIs (Achievement CRUD, authentication, validation flows) |
| Week 7–8 | Implement EventBridge-based event publishing and integration |
| Week 9–10 | Build recognition engine and integrate with APAR + Reporting modules |
| Week 11–12 | End-to-end testing, performance testing, security validation, and production deployment |

## 13. Open Questions

1. Should updates to achievements overwrite existing records or maintain version history for audit purposes?
2. Can a single achievement generate multiple recognitions, or should it be limited to one recognition per achievement?
3. Should all inter-service communication strictly use EventBridge, or are direct Lambda-to-Lambda calls allowed in some cases?
4. What should be the data retention policy for achievements and recognitions (short-term storage vs long-term archival)?
5. Should S3 store all submitted document versions or only the latest version?
6. What kinds of notifications are required—only event-based notifications or also reminders and periodic summaries?
7. Should RBAC be strictly role-based, or should it also include attribute-based access control (e.g., department-level restrictions)?
8. What is the expected system scale (number of faculty, monthly submissions, concurrent users) to fine-tune performance and capacity decisions?

## 14. Self-Assessment — Amazon Leadership Principles

| # | Leadership Principle | Demonstrated / Need to Work On | Example from Your Work |
| --- | --- | --- | --- |
| 1 | Customer Obsession | Demonstrated | Designed the module for faculty, HoD, and admin ease of use with simple achievement submission, tracking, and real-time status updates. |
| 2 | Ownership | Demonstrated | Took end-to-end responsibility of the module including APIs, data model, architecture, security, and CDK infrastructure. |
| 3 | Invent and Simplify | Demonstrated | Simplified achievement and recognition data integration using an event-driven architecture with EventBridge. |
| 4 | Are Right, A Lot | Need to Work On | Made early assumptions in DynamoDB schema and access patterns without complete workload estimates. |
| 5 | Learn and Be Curious | Demonstrated | Learned and applied AWS services like Lambda, EventBridge, DynamoDB, Cognito, and CDK. |
| 6 | Hire and Develop the Best | Need to Work On | Limited collaboration or mentoring involvement in this module design process. |
| 7 | Insist on the Highest Standards | Demonstrated | Maintained strict validation, secure RBAC, proper error handling, and clean LLD structure. |
| 8 | Think Big | Demonstrated | Designed system to scale across institution-wide usage with extensibility for APAR and analytics integration. |
| 9 | Bias for Action | Need to Work On | Some design decisions (like rule engine design) could have been faster with early prototyping. |
| 10 | Frugality | Demonstrated | Used serverless AWS services (Lambda, DynamoDB, EventBridge) to reduce cost and operational overhead. |
| 11 | Earn Trust | Need to Work On | Could improve by involving stakeholders earlier in design validation and assumptions. |
| 12 | Dive Deep | Demonstrated | Detailed analysis of DynamoDB schema, event flows, and access patterns for scalability. |
| 13 | Have Backbone; Disagree and Commit | Need to Work On | Limited instances of challenging design trade-offs or proposing alternative architectures. |
| 14 | Deliver Results | Demonstrated | Completed full LLD with all required sections within timeline and structured format. |

### **Top 3 I Demonstrated**

### **1. Ownership**

I took complete end-to-end responsibility for designing the Faculty Achievement & Recognition module. This included not just defining APIs and data models, but also thinking through architecture, security, event flows, and deployment strategy. Instead of focusing only on one part, I ensured the entire system works cohesively as a complete production-ready design.

### **2. Think Big**

I designed the module with a long-term institutional vision in mind rather than just solving the immediate problem. The system was structured to scale across departments, campuses, and future integrations like APAR, analytics, and reporting. I also ensured the architecture is flexible enough to support future enhancements like configurable recognition rules and additional workflows without major redesign.

### **3. Dive Deep**

I went into detailed technical aspects such as DynamoDB access patterns, partition key design, event-driven communication using EventBridge, and Lambda responsibilities. I focused on understanding how each component behaves under real-world load and ensured that the design is optimized for scalability, performance, and maintainability instead of staying at a surface-level design.

## **Top 3 I Need to Work On**

### **1. Have Backbone; Disagree and Commit**

I need to improve my confidence in challenging design decisions when I feel there is a better approach. In this project, I mostly aligned with the proposed structure, but I should actively question trade-offs, suggest alternatives, and engage in deeper architectural discussions before finalizing decisions.

### **2. Earn Trust**

I need to strengthen early communication with stakeholders and mentors by validating assumptions earlier in the design phase. While the final design is solid, involving others earlier would help build stronger alignment, reduce rework, and improve confidence in design decisions through shared understanding.

### **3. Hire and Develop the Best**

I need to improve my collaboration and knowledge-sharing mindset. In this module, my focus was mostly on individual design completion. Moving forward, I should actively contribute to peer reviews, help others improve their designs, and share learnings so that the overall team grows together.

## 15. References

| # | Reference | Description |
| --- | --- | --- |
| 1 | HLD Document – PRAJNA System | Used for overall system architecture, module boundaries, and integration understanding |
| 2 | Functional Requirements Document – Faculty Achievement Module | Defines workflows, roles, and business requirements |
| 3 | AWS Lambda Documentation ([https://docs.aws.amazon.com/lambda/](https://docs.aws.amazon.com/lambda/)) | Used for serverless compute design and execution model |
| 4 | Amazon API Gateway Documentation ([https://docs.aws.amazon.com/apigateway/](https://docs.aws.amazon.com/apigateway/)) | Used for REST API design, authentication, and throttling |
| 5 | Amazon DynamoDB Documentation ([https://docs.aws.amazon.com/dynamodb/](https://docs.aws.amazon.com/dynamodb/)) | Used for data modeling, access patterns, and indexing |
| 6 | Amazon S3 Documentation ([https://docs.aws.amazon.com/s3/](https://docs.aws.amazon.com/s3/)) | Used for secure document storage and pre-signed URLs |
| 7 | Amazon Cognito Documentation ([https://docs.aws.amazon.com/cognito/](https://docs.aws.amazon.com/cognito/)) | Used for authentication, JWT, and RBAC implementation |
| 8 | Amazon EventBridge Documentation ([https://docs.aws.amazon.com/eventbridge/](https://docs.aws.amazon.com/eventbridge/)) | Used for event-driven architecture and service decoupling |
| 9 | AWS CDK Documentation ([https://docs.aws.amazon.com/cdk/](https://docs.aws.amazon.com/cdk/)) | Used for infrastructure-as-code and stack design |
| 10 | Amazon CloudWatch Documentation ([https://docs.aws.amazon.com/cloudwatch/](https://docs.aws.amazon.com/cloudwatch/)) | Used for logging, monitoring, and alerts |
| 11 | AWS Well-Architected Framework ([https://docs.aws.amazon.com/wellarchitected/latest/framework/](https://docs.aws.amazon.com/wellarchitected/latest/framework/)) | Used for best practices in scalability, security, and reliability |

*PRAJNA — प्रज्ञा | Super-30*
