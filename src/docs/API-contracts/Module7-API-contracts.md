# Module 7 API contracts

Created by: Greeshmitha Bingumalla
Created time: June 10, 2026 6:36 PM
Last edited by: Greeshmitha Bingumalla
Last updated time: June 10, 2026 6:38 PM

# Module 7 — Faculty Profile API Contracts

**Module:** Module 7 — Personal & Professional Profile

**Version:** 1.0

**Owner:** Faculty Data Module SME

**Status:** Draft

---

# 1. Overview

This document defines the REST API contracts exposed by Module 7 — Personal & Professional Profile.

The APIs provide standardized access to:

- faculty profile metadata,
- organizational hierarchy,
- qualification information,
- approver hierarchy,
- and faculty lookup operations.

All APIs are exposed through API Gateway and protected using Cognito JWT authentication.

---

# 2. Base Path

```
/faculty
```

---

# 3. Authentication

All APIs require:

```
Authorization: Bearer <JWT>
```

JWT claims contain:

```json
{
  "sub": "FAC123",
  "role": "HOD",
  "campus": "BENGALURU"
}
```

---

# 4. Authorization Rules

| Role | Permissions |
| --- | --- |
| FACULTY | Manage own profile |
| HOD | View department faculty |
| DIRECTOR | Campus-level visibility |
| PVC | Institution-wide visibility |
| ADMIN | Administrative operations |

Cross-campus access is forbidden unless explicitly authorized.

---

# 5. API Response Standards

## Success Response

```json
{
  "status": "SUCCESS",
  "data": {}
}
```

---

## Error Response

```json
{
  "status": "ERROR",
  "errorCode": "FORBIDDEN",
  "message": "Access denied"
}
```

---

# 6. Endpoints

---

## 6.1 Get Logged-In Faculty Profile

### Endpoint

```
GET /faculty/me
```

### Description

Fetch currently authenticated faculty profile.

### Authorization

| Role | Access |
| --- | --- |
| All authenticated users | Allowed |

---

### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "facultyId": "FAC123",
    "firstName": "Greeshmitha",
    "lastName": "B",
    "designation": "Assistant Professor",
    "department": "CSE",
    "school": "Engineering"
  }
}
```

---

## 6.2 Get Faculty Profile By ID

### Endpoint

```
GET /faculty/{facultyId}
```

### Description

Fetch faculty profile using facultyId.

### Authorization

| Role | Access |
| --- | --- |
| FACULTY | Own profile only |
| HOD | Department faculty |
| DIRECTOR | Campus faculty |
| PVC | Institution-wide |

---

### Path Parameters

| Parameter | Type |
| --- | --- |
| facultyId | string |

---

### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "facultyId": "FAC123",
    "designation": "Associate Professor",
    "researchInterests": [
      "AI",
      "Distributed Systems"
    ]
  }
}
```

---

## 6.3 Update Faculty Profile

### Endpoint

```
PUT /faculty/profile
```

### Description

Update faculty personal and professional profile metadata.

### Authorization

| Role | Access |
| --- | --- |
| FACULTY | Own profile only |

---

### Request Body

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

### Response

```json
{
  "status": "SUCCESS",
  "facultyId": "FAC123",
  "updatedAt": "2026-06-04T10:30:00Z"
}
```

---

## 6.4 Update Profile Photo

### Endpoint

```
PATCH /faculty/profile/photo
```

### Description

Update profile photo metadata after successful S3 upload.

### Authorization

| Role | Access |
| --- | --- |
| FACULTY | Own profile only |

---

### Request Body

```json
{
  "profilePhotoUrl": "s3://profile-bucket/photo.png"
}
```

---

### Response

```json
{
  "status": "SUCCESS",
  "message": "Profile photo updated"
}
```

---

## 6.5 Get Faculty Contact Details

### Endpoint

```
GET /faculty/{facultyId}/contact
```

### Description

Fetch faculty contact metadata.

### Authorization

| Role | Access |
| --- | --- |
| Module 16 | Allowed |
| HOD | Department-only |
| DIRECTOR | Campus-only |

---

### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "email": "faculty@university.edu",
    "contactNumber": "+91XXXXXXXXXX"
  }
}
```

---

## 6.6 Get Faculty By Department

### Endpoint

```
GET /faculty/department/{department}
```

### Description

Fetch all faculty belonging to a department.

### Authorization

| Role | Access |
| --- | --- |
| HOD | Own department |
| DIRECTOR | Campus departments |
| PVC | Institution-wide |

---

### Response

```json
{
  "status": "SUCCESS",
  "data": [
    {
      "facultyId": "FAC123",
      "name": "Greeshmitha",
      "designation": "Professor"
    }
  ]
}
```

---

## 6.7 Get Faculty By School

### Endpoint

```
GET /faculty/school/{school}
```

### Description

Fetch faculty grouped under a school.

---

## 6.8 Get Faculty By Role

### Endpoint

```
GET /faculty/role/{role}
```

### Description

Fetch faculty using organizational role.

Example:

- HOD
- DIRECTOR
- DEAN

---

## 6.9 Resolve Approver Hierarchy

### Endpoint

```
GET /faculty/approver
```

### Description

Resolve reporting/approval hierarchy for current faculty.

### Consumer Modules

- Module 13
- Module 18

---

### Response

```json
{
  "status": "SUCCESS",
  "data": {
    "approverId": "FAC456",
    "role": "HOD"
  }
}
```

---

## 6.10 Add Qualification

### Endpoint

```
POST /faculty/qualification
```

### Description

Add qualification metadata.

### Request Body

```json
{
  "degree": "PhD",
  "specialization": "Artificial Intelligence",
  "university": "IIT Hyderabad",
  "yearOfCompletion": 2021
}
```

---

### Response

```json
{
  "status": "SUCCESS",
  "message": "Qualification added"
}
```

---

## 6.11 Get Qualification Metadata

### Endpoint

```
GET /faculty/{facultyId}/qualifications
```

### Description

Fetch qualification metadata for faculty.

---

## 6.12 Find Faculty By ORCID

### Endpoint

```
GET /faculty/orcid/{orcidId}
```

### Description

Find faculty using ORCID identifier.

---

## 6.13 Get Organizational Hierarchy

### Endpoint

```
GET /faculty/hierarchy
```

### Description

Fetch campus → school → department hierarchy metadata.

---

## 6.14 Get Faculty By Designation

### Endpoint

```
GET /faculty/designation/{designation}
```

### Description

Fetch faculty grouped by designation.

---

# 7. Validation Rules

| Field | Validation |
| --- | --- |
| email | Valid institutional email |
| contactNumber | Valid phone number |
| orcidId | ORCID format validation |
| yearOfCompletion | Valid graduation year |
| profilePhotoUrl | Valid S3 object reference |

---

# 8. Standard Error Codes

| Error Code | HTTP Status |
| --- | --- |
| INVALID_PAYLOAD | 400 |
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| PROFILE_NOT_FOUND | 404 |
| DUPLICATE_ORCID | 409 |
| DATABASE_ERROR | 500 |
| INTERNAL_SERVER_ERROR | 500 |

---

# 9. Event Emission Triggers

| Operation | Event |
| --- | --- |
| Profile Created | FacultyCreated |
| Profile Updated | ProfileUpdated |
| Qualification Added | QualificationAdded |
| Role Updated | RoleChanged |

---

# 10. Versioning Strategy

Current API version:

```
v1
```

Recommended future structure:

```
/api/v1/faculty
```

Backward compatibility should be maintained for downstream module integrations.