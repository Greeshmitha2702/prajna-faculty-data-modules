## **PRAJNA — Faculty Data Modules (7–12) LLD Guide** 

## **Purpose** 

This guide defines the Low-Level Design (LLD) standards for all Faculty Data Modules (Modules 7–12) in PRAJNA. 

These modules are classified as: 

## **Authoritative Data Provider Modules** 

They are responsible for: 

- owning faculty-related data, 

- exposing stable APIs, 

- maintaining organizational hierarchy, 

- validating domain data, 

- emitting factual domain events, 

- supporting downstream business logic modules. 

This guide standardizes: 

- architecture patterns, 

- data ownership, 

- API conventions, 

- event emission standards, 

- DynamoDB modeling, 

- security patterns, 

- cross-module communication. 

## **1. Faculty Data Module Philosophy** 

Faculty Data Modules are: 

- data-centric, 

- provider-oriented, 

- metadata-owning services. 

They are NOT responsible for: 

- score calculations, 

- workflow orchestration, 

- notification dispatch, 

- leaderboard computation. 

1 

Those belong to: 

- Module 13 — Approval Workflow Engine 

- Module 14 — Score Engine 

- Module 15 — Leaderboard • Module 16 — Notification Engine • Module 17 — Report Generator 

## **2. Modules Covered** 

|Module|Name|moduleId|
|---|---|---|
|7|Personal & Professional Profle|profle|
|8|Course Deliverables & Teaching|teaching|
|9|Research & Innovation|research|
|10|Achievements & Recognition|awards|
|11|Faculty Development & Growth|fdp|
|12|Administrative & Lifecycle|admin|



`moduleId` values are frozen integration contracts and must not be changed. 

## **3. Core Responsibilities of Faculty Data Modules** 

All Faculty Data Modules MUST: 

- Own their domain data 

- Expose provider APIs 

- Validate data integrity 

- Emit factual domain events 

- Maintain campus isolation 

- Support dashboard aggregation 

- Support reporting systems 

- Support approval integration • Maintain immutable audit-compatible metadata 

- Follow shared naming conventions 

## **4. Responsibilities Explicitly Out of Scope** 

Faculty Data Modules MUST NOT: 

- calculate PRAJNA scores, 

2 

- update leaderboards, • send notifications, • orchestrate workflows, 

- manage escalations, 

- contain approval routing logic. 

These concerns belong to downstream business logic modules. 

## **5. Shared Architectural Constraints** 

All Faculty Data Modules MUST use: 

- TypeScript 5.x 

- Node.js 20.x 

- AWS Lambda 

- API Gateway 

- DynamoDB 

- EventBridge custom bus 

- AWS CDK v2 

- CommonJS modules 

- Strict typing ( `"strict": true` ) 

Disallowed: 

- EC2 

- ECS • EKS 

- direct module imports 

- shared mutable state 

## **6. Standard Folder Structure** 

```
src/modules/<module-name>/
├── handlers/
├── services/
├── adapters/
├── validators/
├── models/
├── interfaces/
├── types/
└── __tests__/
```

3 

## **7. Organizational Hierarchy Standards** 

All faculty data modules MUST use the shared organizational hierarchy model: 

```
Campus
  → School
      → Department
           → Faculty
```

Shared role enums: 

```
FACULTY
HOD
DEAN
DIRECTOR
PVC
ADMIN
```

Separate tables for HoD/Director/PVC profiles are prohibited. 

Role-specific permissions must be implemented using: 

- role fields, 

- access policies, 

- JWT claims. 

## **8. Shared Identity Standards** 

The following fields are standardized across all modules: 

|Field|Purpose|
|---|---|
|facultyId|Faculty identity|
|campus|Tenant isolation|
|department|Organizational grouping|
|school|Higher-level grouping|
|role|Access control|
|moduleId|Source module identifer|
|createdAt|Audit|
|updatedAt|Audit|



4 

Naming variations are prohibited. 

Example: 

- Use `facultyId` • Do NOT use `facultyID` , `faculty_id` , or `fid` 

## **9. Cross-Module Communication Standards** 

Faculty Data Modules communicate with other modules using: 

- REST APIs, 

- EventBridge events. 

Direct module imports are prohibited. 

## **9.1 API Communication** 

Use APIs when: 

- immediate response is required, 

- synchronous validation is needed, 

- data must be fetched directly. 

Examples: 

- Fetch faculty contact details 

- Fetch approver hierarchy 

- Fetch faculty profile 

