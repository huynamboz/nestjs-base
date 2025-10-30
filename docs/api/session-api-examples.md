# Photobooth Session API - Complete Examples

## Overview

This document provides comprehensive, real-world examples for using the Photobooth Session Management API. All examples include actual curl commands and expected responses.

## Prerequisites

- Server running on `http://localhost:3000`
- Valid user account with appropriate permissions
- JWT token for authentication

---

## Complete User Journey Examples

### Example 1: Wedding Photobooth Session

#### Step 1: User Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bride@example.com",
    "password": "wedding2024"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson"
  }
}
```

#### Step 2: Check Available Photobooths
```bash
curl -X GET http://localhost:3000/api/v1/photobooth/available \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token"
```

**Response:**
```json
[
  {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "description": "Elegant photobooth for wedding ceremonies",
    "status": "available",
    "location": "Reception Hall",
    "isActive": true,
    "currentSessionId": null,
    "createdAt": "2025-10-27T06:41:55.309Z",
    "updatedAt": "2025-10-27T08:06:00.519Z"
  },
  {
    "id": "photobooth-456",
    "name": "Garden Photobooth",
    "description": "Outdoor photobooth in the garden",
    "status": "available",
    "location": "Garden Pavilion",
    "isActive": true,
    "currentSessionId": null,
    "createdAt": "2025-10-27T06:41:55.309Z",
    "updatedAt": "2025-10-27T08:06:00.519Z"
  }
]
```

#### Step 3: Create Wedding Session
```bash
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "photobooth-123",
    "maxPhotos": 10,
    "notes": "Wedding ceremony photos - Bride and Groom"
  }'
```

**Note:** The `userId` is automatically extracted from the JWT token in the Authorization header. You don't need to include it in the request body.

**Response:**
```json
{
  "id": "session-wedding-001",
  "status": "pending",
  "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson",
    "role": {
      "id": "role-user-001",
      "name": "user"
    }
  },
  "photoboothId": "photobooth-123",
  "photobooth": {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "description": "Elegant photobooth for wedding ceremonies",
    "status": "busy",
    "location": "Reception Hall",
    "isActive": true,
    "currentSessionId": "session-wedding-001"
  },
  "photos": [],
  "startedAt": null,
  "completedAt": null,
  "expiresAt": "2025-10-27T16:30:00.000Z",
  "photoCount": 0,
  "maxPhotos": 10,
  "notes": "Wedding ceremony photos - Bride and Groom",
  "createdAt": "2025-10-27T15:30:00.000Z",
  "updatedAt": "2025-10-27T15:30:00.000Z"
}
```

#### Step 4: Start Session
```bash
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/start \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "session-wedding-001",
  "status": "active",
  "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson"
  },
  "photoboothId": "photobooth-123",
  "photobooth": {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "status": "busy",
    "location": "Reception Hall"
  },
  "photos": [],
  "startedAt": "2025-10-27T15:32:15.000Z",
  "completedAt": null,
  "expiresAt": "2025-10-27T16:30:00.000Z",
  "photoCount": 0,
  "maxPhotos": 10,
  "notes": "Wedding ceremony photos - Bride and Groom"
}
```

#### Step 5: Upload Images and Add to Session

**Step 5a: Upload Images**
```bash
# Upload Photo 1 - Bride and Groom
curl -X POST http://localhost:3000/api/v1/photobooth/upload-image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -F "file=@/path/to/bride-groom-photo.jpg"

# Upload Photo 2 - Wedding Party
curl -X POST http://localhost:3000/api/v1/photobooth/upload-image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -F "file=@/path/to/wedding-party-photo.jpg"

# Upload Photo 3 - Family Photo
curl -X POST http://localhost:3000/api/v1/photobooth/upload-image \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -F "file=@/path/to/family-photo.jpg"
```

**Upload Response (Photo 1):**
```json
{
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1732740000/photoboth/uploads/bride-groom-photo.jpg",
  "publicId": "bride-groom-photo"
}
```

**Step 5b: Add Photos to Session**
```bash
# Add Photo 1 to session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/photos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1732740000/photoboth/uploads/bride-groom-photo.jpg",
    "publicId": "bride-groom-photo",
    "caption": "Bride and Groom - First Look"
  }'

# Add Photo 2 to session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/photos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1732740001/photoboth/uploads/wedding-party-photo.jpg",
    "publicId": "wedding-party-photo",
    "caption": "Wedding Party Group Photo"
  }'

