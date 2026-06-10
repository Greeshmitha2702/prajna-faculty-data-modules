## PRAJNA — Low Level Design Document 

## Module: Course Deliverables & Teaching 

Sub-module of Faculty Data Module 

|||
|---|---|
|Module Name|Course Deliverables&Teaching|
|moduleId|teaching|
|Parent Module|Faculty Data Module|
|Project|PRAJNA_Faculty Management System|
|Language|TypeScriptLAWS Lambda)|
|Infrastructure|AWS Serverless—CDKLTypeScript)|
|Primary DB|DynamoDB_Single Table Design(no Aurora,no Redis)|
|Version|1.3 _Audit trail moved to Module28,Aurora cleaned,faculty-data focus,infra<br>consistency|



## Architecture Constraints 

|Constraint Area|Rule|
|---|---|
|Language|TypeScript only—all Lambda functions,CDK stacks,and libraries use TypeScript with<br>strict mode enabled|
|Infrastructure|AWS Serverless only—Lambda,API Gateway,DynamoDB,S3,Cognito,SQS,SNS,<br>EventBridge.No EC2,ECS,EKS,or ElastiCache.|
|IaC|AWS CDKLTypeScript) —this module owns its own CDK stack:CourseDeliverablesStack|
|Database|DynamoDB Single Table Design—one table named prajna-teaching.All access patterns<br>are GetItem,Query,or GSI Query—no joins or aggregations exist that require a<br>relational DB.|
|Auth|Amazon Cognito—JWT tokens validated by API Gateway Authorizer on all routes|
|Caching|No Redis/ElastiCache—DynamoDB with proper PK/SK access patterns provides<br>sufficient read performance for current requirements.Redis can be re-evaluated if<br>measured latency exceeds SLA in production.|
|Inter-module<br>Comms|Event-driven only via EventBridge—no internal REST calls between modules.<br>Dependencies on other modules(faculty validation,course validation)resolved via<br>EventBridge events or data already present in JWT claims.|



PRAJNA — Low Level Design Document 

1 

|Constraint Area|Rule|
|---|---|
|SSM Parameter<br>Store|Used for cross-stack resource discovery.Each module exports its resource ARNs/names<br>to SSM on deploy.Consuming modules read from SSM at synth time—no hardcoded<br>ARNs,no direct CDK stack imports across module boundaries.|
|Exceptions|None—no exceptions from constraints in this module.All open questions are listed in<br>Section13.|



## 1. Module Overview 

## What does this module do? 

The Course Deliverables & Teaching module (moduleId: teaching) is a Faculty Data sub-module inside PRAJNA. Its primary purpose is to store and serve faculty-owned academic records — the deliverables a faculty member assigns, the submissions received against them, the grades awarded, and the teaching sessions scheduled. It is a data-ownership module: it defines what teaching information belongs to a faculty member and makes that information queryable and exportable. 

- Faculty academic records — deliverables (assignments, quizzes, projects, presentations) that a faculty member creates and owns per course 

- Student academic records — submissions received and grades awarded per faculty deliverable 

- Teaching schedule records — sessions a faculty member schedules per course (lectures, labs, office hours) 

- GradeBook records — per-student aggregated academic performance owned by the faculty for each course 

## Why does it exist in PRAJNA? 

PRAJNA is a Faculty Management System. The core data asset a faculty member generates is their teaching record — what they assigned, how students performed, and when they taught. This module is the system of record for that data. Without it, there is no structured place to ' store or retrieve a faculty member s academic output across their courses. 

## Who are the primary users? 

|User|How they interact with this module's data|
|---|---|
|Faculty(primary)|Owns all data in this module—creates deliverables,records grades,manages<br>teaching schedule,exports GradeBook for their courses|
|Students<br>(secondary)|Read-only access to faculty-published deliverables;submit work;view released grade<br>records|
|Admin/HOD|Read-only access to GradeBook exports and course delivery records for reporting|



PRAJNA — Low Level Design Document 

2 

## 2. Scope 

## What data this module owns and serves 

- Faculty deliverable records — assignments, quizzes, projects, presentations owned per course per faculty member 

- Submission records — student submissions received against a faculty deliverable, including file references and attempt history 

- Grade and feedback records — marks awarded and feedback given by faculty per submission; visibility controlled by faculty (released / unreleased) 

- Teaching session records — sessions a faculty member schedules per course with date, time, type, location, and recurrence 

- GradeBook records — per-student weighted academic performance aggregated from all deliverables in a course, owned by the faculty 

- File storage references — S3 keys for faculty-uploaded deliverable attachments and student-uploaded submission files 

- Event publishing — EventBridge events fired on major record state changes so other modules LNotification, Analytics, Audit) can react 

## Out of Scope 