## **9.2 Event Communication** 

Use events when: 

- announcing domain changes, 

- notifying downstream consumers, 

- asynchronous processing is acceptable. 

Events must represent: 

- facts, 

- completed actions, 

- state transitions. 

5 

GOOD: 

- ProfileUpdated 

- PublicationCreated 

- FDPCompleted 

BAD: 

- UpdateLeaderboard 

- IncreaseScore 

## **10. Integration Rules With Business Logic Modules (13–18)** 

Faculty Data Modules MUST reuse existing frozen integration contracts defined by downstream business logic modules. 

These include: 

- approval workflow payloads, 

- workflowType enums, 

- approval event shapes, 

- EventBridge naming conventions, 

- shared JWT claims. 

Module 13 remains the source of truth for: 

- approval contracts, • escalation flows, • workflow lifecycle events. 

Faculty Data Modules must integrate with those contracts instead of redefining them. 

## **11. Event Emission Standards** 

Faculty Data Modules emit: 

- factual domain events, 

- never orchestration commands. 

Recommended event naming: 

- FacultyCreated 

- ProfileUpdated 

- PublicationApproved 

- QualificationAdded 

6 

• FDPSubmitted 

Events should: 

- contain immutable identifiers, • include campus and facultyId, • avoid PII-heavy payloads. 

## **12. API Design Standards** 

Provider APIs should: 

- expose stable contracts, 

- remain backward-compatible, 

- avoid unnecessary coupling, • use REST conventions. 

Standard conventions: 

|Method|Usage|
|---|---|
|GET|Fetch|
|POST|Create|
|PUT|Replace/update|
|PATCH|Partial update|
|DELETE|Soft delete/archive|



## **13. Data Modeling Standards** 

Faculty Data Modules are optimized for: 

- lookup-heavy access patterns, 

- dashboard aggregation, • hierarchical filtering, 

- report generation. 

Recommended DynamoDB conventions: 

```
PK = CAMPUS#<Campus>
SK = <ENTITY>#<Id>
```

Examples: 

7 

```
PK = CAMPUS#BENGALURU
SK = FACULTY#123
PK = CAMPUS#VIZAG
SK = PUB#2026#123
```

Scans are prohibited in production paths. 

## **14. File Upload Standards** 

Faculty Data Modules may support: 

- profile photos, 

- certificates, 

- evidence documents, 

- publication proofs. 

Files must: 

- be stored in S3, 

- use pre-signed URLs, 

- validate MIME type and size, 

- avoid direct public access. 

Only metadata/URLs are stored in DynamoDB. 

## **15. Security Standards** 

All modules MUST implement: 

- Cognito authentication, 

- JWT-based authorization, 

- campus isolation, 

- role validation, 

- request validation, 

- immutable audit metadata. 

Cross-campus access must return: 

```
{
"error":"CAMPUS_MISMATCH"
}
```

8 

## **16. Dashboard Support Standards** 

Faculty Data Modules must expose efficient query patterns for: 

- Faculty dashboards 

- HoD dashboards 

- Director dashboards 

- Institutional analytics 

Modules should optimize for: 

- filtered reads, 

- department aggregation, 

- school aggregation, 

- profile lookups. 

## **17. Testing Standards** 

Mandatory: 

- Unit tests 

- Integration tests 

- Contract tests 

- Event payload tests 

Coverage target: 

```
>= 80%
```

## **18. CDK Standards** 

Each module owns: 

```
lib/modules/<module-name>-stack.ts
```

Shared resources must be imported using: 

- SSM Parameter Store 

- name-based lookups 

`cdk.Fn.importValue()` is prohibited. 

9 

## **19. Cross-Team Coordination Checklist** 

Before implementation: 

## **With Module 13** 

- Approval payload verified 

- workflowType verified 

- event contracts verified 

## **With Module 14** 

- score-consumption events verified 

## **With Module 16** 

- contact lookup APIs verified 

## **With Module 17** 

- reporting access patterns verified 

## **With Dashboard Teams** 

- aggregation queries verified 

## **20. Final Design Philosophy** 

Faculty Data Modules are: 

## **The System of Record for Faculty Intelligence** 

The quality of: 

- approvals, 

- dashboards, 

- AI recommendations, 

- reports, 

- notifications, 

- rankings, 

- institutional analytics 

depends directly on the correctness and consistency of these modules. 

10 

Design for: 

- clarity, 

- ownership, 

- scalability, 

- loose coupling, 

- long-term maintainability. 

11 