# Add Photo 3 to session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/photos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1732740002/photoboth/uploads/family-photo.jpg",
    "publicId": "family-photo",
    "caption": "Family Photo - Both Sides"
  }'
```

**Response (Photo 1):**
```json
{
  "id": "photo-wedding-001",
  "sessionId": "session-wedding-001",
  "session": {
    "id": "session-wedding-001",
    "status": "active",
    "photoCount": 1,
    "maxPhotos": 10
  },
  "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-001.jpg",
  "publicId": null,
  "thumbnailUrl": null,
  "order": 1,
  "caption": "Bride and Groom - First Look",
  "isProcessed": false,
  "processedAt": null,
  "createdAt": "2025-10-27T15:33:45.000Z",
  "updatedAt": "2025-10-27T15:33:45.000Z"
}
```

#### Step 6: Check Session Status
```bash
curl -X GET http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token"
```

**Response:**
```json
{
  "id": "session-wedding-001",
  "status": "active",
  "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson"
  },
  "photoboothId": "photobooth-123",
  "photobooth": {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "status": "busy",
    "location": "Reception Hall"
  },
  "photos": [
    {
      "id": "photo-wedding-001",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-001.jpg",
      "order": 1,
      "caption": "Bride and Groom - First Look",
      "isProcessed": false,
      "createdAt": "2025-10-27T15:33:45.000Z"
    },
    {
      "id": "photo-wedding-002",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-002.jpg",
      "order": 2,
      "caption": "Wedding Party Group Photo",
      "isProcessed": false,
      "createdAt": "2025-10-27T15:34:12.000Z"
    },
    {
      "id": "photo-wedding-003",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-003.jpg",
      "order": 3,
      "caption": "Family Photo - Both Sides",
      "isProcessed": false,
      "createdAt": "2025-10-27T15:34:38.000Z"
    }
  ],
  "startedAt": "2025-10-27T15:32:15.000Z",
  "completedAt": null,
  "expiresAt": "2025-10-27T16:30:00.000Z",
  "photoCount": 3,
  "maxPhotos": 10,
  "notes": "Wedding ceremony photos - Bride and Groom"
}
```

#### Step 7: Complete Session
```bash
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "session-wedding-001",
  "status": "completed",
  "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson"
  },
  "photoboothId": "photobooth-123",
  "photobooth": {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "status": "available",
    "location": "Reception Hall",
    "currentSessionId": null
  },
  "photos": [
    {
      "id": "photo-wedding-001",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-001.jpg",
      "order": 1,
      "caption": "Bride and Groom - First Look"
    },
    {
      "id": "photo-wedding-002",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-002.jpg",
      "order": 2,
      "caption": "Wedding Party Group Photo"
    },
    {
      "id": "photo-wedding-003",
      "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-003.jpg",
      "order": 3,
      "caption": "Family Photo - Both Sides"
    }
  ],
  "startedAt": "2025-10-27T15:32:15.000Z",
  "completedAt": "2025-10-27T15:35:22.000Z",
  "expiresAt": "2025-10-27T16:30:00.000Z",
  "photoCount": 3,
  "maxPhotos": 10,
  "notes": "Wedding ceremony photos - Bride and Groom"
}
```

---

## Error Handling Examples

### Example 1: Try to Create Session with Busy Photobooth

```bash
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "photobooth-123",
    "maxPhotos": 5
  }'
```

**Error Response:**
```json
{
  "statusCode": 409,
  "message": "Photobooth already has an active session",
  "error": "Conflict"
}
```

### Example 2: Try to Take Photo in Completed Session

```bash
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001/photos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://wedding-photos.com/session-wedding-001/photo-004.jpg",
    "caption": "Additional photo"
  }'
```

**Error Response:**
```json
{
  "statusCode": 422,
  "message": "Session is not active",
  "error": "Unprocessable Entity"
}
```

### Example 3: Try to Access Session with Invalid Token

```bash
curl -X GET http://localhost:3000/api/v1/photobooth/sessions/session-wedding-001 \
  -H "Authorization: Bearer invalid_token"