|NOT covered here|Handled by|
|---|---|
|Student enrollment in courses|Enrollment Module|
|Audit trail logging—immutable logs for<br>grade changes,submission events,and<br>state transitions|Module28 _Audit Trail Module(owns all audit logging<br>across PRAJNAM|
|Authentication&JWT issuance|Auth ModuleLCognito)|
|Notification delivery(email/push)|Notification Module|
|Faculty profile/HR records|Faculty Profile Module|
|Course catalogue creation|Course Catalogue Module|
|Video conferencing infrastructure|External providerLZoom/Meet link stored only)|
|Fee&payment management|Finance Module|



## 3. Dependencies 

## Depends On 

|Module/Service|What it provides|Integration Pattern|
|---|---|---|
|Auth Module<br>LCognito)|JWT tokens with user_id,role,and courseIds[]claims—<br>validated on every API call via API Gateway Authorizer|Cognito JWT(no REST<br>call)|



PRAJNA — Low Level Design Document 

3 

|Module/Service|What it provides|Integration Pattern|
|---|---|---|
|Faculty Profile<br>Module|Publishes faculty.assigned.course EventBridge event<br>when a faculty is assigned to a course—this module<br>stores instructorId from the event payload,eliminating the<br>need to call Faculty Profile at request time|EventBridge(event-<br>driven)|
|Course<br>Catalogue<br>Module|Publishes course.created and course.archived<br>EventBridge events—this module reacts to create/clean<br>up deliverables.courseId validated from JWT claims,not<br>via REST call.|EventBridge(event-<br>driven)|
|Enrollment<br>Module|Fires student.enrolled EventBridge event—this module<br>creates an empty GradeBook item on consume|EventBridge(event-<br>driven)|
|AWS S3|File storage for submission files,deliverable attachments,<br>and GradeBook PDF exports|AWS SDK(s3.adapter.ts)|
|AWS EventBridge|Event bus for publishing domain events to all downstream<br>consumers|AWS SDK<br>(eventbridge.adapter.ts)|
|AWS DynamoDB|Single table(prajna-teaching) —all module data:<br>deliverables,submissions,feedback,sessions,GradeBook|AWS SDK<br>(ddb.adapter.ts)|



## Depended By 

|Module|What it consumes from this module|
|---|---|
|Notification Module|Subscribes to EventBridge events:deliverable.published,<br>submission.received,feedback.released,session.reminder|
|Analytics Module|Subscribes to gradebook.updated and deliverable.published events|
|Calendar/Portal Module|Consumes session.scheduled and session.cancelled events;reads ICS<br>export endpoint|



## 4. Architecture & Design 

## Component Diagram 

The module is composed of six Lambda-backed services under moduleId: teaching. All accessed via API Gateway with Cognito JWT auth. They share a single DynamoDB table (prajna-teaching) for all data and S3 for file storage. All major state changes are published to EventBridge. No Redis/ElastiCache — DynamoDB access patterns are sufficient for current performance requirements. 

|Component|Responsibility|
|---|---|
|DeliverableService|CRUD for deliverables;state machineLDraft→Published→Closed→Archived);Factory<br>pattern for type-specific instances|
|SubmissionService|Accept/validate submissions;late-flag detection;attempt enforcement;enqueue to<br>SQS|



PRAJNA — Low Level Design Document 

4 

