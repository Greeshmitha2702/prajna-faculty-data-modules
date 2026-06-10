# Faculty Data Module Strategy Doc

Created by: Greeshmitha Bingumalla
Created time: May 20, 2026 10:53 PM
Category: Strategy doc
Last edited by: Greeshmitha Bingumalla
Last updated time: May 21, 2026 7:50 PM

# PRAJNA – Faculty Data Modules Strategic Document

## 1. Introduction

The Faculty Data Modules are a core foundation of PRAJNA. These modules manage essential faculty-related information, including:

- Personal & Professional Profiles
- Research Publications & Innovation
- Course Deliverables & Teaching
- Timetables
- Achievements & Recognitions
- Faculty Development Activities
- Administrative & Lifecycle Information

These modules act as the primary source of truth for faculty-related data across PRAJNA and support downstream systems such as:

- AI Companion
- PRAJNA Score Engine
- Leader boards
- Reports & Analytics
- Approval Workflows
- Dynamic To-Do Engine
- Dashboards

---

## 2. Vision

Build a scalable, maintainable, and standardized faculty data ecosystem that enables PRAJNA to deliver intelligent insights, AI-driven assistance, prioritization support, score computation, reporting, and personalized faculty experiences across all campuses.

---

## 3. Team Structure

The Faculty Data Team consists of six sub-modules:

| Sub Module | Owner |
| --- | --- |
| Personal & Professional Profile | Greeshmitha |
| Administrative & Lifecycle | Greeshmitha |
| Research & Innovation | Abhigna |
| Achievements & Recognition | Harshitha Reddy |
| Faculty Development & Growth | P Chaitanya |
| Course Deliverables & Teaching | TBD |

---

## 4. Ownership Model

- Each sub-module is owned by its respective assignee.
- The complete Faculty Data Domain is led by Greeshmitha (SME/Team Lead).
- Any pull request related to Faculty Data Modules must be reviewed and approved by the Mentor before merging into the main branch.
- Module owners are responsible for:
    - architecture decisions
    - API implementation
    - testing
    - documentation
    - event integration
    - maintaining coding standards

---

## 5. Engineering & Development Standards

### 5.1 Naming Conventions

Consistent naming conventions must be maintained across all resources to improve maintainability and observability.

This includes:

- CDK stacks
- Lambda functions
- API routes
- DynamoDB tables
- EventBridge events
- S3 buckets
- environment variables
- branches

Example naming patterns:

- `faculty-profile-service`
- `research-publication-handler`
- `faculty.profile.updated`

---

### 5.2 Configuration & Secrets Management

Sensitive information must never be hardcoded in source code.

- Environment variables should be used for local development.
- `.env` files must be added to `.gitignore`.
- Production secrets should be securely managed using:
    - AWS Secrets Manager
    - AWS Systems Manager Parameter Store

---

### 5.3 Code Standards

- TypeScript should be used across all modules.
- Consistent folder structures must be maintained.
- Reusable utilities should be preferred over duplicated logic.
- Proper linting and formatting standards should be followed.

---

## 6. Architecture Collaboration & Decision Making

Architectural disagreements are expected in large-scale systems since multiple implementation approaches may exist for the same problem.

To ensure healthy collaboration:

- Architectural decisions should be documented clearly.
- Tradeoffs for each approach should be discussed.
- Decisions should prioritize:
    - scalability
    - maintainability
    - simplicity
    - integration compatibility
    - cost efficiency

The goal is to make technically justified decisions collaboratively, rather than through assumptions or conflict.

---

## 7. Version Control & Code Management

### 7.1 Commit Strategy

- Commits should be small and atomic.
- Each commit should focus on one logical change.
- Clear and meaningful commit messages must be used.
- Direct commits to the `main` branch are strictly prohibited.

Example:

- `feat: add faculty profile image upload`
- `fix: resolve duplicate DOI validation`

---

### 7.2 Branching Strategy

- Branch names should clearly indicate their purpose.
- Feature branches should remain short-lived.
- Once reviewed and merged, branches should be deleted.