```

**Error Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Example 4: Try to Access Non-existent Session

```bash
curl -X GET http://localhost:3000/api/v1/photobooth/sessions/non-existent-session \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiY2Q0ZWE4YS0xMjM0LTQ1NjctODkwYS0xMjM0NTY3ODkwYWJjIiwiaWF0IjoxNzYxNTc3MzY4LCJpc3MiOiJuZXN0anMtYXBwIiwiZXhwIjoxNzY0MTY5MzY4fQ.example_token"
```

**Error Response:**
```json
{
  "statusCode": 404,
  "message": "Session not found",
  "error": "Not Found"
}
```

### Example 5: Try to Cancel Completed Session

```bash
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/sessions/session-wedding-001/cancel \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Cannot cancel completed session",
  "error": "Bad Request"
}
```

### Example 6: Try to Cancel Session Without Admin Role

```bash
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/sessions/session-id/cancel \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Error Response:**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin role required",
  "error": "Forbidden"
}
```

---

## Admin Management Examples

### Example 1: Admin Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@photoboth.com",
    "password": "Admin123!"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token",
  "user": {
    "id": "admin-id-123",
    "email": "admin@photoboth.com",
    "name": "System Administrator"
  }
}
```

### Example 2: Get System Statistics

```bash
curl -X GET http://localhost:3000/api/v1/admin/photobooth/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"
```

**Response:**
```json
{
  "overview": {
    "totalPhotobooths": 3,
    "activePhotobooths": 3,
    "totalSessions": 156,
    "activeSessions": 1,
    "completedSessions": 150,
    "cancelledSessions": 5
  },
  "sessions": {
    "today": 15,
    "thisWeek": 89,
    "thisMonth": 156,
    "averagePerDay": 5.2,
    "averageDuration": "00:03:45"
  },
  "photos": {
    "totalPhotos": 467,
    "averagePerSession": 3.1,
    "processedPhotos": 450,
    "pendingPhotos": 17
  },
  "photobooths": [
    {
      "id": "photobooth-123",
      "name": "Wedding Photobooth",
      "sessionsCount": 78,
      "photosCount": 234,
      "averageSessionDuration": "00:03:30",
      "utilizationRate": 0.85
    },
    {
      "id": "photobooth-456",
      "name": "Garden Photobooth",
      "sessionsCount": 45,
      "photosCount": 135,
      "averageSessionDuration": "00:04:15",
      "utilizationRate": 0.72
    }
  ],
  "timeRange": {
    "from": "2025-10-01T00:00:00.000Z",
    "to": "2025-10-27T23:59:59.999Z"
  }
}
```

### Example 3: Get All Sessions with Filters

```bash
# Filter by status, photobooth, and date range (using your example)
curl -X GET "http://localhost:3000/api/v1/admin/photobooth/sessions?page=1&limit=10&status=pending&photoboothId=e3e0d016-f898-4baa-a283-853f56c70ba9&dateFrom=2025-10-28&dateTo=2025-10-30" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"

# Filter by completed sessions only
curl -X GET "http://localhost:3000/api/v1/admin/photobooth/sessions?status=completed&page=1&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"

# Search sessions by notes
curl -X GET "http://localhost:3000/api/v1/admin/photobooth/sessions?search=wedding&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"

# Filter by date range only
curl -X GET "http://localhost:3000/api/v1/admin/photobooth/sessions?dateFrom=2025-10-28&dateTo=2025-10-30&page=1&limit=15" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"
```

**Query Parameters:**
- `page` (optional): Page number (starts from 1, default: 1)
- `limit` (optional): Number of items per page (max 100, default: 10)
- `search` (optional): Search term for filtering sessions by notes
- `status` (optional): Filter by session status (`pending`, `active`, `completed`, `cancelled`)
- `photoboothId` (optional): Filter by specific photobooth ID (UUID)
- `dateFrom` (optional): Filter sessions from this date (ISO 8601 format: YYYY-MM-DD)
- `dateTo` (optional): Filter sessions to this date (ISO 8601 format: YYYY-MM-DD)