|Component|Responsibility|
|---|---|
|UploadService|Generate S3pre-signed PUT URLs;record file metadata;trigger ClamAV scan via S3<br>event|
|FeedbackService|Grading engine(manual/rubric/auto);release control;publishes feedback.released<br>event to EventBridge(audit trail handled by Module28M|
|ScheduleService|Teaching session CRUD;RRULE expansion;conflict detection;ICS generation;<br>EventBridge Scheduler triggers|
|GradeBookService|Event-driven grade aggregation;weighted percentage+letter grade computation;<br>CSV/PDF export|



## Folder Structure 

All code for this module lives under src/modules/teaching/ following the structure below: 

```
src/modules/teaching/
├── services/
```

- `│   ├── deliverable.service.ts       # Deliverable CRUD + state machine` 

- `│   ├── submission.service.ts        # Submission lifecycle` 

- `│   ├── upload.service.ts            # S3 pre-signed URL generation` 

- `│   ├── feedback.service.ts          # Grading engine + release control` 

- `│   ├── schedule.service.ts          # Teaching session management │   └── gradebook.service.ts         # Grade aggregation + export ├── adapters/` 

- `│   ├── ddb.adapter.ts               # DynamoDB single-table read/write wrapper` 

- `│   ├── s3.adapter.ts                # S3 upload / download / presign │   └── eventbridge.adapter.ts       # EventBridge publish wrapper ├── handlers/ │   ├── deliverable.handler.ts       # Lambda handler for deliverable routes │   ├── submission.handler.ts        # Lambda handler for submission routes │   ├── upload.handler.ts            # Lambda handler for upload URL route │   ├── feedback.handler.ts          # Lambda handler for feedback/grading routes │   ├── schedule.handler.ts          # Lambda handler for session routes │   └── gradebook.handler.ts         # Lambda handler for gradebook routes ├── interfaces/ │   ├── IDeliverableRepository.ts    # Repository contract for deliverables │   ├── ISubmissionRepository.ts     # Repository contract for submissions │   ├── IGradingStrategy.ts          # Strategy interface for grading logic │   ├── IStorageService.ts           # Storage abstraction interface │   └── INotificationPublisher.ts    # Event publishing abstraction ├── models/ │   ├── deliverable.model.ts         # Deliverable domain entity + DDB mapping │   ├── submission.model.ts          # Submission domain entity + DDB mapping │   ├── feedback.model.ts            # Feedback domain entity + DDB mapping │   ├── session.model.ts             # TeachingSession entity + DDB mapping │   └── gradebook.model.ts           # GradeBook entity + DDB mapping ├── validators/ │   ├── deliverable.validator.ts     # Zod schema for deliverable requests │   ├── submission.validator.ts      # Zod schema for submission requests │   ├── feedback.validator.ts        # Zod schema for feedback/grading requests │   └── session.validator.ts         # Zod schema for session requests ├── types/` 

- `│   ├── feedback.handler.ts          # Lambda handler for feedback/grading routes` 

- `│   ├── deliverable.types.ts         # Enums: DeliverableType, DeliverableStatus │   ├── submission.types.ts          # Enums: SubmissionStatus, ScanStatus │   ├── feedback.types.ts            # Enums: GradingStrategy type` 

PRAJNA — Low Level Design Document 

5 

```
│   └── common.types.ts              # Shared types: PaginatedResponse, ApiError
└── __tests__/
    ├── deliverable.service.test.ts
    ├── submission.service.test.ts
    ├── feedback.service.test.ts
    ├── schedule.service.test.ts
    └── gradebook.service.test.ts
```

Folder Responsibilities 

|Folder|What goes in here|
|---|---|
|services/|Pure business logic—no direct AWS SDK calls.Services call adapters via interfaces.<br>This is where all rules live.|
|adapters/|All AWS SDK interactions—DynamoDB,S3,EventBridge.Adapters implement the<br>interfaces defined in interfaces/.Easy to mock in tests.No Redis adapter—DynamoDB<br>handles all reads directly.|
|handlers/|Lambda entry points.Parse the API Gateway event,call the right service,format the<br>HTTP response.No business logic here.|
|interfaces/|TypeScript interfaces/contracts that services depend on.Dependency Inversion—<br>services never import adapters directly.|
|models/|Domain entities and their DynamoDB mapping functions(toDDB,fromDDBM.Each model<br>knows how to convert itself to/from a DDB item.|
|validators/|Zod schemas for request body validation.Called at the start of every handler before<br>passing to service.|
|types/|Shared TypeScript enums,union types,and utility types used across the module.|
|tests/|Jest unit tests for each service.All adapters mocked.Tests only cover service layer<br>logic.|



## Data Flow A _ Faculty publishes a deliverable 

|#|Actor/File|Action|
|---|---|---|
|1|Faculty|POST/v1/deliverables—request hits API Gateway|
|2|handlers/deliverable.handler.ts|Parses event;calls deliverable.validator.tsLZodM;passes<br>to DeliverableService|
|3|services/deliverable.service.ts|Applies business rules;calls ddb.adapter.ts to write<br>item to prajna-teaching table|
|4|Faculty|POST/v1/deliverables/{id}/publish|
|5|services/deliverable.service.ts|Updates status to PUBLISHED in DDB;calls<br>eventbridge.adapter.ts to publish deliverable.published<br>event|
|6|EventBridge|Routes event to Notification Module and Analytics<br>Module|



PRAJNA — Low Level Design Document 

6 

## Data Flow B _ Student submits and faculty grades 

|#|Actor/File|Action|
|---|---|---|
|1|handlers/upload.handler.ts|Student requests pre-signed S3URL → UploadService<br>→ s3.adapter.ts generates URL|
|2|Student → S3|File uploaded directly to S3;ScanLambda triggered;<br>scan_status updated in DDB via ddb.adapter.ts|
|3|handlers/submission.handler.ts|Student POSTs submission;submission.validator.ts<br>validates;SubmissionService writes to DDB;SQS<br>enqueued|
|4|handlers/feedback.handler.ts|Faculty PUTs feedback;feedback.validator.ts validates;<br>FeedbackService writes to DDB;EventBridge event<br>publishedLModule28handles audit trail)|
|5|services/feedback.service.ts|Faculty releases grade → isReleased=true in DDB;<br>eventbridge.adapter.ts fires feedback.released|
|6|services/gradebook.service.ts|Consumes feedback.released event;recalculates<br>GradeBook item in DDB via ddb.adapter.ts;fires<br>gradebook.updated event|



## 5. Data Model 

## Table name: prajna-teaching   |   moduleId: teaching 

All entities in this module — deliverables, submissions, files, feedback, sessions, and GradeBook — are stored in a single DynamoDB table. Audit trail logging is owned by Module 28 and is out of scope. Each entity type is differentiated by its PK and SK prefix patterns. 

## PK / SK Design — All Entities 

|Entity|PK|SK|GSI|
|---|---|---|---|
|Deliverable|COURSE#{courseId}|DELIVERABLE#{deliverableId}|GSI1oSTATUS#{status}|
|Submission|DELIVERABLE#<br>{deliverableId}|SUBMISSION#{studentId}#<br>{attempt}|GSI1oSTUDENT#<br>{studentId}|
|SubmissionFile|SUBMISSION#<br>{submissionId}|FILE#{fileId}|—|
|Feedback|SUBMISSION#<br>{submissionId}|FEEDBACK#metadata|GSI1oFACULTY#<br>{facultyId}|
|TeachingSession|COURSE#{courseId}|SESSION#{sessionDate}#<br>{sessionId}|GSI1oFACULTY#<br>{facultyId}|
|GradeBook|COURSE#{courseId}|GRADEBOOK#{studentId}|GSI1oSTUDENT#<br>{studentId}|



PRAJNA — Low Level Design Document 

7 

## Audit Trail — Out of Scope LModule 28M 

Audit trail logging (grade changes, submission events, state transitions) is owned by Module 28 — the PRAJNA-wide Audit Trail Module. This module publishes EventBridge events (e.g. feedback.released, deliverable.published, submission.received) which Module 28 consumes and persists. This module does NOT maintain its own AUDIT# DynamoDB items. 

## Deliverable Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|COURSE#{courseId}|
|SK|String|DELIVERABLE#{deliverableId}|
|type|String|"DELIVERABLE" —entity discriminator|
|moduleId|String|"teaching" —always|
|deliverableId|String|UUID|
|courseId|String|FK reference|
|instructorId|String|FK reference|
|title|String|Deliverable name|
|deliverableType|String|assignment|quiz|project|presentation|
|dueDate|String|ISO8601with timezone|
|maxMarks|Number|Maximum achievable marks|
|weightPct|Number|Grade weighting percentage(default0M|
|rubric|Map|{criterion,maxMarks,weightPct}[]|
|config|Map|{maxAttempts,timeLimitMins,allowedFileTypes}|
|status|String|draft|published|closed|archived|
|gracePeriodMin|Number|Late submission grace window(default0M|
|GSI1PK|String|STATUS#{status}|
|createdAt/updatedAt|String|ISO8601|



## Submission Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|DELIVERABLE#{deliverableId}|
|SK|String|SUBMISSION#{studentId}#{attempt}|
|type|String|"SUBMISSION"|
|moduleId|String|"teaching"|
|submissionId|String|UUIDv5(deliverableId+studentId+attempt)|
|studentId|String|FK reference|



PRAJNA — Low Level Design Document 

8 

|Attribute|Type|Notes|
|---|---|---|
|submittedAt|String|ISO8601|
|isLate|Boolean|Auto-set by SubmissionService|
|attempt|Number|Attempt number(default1M|
|status|String|submitted|under_review|graded|withdrawn|
|answers|Map|Quiz answer payload(nullable)|
|GSI1PK|String|STUDENT#{studentId}|



## SubmissionFile Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|SUBMISSION#{submissionId}|
|SK|String|FILE#{fileId}|
|type|String|"SUBMISSION_FILE"|
|moduleId|String|"teaching"|
|fileId|String|UUID|
|s3Key|String|S3object key|
|originalFilename|String|As uploaded by student|
|mimeType|String|MIME type|
|fileSizeBytes|Number|File size|
|scanStatus|String|pending|clean|quarantined|



## Feedback Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|SUBMISSION#{submissionId}|
|SK|String|FEEDBACK#metadata|
|type|String|"FEEDBACK"|
|moduleId|String|"teaching"|
|feedbackId|String|UUID|
|marksAwarded|Number|Must be ≤ deliverable maxMarks|
|comments|String|General text feedback|
|annotations|List|[{page,x,y,comment}]|
|gradedBy|String|Faculty userId|
|isReleased|Boolean|Student visibility gate(default false)|
|gradedAt|String|ISO8601|



PRAJNA — Low Level Design Document 

9 

|Attribute|Type|Notes|
|---|---|---|
|GSI1PK|String|FACULTY#{facultyId}|



## TeachingSession Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|COURSE#{courseId}|
|SK|String|SESSION#{sessionDate}#{sessionId}|
|type|String|"SESSION"|
|moduleId|String|"teaching"|
|sessionId|String|UUID|
|facultyId|String|FK reference|
|sessionDate|String|YYYY]MM]DD|
|startTime/endTime|String|HHoMM—conflict detection runs on this pair|
|sessionType|String|lecture|lab|tutorial|office_hours|
|location|String|Room or online(nullable)|
|meetingLink|String|Zoom/Meet URL(nullable)|
|rrule|String|RFC5545recurrence rule(nullable)|
|isCancelled|Boolean|Default false|
|GSI1PK|String|FACULTY#{facultyId}|



## GradeBook Item 

|Attribute|Type|Notes|
|---|---|---|
|PK|String|COURSE#{courseId}|
|SK|String|GRADEBOOK#{studentId}|
|type|String|"GRADEBOOK"|
|moduleId|String|"teaching"|
|studentId|String|FK reference|
|deliverableGrades|Map|{deliverableId:marksAwarded}|
|totalWeighted|Number|Computed weighted percentage|
|letterGrade|String|A�,A,B,C,D,F|
|lastCalculated|String|ISO8601 —used for optimistic locking|
|GSI1PK|String|STUDENT#{studentId}|



## GSI Design Summary 

PRAJNA — Low Level Design Document 

10 

|GSI|GSI PK|GSI PK|GSI SK|Supports Access Pattern|
|---|---|---|---|---|
|GSI1|GSI1PK(varies by<br>entity)||SK(same as base<br>table)|All secondary lookup patterns<br>below|
||||||
|GSI1PK Value||Access Pattern it enables|||
|STATUS#{published}||Get all published deliverables across all courses|||
|STUDENT#{studentId}||Get all submissions by a student+student's GradeBook across all courses|||
|FACULTY#{facultyId}||Get all sessions for a faculty+all feedback graded by a faculty|||



## Access Patterns 

|Access Pattern|Operation|Key Expression|
|---|---|---|
|All deliverables for a course|Query|PK�COURSE#{courseId},SK begins_with<br>DELIVERABLE#|
|Published deliverables for a<br>course|Query|PK�COURSE#{courseId},SK begins_with<br>DELIVERABLE# +filter status=published|
|Single deliverable|GetItem|PK�COURSE#{courseId},SK�DELIVERABLE#{id}|
|All submissions for a<br>deliverable|Query|PK�DELIVERABLE#{deliverableId},SK begins_with<br>SUBMISSION#|
|Student's submission for a<br>deliverable|Query|PK�DELIVERABLE#{deliverableId},SK begins_with<br>SUBMISSION#{studentId}|
|Student's all submissions<br>(across courses)|GSI1Query|GSI1PK�STUDENT#{studentId},SK begins_with<br>SUBMISSION#|
|Feedback for a submission|GetItem|PK�SUBMISSION#{submissionId},SK=<br>FEEDBACK#metadata|
|All files for a submission|Query|PK�SUBMISSION#{submissionId},SK begins_with<br>FILE#|
|All sessions for a course|Query|PK�COURSE#{courseId},SK begins_with SESSION#|
|Sessions for a course on a<br>date|Query|PK�COURSE#{courseId},SK begins_with SESSION#<br>{date}|
|All sessions for a faculty|GSI1Query|GSI1PK�FACULTY#{facultyId},SK begins_with<br>SESSION#|
|GradeBook for a student in a<br>course|GetItem|PK�COURSE#{courseId},SK�GRADEBOOK#<br>{studentId} —strongly consistent read|
|All GradeBook entries for a<br>course|Query|PK�COURSE#{courseId},SK begins_with<br>GRADEBOOK#|



## 6. API Design 

PRAJNA — Low Level Design Document 

11 

All routes REST over HTTPS, versioned at /v1, routed through API Gateway. Auth: Cognito JWT Bearer. RBAC enforced in handlers. 

## Deliverables 

|Method|Endpoint|Description|Role|Response|
|---|---|---|---|---|
|POST|/v1/courses/{id}/deliverables|Create deliverable<br>LDRAFTM|FACULTY|201 +item|
|GET|/v1/courses/{id}/deliverables|List all deliverables|FACULTY,<br>STUDENT|200 +array|
|GET|/v1/deliverables/{id}|Get single<br>deliverable|FACULTY,<br>STUDENT|200 +item|
|PUT|/v1/deliverables/{id}|UpdateLDRAFT<br>only)|FACULTY|200 +item|
|POST|/v1/deliverables/{id}/publish|Publish to students|FACULTY|200|
|POST|/v1/deliverables/{id}/close|Close submissions|FACULTY|200|
|DELETE|/v1/deliverables/{id}|Soft-delete<br>LARCHIVEM|ADMIN|204|



## Submissions 

|Method|Endpoint|Description|Role|Response|
|---|---|---|---|---|
|POST|/v1/submissions/upload-url|Get pre-signed<br>S3URL|STUDENT|200 + {url,key}|
|POST|/v1/deliverables/{id}/submissions|Create<br>submission|STUDENT|201 +item|
|GET|/v1/deliverables/{id}/submissions|List submissions|FACULTY|200 +array|
|GET|/v1/submissions/{id}|Get submission<br>detail|FACULTY,<br>owner|200 +item|
|DELETE|/v1/submissions/{id}|Withdraw|owner<br>STUDENT|204|



## Feedback & GradeBook 

|Method|Endpoint|Description|Role|Response|
|---|---|---|---|---|
|PUT|/v1/submissions/{id}/feedback|Create/update<br>grade|FACULTY|200 +item|
|GET|/v1/submissions/{id}/feedback|Get feedback|FACULTY,<br>owner|200 +item|
|POST|/v1/feedback/{id}/release|Release grade|FACULTY|200|
|GET|/v1/courses/{id}/gradebook|Full GradeBook|FACULTY,<br>ADMIN|200 +array|



PRAJNA — Low Level Design Document 

12 

|Method|Endpoint|Description|Role|Response|
|---|---|---|---|---|
|GET|/v1/courses/{id}/gradebook/export|Download CSV<br>or PDF|FACULTY,<br>ADMIN|200 +file|



## Teaching Schedule 

|Method|Endpoint|Description|Role|Response|
|---|---|---|---|---|
|POST|/v1/courses/{id}/sessions|Create session|FACULTY|201 +item|
|GET|/v1/courses/{id}/sessions|List sessions|FACULTY,STUDENT|200 +array|
|PUT|/v1/sessions/{id}|Reschedule|FACULTY|200 +item|
|DELETE|/v1/sessions/{id}|Cancel|FACULTY|204|
|GET|/v1/sessions/{id}/ics|Download ICS file|FACULTY,STUDENT|200 + .ics|



## Error Handling 

|Error Code|Error Code|HTTP|HTTP|Scenario|Scenario|
|---|---|---|---|---|---|
|DELIVERABLE_NOT_FOUND||404||Deliverable ID does not exist in DDB||
|DEADLINE_PASSED||422||Submission after due_date+gracePeriodMin||
|MAX_ATTEMPTS_EXCEEDED||422||Student has used all allowed attempts||
|MARKS_EXCEED_MAXIMUM||400||marksAwarded>maxMarks;rejected before DDB write||
|SCHEDULE_CONFLICT||409||New session overlaps existing session for same faculty||
|FILE_QUARANTINED||422||Virus scan failed;file quarantined||
|UNAUTHORIZED||403||Role mismatch or ownership violation||
|INTERNAL_ERROR||500||Sanitised message to client;full trace in CloudWatch||
|||||||
|7.Technology Choices||||||
|Area|Choice||Why||Alternatives|
|Language|TypeScript||PRAJNA constraint;strict typing;AWS SDK v3<br>support||Python—rejected<br>(constraint)|
|Primary DB|DynamoDB<br>Single Table||All access patterns are GetItem,Query on<br>PK/SK,or GSI Query—no joins,no<br>aggregations,no full-text search.Single-table<br>design scales infinitely,zero ops overhead,pay-<br>per-request billing.Every access pattern<br>verified before this decision.||Relational DB—not<br>required;no<br>complex joins or<br>aggregations exist<br>in this module|
|Caching|None<br>LDynamoDB<br>only)||DynamoDB GetItem is single-digit millisecond<br>latency—sufficient for current requirements.<br>Redis/ElastiCache adds infrastructure cost and<br>operational complexity without a proven need.||ElastiCache Redis<br>—deferred.DAX—<br>DynamoDB-only,<br>less flexible.|



