# Module 7 events

Created time: June 18, 2026 11:16 AM
Last edited by: Greeshmitha Bingumalla
Last updated time: June 18, 2026 11:17 AM

# Module 7 - Event Integration Contract

## Events Published by Module 7

### 1. FacultyCreated

Producer:

- Module 7 – Personal & Professional Profile

Consumers:

- Module 14 – Score Engine
- Module 16 – Notification Engine
- Module 20 – AI Companion
- Dashboard Modules

Payload:

```json
{
  "eventType": "FacultyCreated",
  "facultyId": "FAC123",
  "campus": "BENGALURU",
  "school": "ENGINEERING",
  "department": "CSE",
  "role": "FACULTY",
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

### 2. ProfileUpdated

Producer:

- Module 7 – Personal & Professional Profile

Consumers:

- Module 14 – Score Engine
- Module 16 – Notification Engine
- Module 20 – AI Companion
- Module 23 – Dynamic ToDo Engine
- Dashboard Modules

Payload:

```json
{
  "eventType": "ProfileUpdated",
  "facultyId": "FAC123",
  "campus": "BENGALURU",
  "updatedFields": [
    "designation",
    "researchInterests"
  ],
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

### 3. QualificationAdded

Producer:

- Module 7 – Personal & Professional Profile

Consumers:

- Module 14 – Score Engine
- Module 16 – Notification Engine
- Module 20 – AI Companion
- Module 13 – Approval Workflow Engine (if approval required)

Payload:

```json
{
  "eventType": "QualificationAdded",
  "facultyId": "FAC123",
  "qualificationId": "QUAL001",
  "degree": "PhD",
  "specialization": "Artificial Intelligence",
  "yearOfCompletion": 2021,
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

### 4. RoleChanged

Producer:

- Module 7 – Personal & Professional Profile

Consumers:

- Module 13 – Approval Workflow Engine
- Module 14 – Score Engine
- Module 16 – Notification Engine
- Module 20 – AI Companion
- Dashboard Modules

Payload:

```json
{
  "eventType": "RoleChanged",
  "facultyId": "FAC123",
  "previousRole": "FACULTY",
  "newRole": "HOD",
  "campus": "BENGALURU",
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

### 5. ProfilePhotoUpdated

Producer:

- Module 7 – Personal & Professional Profile

Consumers:

- Dashboard Modules
- Module 20 – AI Companion

Payload:

```json
{
  "eventType": "ProfilePhotoUpdated",
  "facultyId": "FAC123",
  "profilePhotoUrl": "s3://profile-bucket/photo.png",
  "timestamp": "2026-06-18T10:00:00Z"
}
```

---

## Events Consumed by Module 7

Currently Module 7 is an Authoritative Data Provider module.

Module 7 primarily exposes APIs and publishes events.

No mandatory event consumers have been identified in the current LLD.

Consumed Events:

- None (Current Design)

Future Possibilities:

- FacultyImported (HR System)
- EmployeeCreated (ERP Integration)
- UserActivated (Authentication Module)

These are not part of the current scope.

```

```