**Response:**
```json
{
  "data": [
    {
      "id": "session-wedding-001",
      "status": "completed",
      "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
      "user": {
        "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
        "email": "bride@example.com",
        "name": "Sarah Johnson"
      },
      "photoboothId": "photobooth-123",
      "photobooth": {
        "id": "photobooth-123",
        "name": "Wedding Photobooth",
        "location": "Reception Hall"
      },
      "photoCount": 3,
      "maxPhotos": 10,
      "startedAt": "2025-10-27T15:32:15.000Z",
      "completedAt": "2025-10-27T15:35:22.000Z",
      "createdAt": "2025-10-27T15:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Example 4: Cancel Session as Admin

```bash
# Cancel an active session when user doesn't complete it
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/sessions/session-wedding-001/cancel \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "session-wedding-001",
  "status": "cancelled",
  "userId": "bcd4ea8a-1234-4567-890a-1234567890abc",
  "user": {
    "id": "bcd4ea8a-1234-4567-890a-1234567890abc",
    "email": "bride@example.com",
    "name": "Sarah Johnson"
  },
  "photoboothId": "photobooth-123",
  "photobooth": {
    "id": "photobooth-123",
    "name": "Wedding Photobooth",
    "status": "available",
    "currentSessionId": null
  },
  "photos": [],
  "photoCount": 0,
  "maxPhotos": 10,
  "notes": "Wedding ceremony photos - Bride and Groom"
}
```

### Example 5: Clear Photobooth Session (Admin)

```bash
# Manually clear session from photobooth when stuck
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/photobooths/photobooth-123/clear-session \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token"
```

**Response:**
```json
{
  "id": "photobooth-123",
  "name": "Wedding Photobooth",
  "description": "Elegant photobooth for wedding ceremonies",
  "status": "available",
  "location": "Reception Hall",
  "isActive": true,
  "currentSessionId": null,
  "createdAt": "2025-10-27T06:41:55.309Z",
  "updatedAt": "2025-10-27T08:59:56.389Z"
}
```

### Example 6: Cleanup Expired Sessions

```bash
curl -X POST http://localhost:3000/api/v1/admin/photobooth/cleanup/expired-sessions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1pZCIsImlhdCI6MTc2MTU3NzM2OCwiaXNzIjoibmVzdGpzLWFwcCIsImV4cCI6MTc2NDE2OTM2OH0.admin_token" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false}'
```

**Response:**
```json
{
  "message": "Cleanup completed successfully",
  "expiredSessions": 3,
  "freedPhotobooths": 2,
  "details": [
    {
      "sessionId": "expired-session-001",
      "photoboothId": "photobooth-789",
      "action": "expired"
    },
    {
      "sessionId": "expired-session-002",
      "photoboothId": "photobooth-101",
      "action": "expired"
    }
  ]
}
```

---

## Advanced Use Cases

### Use Case 1: Corporate Event with Multiple Photobooths

```bash
# Check system status
curl -X GET http://localhost:3000/api/v1/photobooth/status \
  -H "Authorization: Bearer corporate_token"

# Create sessions for different photobooths
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer corporate_token" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "corporate-booth-1",
    "maxPhotos": 5,
    "notes": "Executive team photos"
  }'

curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer corporate_token" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "corporate-booth-2",
    "maxPhotos": 5,
    "notes": "Employee group photos"
  }'
```

### Use Case 2: Quick Photo Session (Minimal Photos)

```bash
# Create session with minimal photos
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer quick_token" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "quick-booth",
    "maxPhotos": 1,
    "notes": "Quick selfie session"
  }'

# Start session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/session-id/start \
  -H "Authorization: Bearer quick_token" \
  -H "Content-Type: application/json" \
  -d '{}'

# Upload image
curl -X POST http://localhost:3000/api/v1/photobooth/upload-image \
  -H "Authorization: Bearer quick_token" \
  -F "file=@/path/to/selfie.jpg"

# Add photo to session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/session-id/photos \
  -H "Authorization: Bearer quick_token" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1732740000/photoboth/uploads/selfie.jpg",
    "publicId": "selfie",
    "caption": "Quick selfie"
  }'

# Complete session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/session-id/complete \
  -H "Authorization: Bearer quick_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Use Case 3: Session Cancellation

#### User Cancellation
```bash
# Cancel a session before completion (by user)
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/session-id/cancel \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "session-id",
  "status": "cancelled",
  "userId": "user-id",
  "photoboothId": "photobooth-id",
  "photobooth": {
    "id": "photobooth-id",
    "name": "Photobooth Name",
    "status": "available",
    "currentSessionId": null
  },
  "photos": [],
  "photoCount": 0,
  "maxPhotos": 5,
  "notes": "Session cancelled by user"
}
```

#### Admin Cancellation
```bash
# Cancel a session as admin (when user doesn't complete)
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/sessions/session-id/cancel \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response:**
```json
{
  "id": "session-id",
  "status": "cancelled",
  "userId": "user-id",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "photoboothId": "photobooth-id",
  "photobooth": {
    "id": "photobooth-id",
    "name": "Photobooth Name",
    "status": "available",
    "currentSessionId": null
  },
  "photos": [],
  "photoCount": 0,
  "maxPhotos": 5,
  "notes": "Session cancelled by admin"
}
```

#### Clear Photobooth Session (Admin)
```bash
# Manually clear session from photobooth (admin only)
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/photobooths/photobooth-id/clear-session \
  -H "Authorization: Bearer admin_token"