PRAJNA — Low Level Design Document 

13 

|Area|Choice|Why|Alternatives|
|---|---|---|---|
|||Re-evaluate if p95latency exceeds SLA under<br>real load.||
|Inter-module<br>Comms|EventBridge<br>(event-driven)|Replaces all internal REST calls.Faculty and<br>course data needed by this module arrives via<br>EventBridge events(faculty.assigned.course,<br>student.enrolled)and is stored locally in DDB—<br>eliminating runtime coupling to other modules.|Internal REST calls<br>—rejected.Creates<br>tight coupling and<br>cascading failures if<br>the called module is<br>unavailable.|
|Cross-stack<br>Discovery|SSM Parameter<br>Store|Each CDK stack writes its resource ARNs/names<br>to SSM on deploy(e.g.<br>/prajna/auth/userPoolArn,<br>/prajna/teaching/tableArn).Consuming stacks<br>read from SSM at synth time using<br>ssm.StringParameter.valueFromLookup().No<br>hardcoded ARNs,no direct cross-stack CDK<br>imports across module boundaries.|CDK cross-stack<br>refs—rejected for<br>cross-module use;<br>creates implicit<br>deploy-order<br>coupling.<br>Hardcoded ARNs—<br>rejected;<br>environment-<br>specific.|
|Queue|SQS FIFO|Ordered,exactly-once submission processing.<br>DLQ for failed messages.|SNS—no ordering|
|Events|EventBridge|Decoupled fan-out to Notification and Analytics<br>modules.Schema registry enforces event<br>contracts.|Direct Lambda<br>invoke—tight<br>coupling|
|Validation|Zod|TypeScript-first schema validation.Whitelist<br>approach.Runtime type safety.|Joi—less<br>TypeScript-native|
|IaC|AWS CDK<br>LTypeScript)|PRAJNA constraint.Type-safe stacks.Reusable<br>constructs.|Terraform—<br>rejected<br>(constraint)|