Example:

- `feature/research-module`
- `bugfix/profile-validation`

---

## 8. Pull Request Review Process

No pull request should be merged unless all the following conditions are satisfied:

- successful testing is completed
- linting checks pass
- Mentor approval is received
- no merge conflicts exist

Pull requests should contain:

- a clear description
- screenshots/logs if applicable
- testing notes
- impacted modules/events

---

## 9. Documentation Standards

Each module must maintain its own README documentation for better maintainability and onboarding.

The README should include:

- module purpose
- architecture overview
- API endpoints
- setup instructions
- environment variables
- deployment instructions
- event integrations
- known limitations

---

## 10. Meeting Structure & Communication

### Daily Standup

- Duration: 10–15 minutes
- Discussion points:
    - work completed
    - current blockers
    - next planned tasks

### Weekly Team Meeting

- Full Faculty Data Team sync
- Architecture discussions
- Integration updates
- Risk tracking

### SME Coordination

SMEs may conduct separate discussions regarding:

- inter-module dependencies
- shared architecture decisions
- integration planning

---

## 11. Communication & Escalation Process

- Any technical issue should first be communicated to the SME.
- If unresolved, it should be escalated to the Project Lead.
- If further clarification is required, mentors should be consulted.

Team members are expected to acknowledge important technical queries within a reasonable timeframe.

If an issue cannot be resolved effectively through messages, calls or meetings should be arranged to clarify more quickly.

---

## 12. API & Event Dependency Management

Any changes affecting:

- API contracts
- event payloads
- database schemas
- shared interfaces

must be communicated to dependent modules before implementation.

This is necessary to avoid:

- integration failures
- breaking changes
- deployment delays

---

## 13. Risk Management

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Inconsistent event payloads | Integration failures | Shared schema validation |
| Long-lived branches | Merge conflicts | Short-lived feature branches |
| Poor communication | Delayed delivery | Daily standups |
| Unreviewed architecture decisions | Integration inconsistencies | SME architectural reviews |
| Missing documentation | Onboarding and debugging difficulties | Mandatory README maintenance |

---

## 14. Success Metrics

The success of the Faculty Data Team will be measured using the following indicators:

- 100% module integration compatibility
- Zero direct commits to main branch
- Pull request review turnaround within 24 hours
- 90% task completion within planned sprint timelines
- Consistent API and event naming standards across modules
- Successful inter-module communication without breaking changes

---

## 15. Blocker Escalation Workflow

Blockers should be raised early to avoid delays in integration and sprint timelines.

### Escalation Flow

1. Self Research & Debugging
    - Attempt debugging, documentation review, and basic troubleshooting first.
2. Team Discussion
    - If unresolved, discuss with teammates or related module owners.
3. SME Escalation
    - If still blocked, escalate to the SME/Team Lead for guidance.
4. Project Lead / Mentor Escalation
    - Critical architecture, dependency, or integration blockers should be escalated to project leads or mentors.

### When Raising a Blocker, Include

- clear issue summary
- what was attempted
- error logs/screenshots (if applicable)
- impacted modules/services
- current impact on development
- support needed

## 16. Module LLD Documents

| **Module** | **LLD Link** |
| --- | --- |
| Module 7 — Personal & Professional Profile | TBD |
| Module 8— Course Deliverables & Teaching | TBD |
| Module 9—  Research & Innovation | TBD |
| Module 10— Achievements & Recognition | TBD |
| Module 11— Faculty Development & Growth | TBD |
| Module 12— Administrative & Lifecycle | TBD |

## 17. Conclusion

The Faculty Data Modules serve as one of the foundational systems within PRAJNA. Since multiple downstream systems depend on these modules, maintaining consistency, scalability, communication, and engineering discipline is critical.

This strategic document establishes the engineering standards, collaboration practices, and governance model required to ensure successful delivery of the Faculty Data ecosystem within PRAJNA.

[Untitled](Untitled%2036715c9a4d6d806890f7e8470989f586.csv)