```

**Response:**
```json
{
  "id": "photobooth-id",
  "name": "Photobooth Name",
  "description": "Photobooth description",
  "status": "available",
  "location": "Location",
  "isActive": true,
  "currentSessionId": null,
  "createdAt": "2025-10-27T06:41:55.309Z",
  "updatedAt": "2025-10-27T08:59:56.389Z"
}
```

---

## Testing Scripts

### Complete Test Script

```bash
#!/bin/bash

# Set variables
BASE_URL="http://localhost:3000"
EMAIL="test@example.com"
PASSWORD="password123"

echo "=== Photobooth Session API Test ==="

# Step 1: Login
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
echo "Login successful. Token: ${TOKEN:0:20}..."

# Step 2: Get available photobooths
echo "2. Getting available photobooths..."
PHOTOBOOTHS=$(curl -s -X GET $BASE_URL/api/v1/photobooth/available \
  -H "Authorization: Bearer $TOKEN")

PHOTOBOOTH_ID=$(echo $PHOTOBOOTHS | jq -r '.[0].id')
echo "Found photobooth: $PHOTOBOOTH_ID"

# Step 3: Create session
echo "3. Creating session..."
SESSION_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/photobooth/sessions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"photoboothId\":\"$PHOTOBOOTH_ID\",\"maxPhotos\":3,\"notes\":\"Test session\"}")

SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.id')
echo "Session created: $SESSION_ID"

# Step 4: Start session
echo "4. Starting session..."
curl -s -X PUT $BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' > /dev/null
echo "Session started"

# Step 5: Take photos
echo "5. Taking photos..."
for i in {1..3}; do
  curl -s -X POST $BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/photos \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"imageUrl\":\"https://example.com/photo$i.jpg\",\"caption\":\"Photo $i\"}" > /dev/null
  echo "Photo $i taken"
done

# Step 6: Complete session
echo "6. Completing session..."
curl -s -X PUT $BASE_URL/api/v1/photobooth/sessions/$SESSION_ID/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' > /dev/null
echo "Session completed"

# Step 7: Get final session details
echo "7. Getting final session details..."
FINAL_SESSION=$(curl -s -X GET $BASE_URL/api/v1/photobooth/sessions/$SESSION_ID \
  -H "Authorization: Bearer $TOKEN")

PHOTO_COUNT=$(echo $FINAL_SESSION | jq -r '.photoCount')
STATUS=$(echo $FINAL_SESSION | jq -r '.status')
echo "Final status: $STATUS, Photos: $PHOTO_COUNT"

echo "=== Test completed successfully! ==="
```

---

## Performance Testing

### Load Test Script

```bash
#!/bin/bash

# Load test for session creation
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"photoboothId\":\"$PHOTOBOOTH_ID\",\"maxPhotos\":3}" &
done

wait
echo "Load test completed"
```

---

## Conclusion

These examples demonstrate the complete functionality of the Photobooth Session Management API, including:

- User authentication and authorization
- Session lifecycle management (create, start, complete, cancel)
- Photo capture and management
- Error handling and validation
- Admin management capabilities
  - Cancel sessions when users don't complete them
  - Clear stuck sessions from photobooths
  - System statistics and monitoring
  - Cleanup expired sessions
- Real-world use cases
- Testing and performance considerations

### Key Features Added

- **Admin Cancel Session**: `PUT /api/v1/admin/photobooth/sessions/:id/cancel`
  - Allows admins to cancel sessions when users don't complete them
  - Automatically frees up photobooth for next user
  - Prevents cancellation of already completed sessions

- **Clear Photobooth Session**: `PUT /api/v1/admin/photobooth/photobooths/:id/clear-session`
  - Manually clear stuck sessions from photobooths
  - Useful for troubleshooting and maintenance
  - Sets photobooth status back to available

- **Image Upload Endpoint**: `POST /api/v1/photobooth/upload-image`
  - Upload image files to Cloudinary and get URLs for use in sessions
  - Supports multiple image formats (JPEG, PNG, GIF, WebP)
  - File size validation (max 10MB)
  - Returns Cloudinary URL and public ID
  - Automatic image optimization and CDN delivery
  - Separates file upload from session management for better architecture

The API is designed to be robust, scalable, and easy to integrate with various frontend applications and photobooth hardware systems. The admin management features ensure smooth operation even when users encounter issues or don't complete their sessions properly.