## 8. Security Considerations 

## Authentication & Authorization 

All routes protected by Cognito JWT Authorizer on API Gateway 

- RBAC enforced in handlers: FACULTY, STUDENT, ADMIN roles from JWT claims 

- Faculty can only modify deliverables where instructorId = their userId 

- Students can only read/submit to enrolled courses; cannot see others' submissions 

## Data Privacy — Who Can See What? 

|Data|Visibility Rule|
|---|---|
|Deliverable DRAFT|Visible to creator faculty only;hidden from students until status=published|



PRAJNA — Low Level Design Document 

14 

|Data|Visibility Rule|
|---|---|
|Submissions|Student sees own onlyLGSI1oSTUDENT#);faculty sees all in their course|
|Grades/<br>Feedback|isReleased=false items filtered at service layer before returning to student|
|S3Files|submissions bucket:private;pre-signed URL generated per request with15min<br>expiry|



## Input Validation & Sensitive Data 

- All request bodies validated with Zod schemas in validators/ before reaching services/ 

- DynamoDB writes use ExpressionAttributeValues — no string interpolation in key conditions 

- S3 bucket names and EventBridge ARNs read from SSM Parameter Store at Lambda cold start 

- ] 

- All DynamoDB data encrypted at rest via AWS managed keys; S3 SSE S3 encryption 

