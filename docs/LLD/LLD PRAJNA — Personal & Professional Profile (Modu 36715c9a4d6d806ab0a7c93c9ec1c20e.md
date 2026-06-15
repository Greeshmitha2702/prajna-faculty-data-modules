# LLD PRAJNA — Personal & Professional Profile (Module 7) TEMPLATE

Created by: Greeshmitha Bingumalla
Created time: May 21, 2026 3:44 PM
Category: Planning
Last edited by: Greeshmitha Bingumalla
Last updated time: June 10, 2026 10:48 AM

## Personal & Professional Profile (Module 7)

**Version:** 1.0
**Date:** 04/06/2026
**Author: @Greeshmitha Bingumalla** 
**Reviewer:** Harini
**Status:** In Review

## 1. Module Overview

## What does this module do?

Module 7 — Personal & Professional Profile acts as the authoritative identity and organizational directory service for PRAJNA. It maintains the core personal, academic, professional, and hierarchical metadata associated with faculty members across all campuses.

The module is responsible for storing and managing:

### Personal Information

- Full name
- Email address
- Contact details
- Residential address
- Date of birth
- Profile photograph

### Professional Information

- Employee / Faculty ID
- Date of joining (DOJ)
- Department and school association
- Designation and role hierarchy
- Educational qualifications
    - Degree
    - University
    - Year of completion
- Research interests and current research areas
- Publication-related identifiers
    - ORCID ID
    - Scopus ID
    - Google Scholar ID
    - VIDWAN ID
- Professional certifications and profile documents

This module also maintains the institutional organizational hierarchy structure:

```
Campus
  → School
      → Department
           → Faculty
```

Module 7 serves as the foundational provider module for downstream systems including:

- approval workflows,
- score calculation,
- notifications,
- dashboards,
- reports,
- leaderboard systems,
- and AI personalization services.

The module exposes stable provider APIs for:

- faculty profile retrieval,
- contact lookup,
- approver hierarchy resolution,
- organizational filtering,
- and profile metadata access.

Additionally, the module emits factual domain events (e.g., `FacultyCreated`, `ProfileUpdated`, `RoleChanged`) to EventBridge whenever significant profile or hierarchy changes occur.

## Why does this module exist in PRAJNA?

Module 7 acts as a critical dependency for:

- AI Companion systems (personalized recommendations and nudges),
- PRAJNA Score Engine,
- Leaderboard systems,
- Dashboard modules,
- Approval Workflow Engine,
- Notification systems,
- Report generation modules,
- and faculty analytics workflows.

The module also provides standardized provider APIs and domain events that allow downstream systems to consume faculty metadata in a loosely coupled and scalable manner.

## Who are the end users of this module?

The primary end users of Module 7 are faculty members across all campuses, including users with elevated organizational roles such as:

- HoD (Head of Department),
- Director,
- and Pro Vice-Chancellor (PVC).

Role-specific access controls determine the visibility and management capabilities available to each user type. For example:

- Faculty users can manage only their own profiles,
- HoDs can access department-level faculty information,
- Directors and PVCs can access broader organizational views based on institutional hierarchy.

---

## 2. Scope

### In Scope

- Qualification and certification metadata management
- Organizational hierarchy management
    - Campus
    - School
    - Department
    - Faculty role mapping
- Role-based profile visibility and access control
- Faculty profile retrieval APIs
- Faculty contact lookup APIs for downstream systems
- Approver hierarchy lookup APIs for approval workflows
- Profile completeness metadata generation
- Profile-related document and image upload metadata management using S3
- EventBridge event emission for profile and hierarchy changes
- Dashboard and reporting support queries
- Cross-campus tenant isolation enforcement
- Integration support for:
    - Module 13 — Approval Workflow Engine
    - Module 14 — Score Engine
    - Module 16 — Notification Engine
    - Dashboard modules
    - AI Companion systems

### Out of Scope

| Capability | Owner Module |
| --- | --- |
| Approval workflow orchestration, escalation handling, and approval state management | Module 13 — Approval Workflow Engine |
| PRAJNA score calculation and weighted scoring logic | Module 14 — Score Engine |
| Leaderboard ranking and institutional ranking computation | Module 15 — Leaderboard Engine |
| Email, SMS, and push notification dispatch | Module 16 — Notification Engine |
| Institutional report generation and analytics aggregation | Module 17 — Report Generator |
| Authentication and Cognito JWT issuance | Module 3 — Authentication |
| API Gateway routing, throttling, and authorization middleware | Module 4 — API Gateway |
| DynamoDB table provisioning and infrastructure ownership | Module 5 — Database Infrastructure |
| Physical file storage management | Module 6 — File Storage / S3 Infrastructure |
| AI recommendation generation and conversational workflows | Module 20 — AI Companion |
| Dashboard UI rendering and frontend visualization | Dashboard Modules |
| Faculty publication lifecycle management | Module 9 — Research & Innovation |
| FDP workflow and completion management | Module 11 — Faculty Development & Growth |

The module may emit profile-related events and expose provider APIs to these systems, but it does not implement their business logic internally.

---

## 3. Dependencies

### Depends On

| Module | What it provides |
| --- | --- |
| Module 3 — Authentication | Cognito JWT tokens containing faculty identity, campus, and role claims |
| Module 4 — API Gateway | API routing, request authorization, throttling, and gateway-level validation |
| Module 5 — Database Infrastructure | DynamoDB table provisioning and shared database infrastructure |
| Module 6 — File Storage / S3 Infrastructure | Secure storage for profile photographs, certificates, and profile-related documents |
| Module 19 — Event Bus | EventBridge custom bus (`prajna-event-bus`) for domain event publishing |
| Shared Types / Contracts | Shared enums, role definitions, event contracts, and module identifiers used across PRAJNA |

### Depended On By

| Module | What it consumes |
| --- | --- |
| Module 8 — Course Deliverables & Teaching | Faculty identity, department mapping, designation, role hierarchy, and faculty ownership metadata |
| Module 9 — Research & Innovation | Faculty identity, ORCID ID, Scopus ID, Google Scholar ID, department, designation, and organizational hierarchy |
| Module 10 — Achievements & Recognition | Faculty profile metadata, department/school grouping, and designation details |
| Module 11 — Faculty Development & Growth | Faculty identity, qualification metadata, department mapping, and organizational hierarchy |
| Module 12 — Administrative & Lifecycle | Faculty hierarchy, designation, reporting structure, DOJ, and organizational metadata |
| Module 13 — Approval Workflow Engine | Approver hierarchy lookup APIs, faculty identity, role hierarchy, and campus metadata |
| Module 14 — Score Engine | Profile completeness metadata, faculty hierarchy, role information, and profile update events |
| Module 15 — Leaderboard Engine | Faculty display information including name, designation, department, school, and profile photo metadata |
| Module 16 — Notification Engine | Faculty contact lookup APIs, approver contact resolution, and profile-related events |
| Module 17 — Report Generator | Faculty metadata, organizational hierarchy, department/school grouping, and institutional filtering support |
| Module 18 — APAR Workflow | Reporting hierarchy, designation, organizational structure, and faculty identity metadata |
| Module 20 — AI Companion | Faculty profile metadata, research interests, qualifications, role hierarchy, and profile update events |
| Module 23 — Dynamic To-Do Engine | Profile completeness metadata, role-based profile tasks, and faculty organizational mapping |
| Module 24 — Faculty Dashboard | Faculty profile information, designation, department, school, profile completeness metadata, and profile image metadata |
| Module 25 — HoD Dashboard | Department faculty listings, organizational hierarchy, faculty metadata, and profile completeness summaries |
| Module 26 — Director / PVC Dashboard | School-wide faculty hierarchy, organizational metadata, and institution-level faculty aggregation data |

---

## 4. Architecture & Design

### Component Diagram

The following high-level component interaction flow describes the internal architecture of Module 7 and its interactions with external PRAJNA services.

### Component Diagram

The following diagram represents the high-level internal architecture of Module 7 and the interaction between authentication, validation, authorization, persistence, and event-driven integrations.

![image.png](image.png)

### RBAC: Role Based Access Control

---

## 5. Data Model

### 5.1 Overview

Module 7 uses DynamoDB as the primary persistence layer and follows an access-pattern-driven schema design. The data model is optimized for:

- faculty profile lookups,
- organizational hierarchy queries,
- approver resolution,
- dashboard aggregation,
- and profile metadata retrieval.

The module follows a single-table design approach to support scalable and efficient query patterns while maintaining campus-level tenant isolation.

Recommended primary key structure:

```
PK = CAMPUS#<campus>
SK = FACULTY#<facultyId>
```

---

## 5.2 Keys and Indexes

### Primary Table Keys

| Key | Purpose |
| --- | --- |
| PK | Groups data by campus for tenant isolation |
| SK | Uniquely identifies faculty records within a campus |

Example:

```
PK = CAMPUS#BENGALURU
SK = FACULTY#FAC123
```

---

### Global Secondary Indexes (GSIs)

| Index | Purpose | Example |
| --- | --- | --- |
| GSI1 | Department-wise faculty lookup | `CAMPUS#BENGALURU#DEPARTMENT#CSE` |
| GSI2 | School-wise faculty lookup | `CAMPUS#BENGALURU#SCHOOL#ENGINEERING` |
| GSI3 | Role-based faculty lookup and approver resolution | `CAMPUS#BENGALURU#ROLE#HOD` |

---

### Why DynamoDB Was Chosen

DynamoDB was selected over Aurora because:

- the module is query-driven rather than join-heavy,
- the architecture is serverless-oriented,
- the system requires high scalability,
- and most access patterns involve direct lookups and filtered aggregation queries.

The schema is designed around access patterns rather than normalization-first relational modeling.

### Entities

## 1. FacultyProfile Entity

The `FacultyProfile` entity acts as the primary identity and organizational record for faculty members.

| Field | Type | Constraints / Notes |
| --- | --- | --- |
| facultyId | string | Unique faculty identifier |
| campus | string | Mandatory tenant isolation field |
| school | string | Mandatory organizational grouping |
| department | string | Mandatory department mapping |
| role | enum | FACULTY / HOD / DEAN / DIRECTOR / PVC |
| designation | string | Academic designation |
| firstName | string | Required |
| lastName | string | Required |
| email | string | Unique institutional email |
| contactNumber | string | Validated phone format |
| address | object | Residential address metadata |
| dob | string | ISO date format |
| doj | string | ISO date format |
| profilePhotoUrl | string | S3 object reference |
| researchInterests | string[] | Optional |
| orcidId | string | Optional unique research identifier |
| scopusId | string | Optional |
| googleScholarId | string | Optional |
| vidwanId | string | Optional |
| profileCompletionPercentage | number | Metadata only, not PRAJNA score |
| createdAt | string | ISO timestamp |
| updatedAt | string | ISO timestamp |

---

## 2. Qualification Entity

Qualification metadata is embedded within the faculty profile record.

| Field | Type | Constraints / Notes |
| --- | --- | --- |
| degree | string | Mandatory |
| specialization | string | Optional |
| university | string | Mandatory |
| yearOfCompletion | number | Valid graduation year |
| certificateUrl | string | S3 object reference |

Example:

```json
{
  "degree": "PhD",
  "specialization": "Artificial Intelligence",
  "university": "IIT Hyderabad",
  "yearOfCompletion": 2021
}
```

---

## Relationships

| Relationship | Description |
| --- | --- |
| One Campus → Many Schools | Organizational grouping |
| One School → Many Departments | Academic hierarchy |
| One Department → Many Faculty | Faculty ownership grouping |
| One Faculty → Many Qualifications | Embedded qualification metadata |

### Access Patterns

| Access Pattern | Consumer(s) | Query Strategy |
| --- | --- | --- |
| Get faculty profile by facultyId | Faculty Dashboard, AI Companion | Main table query using PK + SK |
| Get faculty contact details | Notification Engine | Main table query |
| Get all faculty in department | HoD Dashboard, Reports | GSI1 |
| Get all faculty in school | Director Dashboard, Analytics | GSI2 |
| Get approver by role | Approval Workflow Engine | GSI3 |
| Get all HoDs | Admin Dashboard, Approval Engine | GSI3 using `ROLE#HOD` |
| Get faculty hierarchy | APAR Workflow, Approval Engine | Main table + Role GSI |

---

## 6. API Design

### API Design Principles

All APIs are routed through API Gateway and protected using Cognito JWT authentication.

---

### Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| --- | --- | --- | --- | --- | --- |
| GET | `/faculty/me` | Fetch logged-in faculty profile | Yes | None | Faculty profile metadata |
| GET | `/faculty/{facultyId}` | Fetch faculty profile by facultyId | Yes | None | Faculty profile |
| PUT | `/faculty/profile` | Update faculty personal/professional profile | Yes | Profile update payload | Updated profile response |
| PATCH | `/faculty/profile/photo` | Update profile photo metadata | Yes | S3 object metadata | Updated photo URL |
| GET | `/faculty/{facultyId}/contact` | Fetch faculty contact details | Yes | None | Email and contact metadata |
| GET | `/faculty/department/{department}` | Fetch all faculty in a department | Yes | None | Faculty list |
| GET | `/faculty/school/{school}` | Fetch all faculty in a school | Yes | None | Faculty list |
| GET | `/faculty/role/{role}` | Fetch faculty by role (HoD, Dean, etc.) | Yes | None | Faculty list |
| GET | `/faculty/approver` | Resolve approver hierarchy for current faculty | Yes | None | Approver metadata |
| GET | `/faculty/{facultyId}/qualifications` | Fetch qualification metadata | Yes | None | Qualification list |
| POST | `/faculty/qualification` | Add qualification metadata | Yes | Qualification payload | Created qualification response |
| GET | `/faculty/orcid/{orcidId}` | Find faculty using ORCID ID | Yes | None | Faculty metadata |
| GET | `/faculty/hierarchy` | Fetch organizational hierarchy metadata | Yes | None | Campus-school-department hierarchy |
| GET | `/faculty/designation/{designation}` | Fetch faculty by designation | Yes | None | Faculty list |

---

### Example Request — Update Profile

```
PUT /faculty/profile
Authorization: Bearer <JWT>
```

Request Body:

```json
{
  "designation": "Associate Professor",
  "researchInterests": [
    "Artificial Intelligence",
    "Distributed Systems"
  ]
}
```

---

### Example Response

```json
{
  "status": "SUCCESS",
  "facultyId": "FAC123",
  "updatedAt": "2026-06-04T10:30:00Z"
}
```

---

### Authorization Rules

| Role | Allowed Operations |
| --- | --- |
| FACULTY | Manage own profile |
| HOD | View department faculty profiles |
| DEAN | View school-level faculty metadata |
| DIRECTOR | View campus-level metadata |
| PVC | Institution-level visibility |

Cross-campus access requests are rejected.

---

### API Response Standards

All APIs follow standardized response contracts:

Success:

```json
{
  "status": "SUCCESS",
  "data": {}
}
```

Failure:

```json
{
  "status": "ERROR",
  "errorCode": "UNAUTHORIZED",
  "message": "Access denied"
}
```

### Error Handling

Module 7 follows a centralized and standardized error handling strategy to ensure:

- consistent API behavior,
- secure error reporting,
- predictable client integration,
- and easier debugging across PRAJNA services.

The module categorizes errors into:

- validation errors,
- authorization errors,
- business rule violations,
- resource lookup failures,
- infrastructure failures,
- and downstream integration failures.

---

## Error Handling Flow

```
Request
   │
   ▼
Validation Layer
   │
   ├── Invalid Payload → 400 Bad Request
   │
   ▼
Authorization Layer
   │
   ├── Unauthorized Access → 401 Unauthorized
   ├── Campus Violation → 403 Forbidden
   │
   ▼
Service Layer
   │
   ├── Business Rule Failure → 409 Conflict
   ├── Resource Not Found → 404 Not Found
   │
   ▼
Persistence / Infrastructure Layer
   │
   ├── DynamoDB Failure → 500 Internal Server Error
   ├── EventBridge Failure → 502 Bad Gateway
   │
   ▼
Standardized Error Response
```

---

## Standard Error Response Format

All API failures return standardized responses.

Example:

```json
{
  "status": "ERROR",
  "errorCode": "PROFILE_NOT_FOUND",
  "message": "Faculty profile does not exist",
  "requestId": "req-12345"
}
```

---

## Common Error Codes

| Error Code | HTTP Status | Description |
| --- | --- | --- |
| INVALID_PAYLOAD | 400 | Request body validation failed |
| INVALID_ORCID_FORMAT | 400 | ORCID format is invalid |
| INVALID_PHONE_NUMBER | 400 | Contact number format invalid |
| UNAUTHORIZED | 401 | JWT missing or invalid |
| FORBIDDEN | 403 | Role-based access denied |
| CAMPUS_MISMATCH | 403 | Cross-campus access attempted |
| PROFILE_NOT_FOUND | 404 | Faculty profile does not exist |
| QUALIFICATION_NOT_FOUND | 404 | Qualification metadata missing |
| DUPLICATE_PROFILE | 409 | Faculty profile already exists |
| DUPLICATE_ORCID | 409 | ORCID already mapped to another faculty |
| INVALID_ROLE_ASSIGNMENT | 409 | Role hierarchy conflict detected |
| DATABASE_ERROR | 500 | DynamoDB operation failure |
| FILE_UPLOAD_ERROR | 500 | S3 metadata persistence failure |
| EVENT_PUBLISH_FAILURE | 502 | EventBridge event emission failed |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server failure |

---

## Validation Errors

Validation failures are handled before business logic execution.

Examples:

- missing mandatory fields,
- invalid email format,
- malformed ORCID IDs,
- invalid graduation year,
- unsupported file types.

Validation errors return descriptive but non-sensitive messages.

---

## Authorization Errors

Authorization layer validates:

- JWT authenticity,
- role permissions,
- campus isolation,
- profile ownership.

Examples:

- faculty attempting to edit another faculty profile,
- HoD attempting cross-school access,
- cross-campus access attempts.

Sensitive authorization details are never exposed in responses.

---

## Infrastructure Error Handling

Infrastructure failures are:

- logged internally,
- masked from end users,
- and mapped to standardized responses.

This includes failures from:

- DynamoDB,
- S3,
- EventBridge,
- and downstream service integrations.

Retryable operations such as event publishing may use exponential backoff and dead-letter queue (DLQ) handling.

---

## Logging and Observability

All errors are logged with:

- requestId,
- facultyId,
- moduleId,
- timestamp,
- and operation metadata.

Sensitive information such as:

- JWT tokens,
- passwords,
- personal addresses,
- and contact details

must never be written to logs.

CloudWatch is used for:

- centralized logging,
- metric generation,
- and operational monitoring.

---

## 7. Technology Choices

For each technology decision, the module prioritizes:

- scalability,
- loose coupling,
- serverless compatibility,
- maintainability,
- and alignment with PRAJNA architecture standards.

| Area | Choice | Why | Alternatives Considered |
| --- | --- | --- | --- |
| Programming Language | TypeScript 5.x | Strong typing, better maintainability, shared interfaces/contracts, improved scalability for enterprise backend systems | JavaScript |
| Runtime | Node.js 20.x | Lightweight serverless execution, fast cold starts, strong AWS Lambda support | Java Spring Boot, Python |
| API Framework | AWS Lambda + API Gateway | Fully serverless, auto-scaling, event-driven integration, reduced infrastructure management | Express.js on EC2/ECS |
| Database | DynamoDB | Optimized for access-pattern-driven queries, serverless scalability, low operational overhead, strong integration with Lambda/EventBridge | Aurora PostgreSQL, MongoDB |
| Authentication | Amazon Cognito | Native JWT support, managed authentication, campus-aware authorization integration | Custom JWT service, Auth0 |
| Event Communication | Amazon EventBridge | Loose coupling, asynchronous event-driven architecture, scalable downstream integrations | SNS/SQS-only architecture, Kafka |
| File Storage | Amazon S3 | Highly scalable object storage for profile photos and certificates with pre-signed URL support | Local file storage, EFS |
| Infrastructure as Code | AWS CDK v2 | Strong TypeScript integration, reusable infrastructure components, easier environment management | Terraform, CloudFormation |
| Authorization Strategy | JWT-based RBAC | Supports campus isolation and hierarchical access control | Session-based authentication |
| Architecture Style | Hexagonal / Layered Architecture | Clear separation of concerns, testability, maintainability, adapter isolation | Monolithic service-layer-only architecture |
| API Style | REST APIs | Simpler provider-module integration, predictable contracts, easier downstream consumption | GraphQL |
| Logging & Monitoring | CloudWatch | Native AWS observability integration for Lambda, EventBridge, and API Gateway | ELK Stack |
| Validation Framework | Zod / schema-based validation | Runtime-safe payload validation with TypeScript compatibility | Joi, manual validation |
| Deployment Strategy | Serverless deployment | Lower infrastructure overhead, automatic scaling, reduced operational complexity | Kubernetes/EKS |
| CI/CD Integration | GitHub Actions | Native GitHub integration, lightweight automation, easy deployment pipelines | Jenkins |

---

## 8. Security Considerations

Security is a critical concern for Module 7 because it manages:

- faculty identity information,
- personal data,
- organizational hierarchy,
- and institution-sensitive metadata.

The module enforces strict authentication, authorization, tenant isolation, validation, and secure data handling practices aligned with PRAJNA security standards.

---

### 8.1 Authentication and Authorization

Module 7 uses Amazon Cognito-based JWT authentication for all protected APIs.

Each authenticated JWT token contains:

- faculty identity,
- campus,
- role,
- and authorization claims.

Example JWT claims:

```json
{
  "sub": "FAC123",
  "role": "HOD",
  "campus": "BENGALURU"
}
```

Authorization is enforced using Role-Based Access Control (RBAC).

| Role | Access Scope |
| --- | --- |
| FACULTY | Access and update own profile |
| HOD | View department faculty profiles |
| DIRECTOR | Campus-level visibility |
| PVC | Institution-level visibility |
| ADMIN | Administrative operations |

Cross-campus access is strictly prohibited unless explicitly permitted through institutional admin roles.

---

### 8.2 Data Privacy and Access Control

The module enforces fine-grained access control for sensitive faculty information.

### Faculty Users

Faculty users can:

- view and update their own personal/professional profile,
- manage qualification metadata,
- manage profile documents.

They cannot:

- access other faculty personal information,
- modify hierarchy mappings,
- access restricted institutional metadata.

---

### HoD / Dean / Director / PVC Access

Higher organizational roles receive scoped visibility based on institutional hierarchy.

Examples:

- HoDs can access only department-level faculty metadata.
- Directors can access school/campus-level metadata.
- PVCs can access institution-level aggregate information.

Personally sensitive information such as:

- residential address,
- date of birth,
- private contact details

may be masked or restricted depending on role permissions.

---

### 8.3 Input Validation Strategy

All incoming requests are validated before business logic execution.

Validation includes:

- schema validation,
- mandatory field validation,
- type validation,
- enum validation,
- payload sanitization,
- file metadata validation.

Examples:

- Invalid ORCID formats are rejected.
- Invalid phone numbers are rejected.
- Unsupported file types are blocked.

Validation occurs in the dedicated validation layer to ensure centralized and reusable validation logic.

---

### 8.4 Sensitive Data Handling

The module contains Personally Identifiable Information (PII) including:

- faculty names,
- contact details,
- addresses,
- dates of birth,
- profile documents.

The following safeguards are enforced:

| Security Control | Purpose |
| --- | --- |
| HTTPS/TLS | Secure data transmission |
| JWT Authentication | Identity verification |
| RBAC | Access restriction |
| Campus Isolation | Tenant segregation |
| S3 Pre-Signed URLs | Secure file access |
| CloudWatch Logging Controls | Prevent sensitive log leakage |

Sensitive data must:

- never be logged in plaintext,
- never be exposed in public URLs,
- and never be included unnecessarily in EventBridge payloads.

Only minimal required metadata is emitted in domain events.

---

### 8.5 File Upload Security

Profile photos and qualification certificates are stored in Amazon S3 using secure pre-signed upload URLs.

The module validates:

- MIME type,
- file size,
- and upload metadata

before persistence.

Direct public bucket access is prohibited.

Only metadata and object references are stored in DynamoDB.

---

### 8.6 Event Security

EventBridge payloads emitted by Module 7 contain only non-sensitive operational metadata.

Example allowed payload:

```json
{
  "eventType": "ProfileUpdated",
  "facultyId": "FAC123",
  "campus": "BENGALURU"
}
```

Sensitive information such as:

- addresses,
- DOB,
- contact numbers,
- profile documents

must not be included in emitted events.

---

### 8.7 Auditability and Monitoring

Security-sensitive operations are logged with:

- requestId,
- facultyId,
- operation type,
- timestamp,
- and authorization context.

Examples:

- profile updates,
- role changes,
- qualification uploads,
- hierarchy modifications.

CloudWatch monitoring and alerts are used for:

- failed authorization attempts,
- abnormal API usage,
- and operational anomaly detection.

---

## 9. Testing Strategy

Module 7 follows a multi-layered testing strategy to ensure:

- correctness of profile operations,
- secure authorization handling,
- reliable event emission,
- and stable cross-module integrations.

The testing approach covers:

- unit testing,
- integration testing,
- end-to-end validation,
- and contract verification.

| Type | What You'll Test | Tool / Approach |
| --- | --- | --- |
| Unit | Validation logic, authorization rules, profile completeness metadata generation, hierarchy resolution logic, utility/helper functions | Jest with mocked dependencies |
| Integration | API Gateway → Lambda → DynamoDB flow, EventBridge event publishing, S3 metadata persistence, JWT authorization flow | Jest integration tests with local/mock AWS services |
| E2E | Complete faculty profile lifecycle including login, profile update, qualification upload, and downstream event generation | Postman / automated API test suites |

---

### Unit Testing Strategy

Unit tests validate isolated business logic components without external infrastructure dependencies.

Primary focus areas:

- validation layer,
- role-based access control,
- profile update logic,
- qualification processing,
- hierarchy resolution,
- and utility functions.

External dependencies such as:

- DynamoDB,
- S3,
- and EventBridge

are mocked during unit tests.

Coverage target:

```
>= 80%
```

---

### Integration Testing Strategy

Integration tests verify correct interaction between:

- API Gateway,
- Lambda handlers,
- DynamoDB,
- S3 adapters,
- and EventBridge publishers.

Focus areas include:

- successful profile persistence,
- event emission after updates,
- authorization middleware integration,
- and database query correctness.

---

### End-to-End (E2E) Testing Strategy

E2E testing validates complete real-world workflows from client request to downstream integration behavior.

Example scenarios:

- faculty profile creation,
- profile update,
- qualification upload,
- profile photo update,
- approver hierarchy lookup.

The tests verify:

- API correctness,
- authorization enforcement,
- persistence,
- and event generation.

---

---

## 10. CDK / Infrastructure

### 10.1 CDK Stack Design

Recommended stack structure:

```
lib/
└── modules/
    └── faculty-profile-stack.ts
```

---

### 10.2 Major Infrastructure Constructs

| Construct | Responsibility |
| --- | --- |
| FacultyProfileApiConstruct | API Gateway routes and Lambda integration |
| FacultyProfileLambdaConstruct | Profile service Lambda functions |
| FacultyProfileDynamoConstruct | DynamoDB table configuration and indexes |
| FacultyProfileEventConstruct | EventBridge publisher configuration |
| FacultyProfileS3Construct | Secure file upload configuration |
| FacultyProfileMonitoringConstruct | CloudWatch metrics and alarms |

---

### 10.3 DynamoDB Infrastructure Design

The module uses a single-table DynamoDB design.

Recommended table keys:

```
PK = CAMPUS#<campus>
SK = FACULTY#<facultyId>
```

Configured GSIs:

- Department GSI
- School GSI
- Role GSI

The table is configured with:

- on-demand capacity mode,
- point-in-time recovery (PITR),
- and server-side encryption.

---

### 10.4 Lambda Function Design

Lambda functions are separated by responsibility.

Recommended handlers:

| Lambda Handler | Responsibility |
| --- | --- |
| getFacultyProfileHandler | Fetch faculty profile |
| updateFacultyProfileHandler | Update faculty profile |
| getDepartmentFacultyHandler | Department-level retrieval |
| getSchoolFacultyHandler | School-level retrieval |
| getApproverHandler | Approver hierarchy resolution |
| addQualificationHandler | Qualification metadata management |
| publishProfileEventHandler | EventBridge event publishing |

Each Lambda:

- remains stateless,
- uses environment variables for configuration,
- and follows least-privilege IAM access policies.

---

### 10.5 API Gateway Infrastructure

API Gateway:

- routes all REST endpoints,
- validates JWT tokens using Cognito authorizers,
- handles throttling and rate limiting,
- and enables centralized API monitoring.

Recommended base path:

```
/faculty
```

---

### 10.6 EventBridge Integration

Module 7 publishes domain events to the shared PRAJNA event bus.

Event source:

```
prajna.profile
```

Example events:

- FacultyCreated
- ProfileUpdated
- QualificationAdded
- RoleChanged

The module emits events only after successful persistence operations.

---

### 10.7 S3 Infrastructure

Amazon S3 stores:

- profile photos,
- qualification certificates,
- and profile-related documents.

Security controls:

- pre-signed upload URLs,
- private bucket access,
- MIME-type validation,
- server-side encryption.

Only object metadata is stored in DynamoDB.

---

### 10.8 Monitoring and Observability

CloudWatch is used for:

- Lambda logs,
- API monitoring,
- EventBridge monitoring,
- error metrics,
- and operational dashboards.

Configured alarms:

- Lambda error spikes,
- API latency anomalies,
- failed event publications,
- and authorization failures.

---

### 10.9 Stack Parameters and Environment Variables

| Parameter | Purpose |
| --- | --- |
| TABLE_NAME | DynamoDB table name |
| EVENT_BUS_NAME | Shared EventBridge bus |
| PROFILE_BUCKET_NAME | S3 bucket name |
| COGNITO_USER_POOL_ID | JWT validation |
| ENVIRONMENT | dev / staging / prod |
| LOG_LEVEL | Operational logging configuration |

---

### 10.10 Stack Outputs

The stack exports:

- API Gateway endpoint URLs,
- Lambda ARNs,
- DynamoDB table names,
- EventBridge bus references,
- and S3 bucket references.

These outputs are consumed by:

- dashboard modules,
- approval engine,
- notification engine,
- and deployment pipelines.

---

### 10.11 Cross-Module Stack Integration

Module 7 integrates with shared infrastructure stacks using:

- SSM Parameter Store,
- environment variables,
- and resource name lookups.

The stack connects with:

- Authentication stack (Cognito),
- Shared Event Bus stack,
- Shared Database Infrastructure stack,
- and shared monitoring infrastructure.

Direct cross-stack hardcoding is avoided to reduce deployment coupling.

`cdk.Fn.importValue()` usage is discouraged in favor of dynamic parameter discovery.

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Cross-campus data leakage | Exposure of sensitive faculty information across campuses | Enforce strict campus isolation using JWT claims and query-level validation |
| Incorrect role hierarchy mapping | Approval routing and dashboard visibility failures | Centralized role validation and hierarchy consistency checks |
| Event payload inconsistency | Downstream module integration failures | Contract testing and shared event schema validation |
| Duplicate faculty identities | Data inconsistency across PRAJNA modules | Enforce unique facultyId and institutional email constraints |
| ORCID duplication across faculty | Incorrect research mapping | Unique ORCID validation before persistence |
| Excessive DynamoDB scans | Increased latency and infrastructure cost | Access-pattern-driven schema design with optimized GSIs |
| Unauthorized profile modification | Security and compliance violations | Role-based access control (RBAC) and ownership validation |
| Sensitive data exposure in logs | Privacy and compliance risks | Mask PII fields and restrict sensitive logging |
| EventBridge delivery failures | Downstream synchronization delays | Retry policies, DLQs, and CloudWatch monitoring |
| S3 file upload abuse | Storage misuse and malicious uploads | MIME validation, file-size restrictions, and pre-signed URL expiration |
| API contract changes breaking downstream modules | Dashboard and workflow integration failures | Backward-compatible APIs and contract testing |
| High-frequency dashboard queries causing load spikes | Increased latency and throttling | Optimized GSIs, pagination, caching strategy, and on-demand DynamoDB scaling |
| Role escalation vulnerabilities | Unauthorized organizational visibility | Strict JWT validation and role authorization checks |
| Large profile payload sizes | Increased response latency | Projection optimization and partial response APIs |
| Misconfigured IAM permissions | Security exposure or infrastructure failure | Least-privilege IAM policies and infrastructure reviews |
| Failure during event emission after persistence | Downstream systems not synchronized | Idempotent retry mechanisms and event monitoring alarms |
| Accidental deletion or corruption of profile data | Loss of critical faculty metadata | DynamoDB Point-in-Time Recovery (PITR) and backup policies |
| Tight coupling with downstream modules | Reduced scalability and maintainability | Event-driven architecture and provider-contract-based integration |

---

## 12. Milestones & Timeline

The implementation timeline for Module 7 is divided into phased deliverables to ensure:

- architecture validation,
- incremental development,
- integration stability,
- and production readiness.

| Week | Deliverable |
| --- | --- |
| Week 1–2 | Requirement analysis, access pattern identification, LLD completion, architecture review, and approval |
| Week 3–4 | DynamoDB schema design, CDK infrastructure setup, API Gateway and Lambda scaffolding |
| Week 5–6 | Core faculty profile APIs implementation, validation layer, RBAC authorization, and S3 integration |
| Week 7–8 | Organizational hierarchy APIs, GSIs optimization, EventBridge integration, and downstream contract alignment |
| Week 9–10 | Integration testing with Module 13, Module 14, dashboards, and notification systems |
| Week 11–12 | Security testing, performance testing, bug fixes, documentation finalization, and production readiness review |

---

### Milestone Breakdown

### Phase 1 — Architecture & Design

Focus areas:

- requirement understanding,
- access pattern analysis,
- DynamoDB schema design,
- and API contract definition.

Deliverables:

- approved LLD,
- finalized access patterns,
- finalized GSI strategy,
- and infrastructure design.

---

### Phase 2 — Infrastructure & Core APIs

Focus areas:

- CDK stack creation,
- Lambda scaffolding,
- DynamoDB integration,
- API Gateway setup,
- and Cognito authorization.

Deliverables:

- deployable infrastructure,
- basic CRUD APIs,
- validation layer,
- and secure authentication flow.

---

### Phase 3 — Business Logic & Event Integration

Focus areas:

- hierarchy resolution,
- qualification handling,
- role-based access control,
- and EventBridge integration.

Deliverables:

- profile APIs,
- hierarchy APIs,
- event publishing,
- and downstream integration contracts.

---

### Phase 4 — Integration & Optimization

Focus areas:

- cross-module testing,
- GSI tuning,
- API optimization,
- and dashboard query validation.

Deliverables:

- validated integrations,
- optimized queries,
- stable event contracts,
- and monitoring setup.

---

### Phase 5 — Hardening & Production Readiness

Focus areas:

- security testing,
- performance testing,
- observability,
- documentation,
- and operational readiness.

Deliverables:

- production-ready module,
- finalized monitoring,
- test coverage completion,
- and deployment sign-off.

---

## 13. Open Questions

The following items require further clarification, architectural alignment, or cross-team discussion before final implementation.

---

### Organizational Hierarchy & Role Mapping

- Should faculty roles support multi-role assignments?
    
    Example:
    
    - Faculty + HoD
    - Dean + Professor
- Can a faculty member belong to multiple departments or schools?
- Is organizational hierarchy strictly campus-isolated, or can institutional-level cross-campus visibility exist for selected roles?
- Who owns the authoritative source for hierarchy updates:
    - Module 7,
    - HR systems,
    - or external integrations?

---

### Approval Workflow Integration

- Which profile changes require approval workflow integration through Module 13?
    
    Example:
    
    - designation changes,
    - qualification updates,
    - hierarchy modifications.
- Should profile updates become immediately visible before approval completion, or only after approval?
- Does Module 7 emit approval-triggering events directly, or should Module 13 poll/update through APIs?

---

### Profile Completeness Logic

- What exact fields contribute to profile completeness metadata?
- Should profile completeness be:
    - percentage-based only,
    - or category-weighted?
- Which module owns the final completeness scoring logic:
    - Module 7 metadata layer,
    - or Module 14 Score Engine?

(Current assumption: Module 14 owns final scoring logic.)

---

### File Upload & Storage Policies

- Maximum allowed size for:
    - profile photos,
    - certificates,
    - and profile documents?
- Which file formats are permitted?
- Should uploaded certificates require verification/approval workflows?
- Are document retention and archival policies required?

---

### Dashboard & Analytics Requirements

- What level of aggregation is required for:
    - HoD dashboards,
    - Director dashboards,
    - and institutional analytics?
- Are real-time dashboard updates required, or is eventual consistency acceptable?
- Will dashboards require pagination and filtering support at API level?

---

### Event Contract Standardization

- Should all PRAJNA modules adopt a centralized shared event schema library?
- What is the final standardized event naming convention?

Example:

```
ProfileUpdated
profile.updated
faculty.profile.updated
```

- Which fields are mandatory in all emitted events?

---

### Cross-Module API Contracts

- Should shared provider APIs follow a centralized API versioning strategy?
- Are synchronous API calls preferred for hierarchy lookups, or should cached/event-driven synchronization be introduced?
- Which module owns retry handling for failed downstream integrations?

---

### Search & Query Requirements

- Is global faculty search across campuses required?
- Will fuzzy search be required for:
    - faculty names,
    - departments,
    - or research interests?
- Are additional GSIs required for future analytics/reporting use cases?

---

### Infrastructure & Operational Concerns

- What are the expected scale estimates for:
    - faculty count,
    - dashboard traffic,
    - and profile update frequency?
- Should DynamoDB caching (DAX / Redis) be introduced later for high-frequency queries?
- Are disaster recovery and multi-region failover requirements needed?

---

### Security & Compliance

- Are there compliance requirements for handling faculty PII data?
- What audit retention duration is required for profile modifications?
- Should sensitive profile fields be encrypted at application level in addition to AWS-managed encryption?
- Are there restrictions on exposing profile data to AI modules?

---

## 14. Self-Assessment — Amazon Leadership Principles

| # | Leadership Principle | Demonstrated / Need to Work On | Example from Your Work |
| --- | --- | --- | --- |
| 1 | **Customer Obsession** — Who is your module's customer? How did you design for them? | Demonstrated | Designed Module 7 as a provider module supporting dashboards, approval systems, AI modules, and faculty users. Focused on efficient access patterns for department, school, and role-based queries to improve downstream usability and scalability. |
| 2 | **Ownership** — How did you take end-to-end ownership of your module? | Demonstrated | Took ownership of Module 7 architecture including access pattern analysis, DynamoDB schema design, API planning, security boundaries, event contracts, and cross-module integration considerations. |
| 3 | **Invent and Simplify** — Where did you simplify a complex problem? | Demonstrated | Simplified organizational hierarchy retrieval using DynamoDB GSIs instead of complex relational joins. Reused role-based GSIs for multiple queries such as approver lookup and HoD retrieval to reduce unnecessary indexes. |
| 4 | **Are Right, A Lot** — What decision did you make with incomplete information? How did it turn out? | Need to Work On | Initially considered calculating profile completeness score inside Module 7, but later realized scoring ownership should belong to Module 14 after analyzing separation of concerns and cross-module responsibilities. |
| 5 | **Learn and Be Curious** — What new technology/concept did you learn for this module? | Demonstrated | Learned DynamoDB access-pattern-driven schema design, PK/SK modeling, GSI strategy, event-driven architecture, and serverless infrastructure design using AWS services. |
| 6 | **Hire and Develop the Best** — How did you help a teammate or learn from one? | Need to Work On | Collaborated with teammates working on related modules to better understand cross-module communication patterns and workflow dependencies. Need to improve proactive technical mentoring and peer reviews. |
| 7 | **Insist on the Highest Standards** — Where did you refuse to cut corners? | Demonstrated | Focused heavily on campus isolation, RBAC authorization, standardized event contracts, and avoiding duplicated business logic across modules even when simpler shortcuts were possible. |
| 8 | **Think Big** — How does your module scale or support PRAJNA's long-term vision? | Demonstrated | Designed Module 7 as a foundational identity and organizational provider module capable of supporting dashboards, AI personalization, approvals, analytics, and institution-wide integrations at scale. |
| 9 | **Bias for Action** — Where did you make a quick decision instead of over-analyzing? | Need to Work On | Spent significant time exploring multiple schema possibilities before finalizing access-pattern-driven DynamoDB design. Need to improve faster architectural decision-making under time constraints. |
| 10 | **Frugality** — How did you achieve more with less? | Demonstrated | Reused shared GSIs and provider APIs wherever possible instead of creating separate redundant APIs or indexes for every query pattern. Chose serverless infrastructure to reduce operational overhead. |
| 11 | **Earn Trust** — How did you handle disagreements or build trust with your team? | Demonstrated | Focused on keeping module boundaries clean and aligning API/event naming conventions with shared architecture guidelines to reduce confusion during cross-module integration discussions. |
| 12 | **Dive Deep** — Where did you dig into the details to find the right solution? | Demonstrated | Deeply analyzed DynamoDB PK/SK behavior, GSI strategies, access patterns, hierarchy modeling, and event-driven integration flows before finalizing the data model architecture. |
| 13 | **Have Backbone; Disagree and Commit** — Did you push back on a decision? How? | Demonstrated | Questioned whether Module 7 should calculate profile scores internally and advocated for moving scoring responsibility to Module 14 to maintain clean ownership boundaries and reduce tight coupling. |
| 14 | **Deliver Results** — Did you meet your milestones? What did you ship? | Demonstrated | Completed detailed architecture planning, LLD documentation, access pattern analysis, API design, security planning, and infrastructure design for Module 7 within the planned design phase timeline. |

---

## Top 3 I Demonstrated

1. Ownership
2. Dive Deep
3. Think Big

---

## Top 3 I Need to Work On

1. Bias for Action
2. Hire and Develop the Best
3. Are Right, A Lot

---

## 15. References

| Category | Reference | Purpose |
| --- | --- | --- |
| Project Document | PRAJNA Project Requirements Document | Functional requirements, module definitions, organizational workflows, cross-module expectations |
| Project Document | PRAJNA High-Level Design (HLD) Document | Overall system architecture, AWS infrastructure decisions, module interaction design |
| Internal Reference | Module 13 — Approval Workflow Engine LLD | Approval integration patterns, event conventions, cross-module communication reference |
| AWS Documentation | AWS DynamoDB Documentation | Single-table design, PK/SK modeling, GSI design |
| AWS Documentation | AWS Lambda Documentation | Serverless compute architecture and Lambda best practices |
| AWS Documentation | AWS EventBridge Documentation | Event-driven communication and asynchronous integration |
| AWS Documentation | AWS API Gateway Documentation | REST API routing and authorization |
| AWS Documentation | AWS Cognito Documentation | JWT authentication and RBAC integration |
| AWS Documentation | AWS S3 Documentation | Secure file storage and pre-signed URL handling |
| AWS Documentation | AWS CDK v2 Documentation | Infrastructure as Code implementation |
| Technical Reference | DynamoDB Access Pattern Design Principles | Query-first schema modeling |
| Technical Reference | Event-Driven Architecture Principles | Loose coupling and asynchronous workflows |
| Technical Reference | Hexagonal / Clean Architecture | Separation of concerns and modular design |
| Technical Reference | REST API Design Best Practices | Standardized provider API design |
| Technical Reference | RBAC Design Principles | Role-based authorization strategy |
| Technical Reference | Multi-Tenant Architecture Patterns | Campus-level tenant isolation |
| Technical Reference | Serverless Architecture Best Practices | Scalability and infrastructure optimization |
| Internal Standard | Shared Event Contract Standards | Event payload consistency across modules |
| Internal Standard | Shared Role & Module Enumerations | Common enums and identifiers across PRAJNA |
| Internal Standard | API Response Standardization Guidelines | Consistent API contract structure |
| Internal Standard | Cross-Module Communication Guidelines | API/event integration conventions |
| Internal Standard | PRAJNA Naming Convention Standards | Resource, API, and event naming consistency |
| Framework / Library | TypeScript | Strongly typed backend development |
| Framework / Library | AWS SDK v3 | AWS service integrations |
| Framework / Library | Jest | Unit and integration testing |
| Framework / Library | Zod | Request payload validation |
| Framework / Library | AWS CDK v2 | Infrastructure provisioning |

---

*PRAJNA — प्रज्ञा | Super-30*