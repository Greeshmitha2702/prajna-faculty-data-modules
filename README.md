# PRAJNA Module 8 – Course Deliverables & Teaching

This repository contains the complete Serverless Implementation for PRAJNA Module 8 (Course Deliverables & Teaching) using Node.js 22, AWS Lambda, API Gateway Proxy V2, DynamoDB, EventBridge, and AWS CDK v2.

## Features implemented:

- **Phase 1: Models** – `Deliverable`, `Submission`, `Feedback`, `TeachingSession`, `GradeBookSummary`, etc.
- **Phase 2: Validators** – Zod schemas for all models and DTOs.
- **Phase 3: Adapters** – DynamoDB (Single Table Design), S3 (Pre-signed URL uploads/downloads), EventBridge (Event Publishing).
- **Phase 4: Repositories** – DDB persistence layers for all aggregates.
- **Phase 5: Services** – Business logic, RBAC, state validations, event emitting.
- **Phase 6: Lambda Handlers** – API Gateway proxy V2 compatible handlers with DI.
- **Phase 7: CDK Constructs** – Shared constructs mapped via SSM from Module 3 and 5.
- **Phase 8: Stack Wiring** – `PrajnaTeachingStack` deployment stack.
- **Phase 9: API Implementations** – Full REST API mapping in `ApiIntegrationConstruct`.
- **Phase 10: Tests** – Jest unit testing.

## Build and Deployment

### Setup

```bash
npm install
```

### Build & Test

```bash
npm run lint
npm run build
npm run test
```

### CDK Synth

```bash
npm run cdk:synth
```

### Deployment

Deploy to the `dev` stage (Requires valid AWS credentials and configured shared modules):

```bash
npx cdk deploy --context stage=dev --all
```