- TLS 1.2+ enforced at API Gateway and S3 

## 9. Testing Strategy 

|Level|Tool|What is tested|
|---|---|---|
|Unit Tests|JestLTypeScript) —<br>in tests/|Service layer logic in isolation:deliverable state transitions,grade<br>calculation,GradeBook aggregation.All adapters mocked via<br>jest.mock.Target: 80%+coverage.|
|Integration<br>Tests|Jest+LocalStack|adapters/tested against LocalStack DynamoDB—validates actual<br>PK/SK write/read patterns,GSI queries,and conditional write<br>behaviour for GradeBook.S3adapter tested for pre-signed URL<br>generation.|
|API Tests|Supertest|HTTP-level tests against dev API Gateway.Validates faculty and<br>student role access,response schemas,error codes.|
|E2E Tests|Playwright|Full faculty teaching flow in staging:faculty creates deliverable →<br>student submits → faculty grades → faculty releases → student<br>sees grade record.|
|Load Tests|Artillery|500concurrent submissions against DynamoDB on-demand<br>capacity.Target p95 � 300ms.Validates DynamoDB scales<br>without throttling.|
|Security Tests|OWASP ZAP|Validates faculty-only routes reject student tokens;student-owned<br>records not accessible by other students.|



## 10. CDK / Infrastructure 

## AWS Resources Required 

PRAJNA — Low Level Design Document 

15 

|Resource|Config|Purpose|
|---|---|---|
|API Gateway<br>LRESTM|Regional;Cognito Authorizer;Usage Plans|Route all/v1/*to Lambdas|
|Lambda x6|Node.js20.x; 512MB; 30s timeout;VPC<br>private subnet|One per service handler|
|Lambda<br>LScanLambda)|Node.js20.x; 1024MB;S3event trigger|ClamAV virus scan|
|DynamoDB|Single table:prajna-teaching;on-demand<br>billing;PITR enabled;GSI1on GSI1PK;<br>encryption via AWS managed key|Stores deliverables,submissions,<br>feedback,sessions,GradeBook|
|S3 � 3|Versioning on submissions;lifecycle<br>IA→Glacier|deliverable-assets,submissions,<br>grade-reports|
|CloudFront|Distribution for deliverable-assets;signed<br>URLs|Low-latency file delivery|
|SQS FIFO|submission-grading-queue+DLQ|Async submission buffer|
|EventBridge|Default bus;module-specific rules|Domain event fan-out|
|EventBridge<br>Scheduler|Cron every30min|Deadline-approaching checks|
|SSM Parameter<br>Store|Resource ARNs and names written on<br>deploy;read by Lambdas at cold start via<br>ssm.StringParameter.valueFromLookup()|Cross-stack resource discovery—no<br>hardcoded ARNs|
|CloudWatch+X]<br>Ray|Structured JSON logs;distributed tracing|Observability across all Lambdas|



## CDK Stack: CourseDeliverablesStack 

- DynamoDBConstruct — creates prajna-teaching table with GSI1; PITR enabled; on-demand billing; writes table ARN to SSM at /prajna/teaching/tableArn 

- ] 

- StorageConstruct — 3 S3 buckets; lifecycle, versioning, SSE S3 encryption; writes bucket names to SSM 

- LambdaConstruct x 7 — reads DDB table name, S3 bucket names, EventBridge ARN from SSM at synth time via ssm.StringParameter.valueFromLookup(); injects as env vars 

- ApiConstruct — API Gateway; reads CognitoUserPoolArn from SSM at /prajna/auth/userPoolArn (written by AuthStack on deploy) 

- EventBridgeConstruct — creates EventBridge rules for each domain event; reads consuming module Lambda ARNs from SSM (e.g. /prajna/notification/handlerArn) 

## SSM Parameter Store — Cross-Stack Discovery Pattern 

This module follows a publish-then-consume SSM pattern. On every deploy, each CDK stack ' writes its outputs to SSM. Other stacks read from SSM — never import each other s stacks 

PRAJNA — Low Level Design Document 

16 

directly. This means stacks can be deployed independently in any order after the first bootstrap. 

|SSM Parameter Path|Written by|Read by|
|---|---|---|
|/prajna/auth/userPoolArn|AuthStack|CourseDeliverablesStackLAPI Gateway<br>Authorizer)|
|/prajna/network/vpcId|NetworkStack|CourseDeliverablesStackLLambda VPC<br>config)|
|/prajna/network/privateSubnetIds|NetworkStack|CourseDeliverablesStackLLambda VPC<br>config)|
|/prajna/teaching/tableArn|CourseDeliverablesStack|Analytics,Notification stacks|
|/prajna/teaching/apiUrl|CourseDeliverablesStack|Portal/Frontend stack|
|/prajna/notification/handlerArn|NotificationStack|CourseDeliverablesStackLEventBridge<br>target)|
|/prajna/analytics/handlerArn|AnalyticsStack|CourseDeliverablesStackLEventBridge<br>target)|



## 11. Risks & Mitigation 

|Risk|Impact|Mitigation|
|---|---|---|
|DynamoDB hot partition during<br>peak submission|MEDIUM|PK�DELIVERABLE#{deliverableId}distributes<br>across DDB partitions naturally;on-demand capacity<br>auto-scales;SQS FIFO buffers burst submissions so<br>Lambda processes at a controlled rate|
|GSI eventually consistent reads<br>return stale GradeBook data|LOW|GradeBook is read via strongly consistent GetItem<br>on base tableLPK�SKM,not via GSI—eventual<br>consistency risk does not apply to this access<br>pattern|
|S3pre-signed URL abused to<br>upload malicious files|HIGH|MIME whitelist on URL generation;S3bucket policy<br>rejects wrong Content-Type;ClamAV ScanLambda<br>quarantines infected files|
|GradeBook race condition(two<br>feedback.released events arrive<br>simultaneously)|MEDIUM|DynamoDB conditional write on lastCalculated<br>timestamp(optimistic locking);second writer retries|
|EventBridge event loss|MEDIUM|EventBridge retry3attempts;DLQ for undelivered<br>events;manual replay Lambda documented|
|Grade data visible to wrong<br>student|CRITICAL|isReleased gate enforced at service layer;studentId<br>ownership check on every feedback GET;E2E test<br>specifically covers this scenario|
|Single DDB table item size<br>exceeds400KB limit for large<br>rubrics or annotations|LOW|Rubric stored as Map on deliverable item;<br>annotations stored as separate FILE#items if large;<br>monitored via CloudWatch|



PRAJNA — Low Level Design Document 

17 

## 12. Milestones & Timeline 

|Week|Deliverable|
|---|---|
|Week1^2|LLD completed|
|Week3^4||
|Week5^6||
|Week7^8||
|Week9^10||
|Week11^12||



## 13. Open Questions 

- 1.Are there any additional deliverable types or teaching interactions this module should support that are not yet in the requirements? 

## 14. Self-Assessment — Amazon Leadership Principles 

Review all 14 LPs. Pick your top 3 demonstrated and top 3 needing improvement. Provide examples from this LLD/project work. 

- ��> Customer Obsession 

- ��> Ownership 

- ��> Invent and Simplify 

- ��> Are Right, A Lot 

- ��> Learn and Be Curious 

- ��> Hire and Develop the Best 

- ��> Insist on the Highest Standards 

- ��> Think Big 

- ��> Bias for Action 

- ���> Frugality 

- ���> Earn Trust 

- ���> Dive Deep 

- ���> Have Backbone; Disagree and Commit 

PRAJNA — Low Level Design Document 

18 

## ���> Deliver Results 

## Top 3 I Demonstrated: 

|LP|Example from this work|
|---|---|
|1.Dive Deep|Researched DynamoDB single-table design cold start behaviour and<br>access pattern trade-offs in depth rather than accepting a default<br>relational DB approach—raised it as a justified architecture decision with<br>full access pattern verification|
|2.Insist on the Highest<br>Standards|Defined immutable DynamoDB audit logs with IAM-enforced PutItem-only<br>policy rather than a simpler soft-delete approach—refused to<br>compromise on audit integrity|
|3.Invent and Simplify|Used S3pre-signed URLs to remove the API layer from the file upload path<br>entirely—simpler architecture,better performance,lower cost|



## Top 3 I Need to Work On: 

|LP|Reflection|
|---|---|
|1.Think Big|The initial scope focused only on current requirements.Future-looking features like<br>peer review and attendance tracking were only noted as footnotes rather than<br>designed into the schema from the start|
|2.Bias for Action|Spent too long debating the primary database choice for the module.Should have<br>time-boxed the decision earlier and moved to prototyping|
|3.Earn Trust|Need to proactively communicate LLD progress and blockers to the team rather than<br>waiting for review sessions.Will set up weekly design checkpoints|



## 15. References 

## HLD doc: 

AWS CDK TypeScript Reference — https://docs.aws.amazon.com/cdk/api/v2/docs/awsconstruct-library.html 

PRAJNA LLD v1.3 _ Course Deliverables & Teaching (moduleId: teaching) — EndofDocument 

PRAJNA — Low Level Design Document 

19 

