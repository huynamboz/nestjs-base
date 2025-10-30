# Photobooth Session Management API Documentation

## Overview

This document describes the complete API for managing photobooth sessions, including user authentication, session lifecycle, photo management, and photobooth status monitoring.

## Table of Contents

1. [Authentication](#authentication)
2. [Photobooth Management](#photobooth-management)
3. [Session Management](#session-management)
4. [Photo Management](#photo-management)
5. [Admin Management](#admin-management)
6. [Error Handling](#error-handling)
7. [API Examples](#api-examples)

---

## Authentication

### Login
**POST** `/api/v1/auth/login`

Authenticate user and get JWT token for session management.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Headers Required:**
```
Authorization: Bearer <access_token>
```

---

## Photobooth Management

### Get Photobooth Status
**GET** `/api/v1/photobooth/status`

Get overall photobooth system status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalPhotobooths": 3,
  "availablePhotobooths": 2,
  "busyPhotobooths": 1,
  "activeSessions": 1,
  "totalSessionsToday": 15,
  "averageSessionDuration": "00:03:45"
}
```

### Get Available Photobooths
**GET** `/api/v1/photobooth/available`

Get list of available photobooths for session creation.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Photobooth #1",
    "description": "Main photobooth at entrance",
    "status": "available",
    "location": "Entrance Hall",
    "isActive": true,
    "currentSessionId": null,
    "createdAt": "2025-10-27T06:41:55.309Z",
    "updatedAt": "2025-10-27T08:06:00.519Z"
  }
]
```

---

## Session Management

### Create Session
**POST** `/api/v1/photobooth/sessions`

Create a new photobooth session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "maxPhotos": 5,
  "notes": "Optional session notes"
}
```

**Note:** The `userId` is automatically extracted from the JWT token. You don't need to include it in the request body.

**Response:**
```json
{
  "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "status": "pending",
  "userId": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
  "user": {
    "id": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
    "email": "admin@photoboth.com",
    "name": "System Administrator",
    "role": {
      "id": "38e2b0b0-080c-4c66-b600-94769df3aa57",
      "name": "admin"
    }
  },
  "photoboothId": "e3e0d016-f898-4baa-a283-853f56c70ba9",
  "photobooth": {
    "id": "e3e0d016-f898-4baa-a283-853f56c70ba9",
    "name": "Photobooth #1",
    "description": "Main photobooth at entrance",
    "status": "busy",
    "location": "Entrance Hall",
    "isActive": true,
    "currentSessionId": "7eff879d-09ea-4ea3-994c-75524ffd148a"
  },
  "photos": [],
  "startedAt": null,
  "completedAt": null,
  "expiresAt": "2025-10-27T15:36:19.609Z",
  "photoCount": 0,
  "maxPhotos": 3,
  "notes": "Test session with user",
  "createdAt": "2025-10-27T08:06:19.611Z",
  "updatedAt": "2025-10-27T08:06:19.611Z"
}
```

### Get Session Details
**GET** `/api/v1/photobooth/sessions/{sessionId}`

Get detailed information about a specific session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "status": "active",
  "userId": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
  "user": {
    "id": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
    "email": "admin@photoboth.com",
    "name": "System Administrator",
    "role": {
      "id": "38e2b0b0-080c-4c66-b600-94769df3aa57",
      "name": "admin"
    }
  },
  "photoboothId": "e3e0d016-f898-4baa-a283-853f56c70ba9",
  "photobooth": {
    "id": "e3e0d016-f898-4baa-a283-853f56c70ba9",
    "name": "Photobooth #1",
    "status": "busy",
    "location": "Entrance Hall"
  },
  "photos": [
    {
      "id": "fa7c3c4c-2628-4f7a-b4e2-f4fae30cfdde",
      "imageUrl": "https://example.com/photo1.jpg",
      "order": 1,
      "caption": "First photo",
      "isProcessed": false,
      "createdAt": "2025-10-27T08:06:46.338Z"
    }
  ],
  "startedAt": "2025-10-27T15:06:28.994Z",
  "completedAt": null,
  "expiresAt": "2025-10-27T15:36:19.609Z",
  "photoCount": 1,
  "maxPhotos": 3,
  "notes": "Test session with user"
}
```

### Start Session
**PUT** `/api/v1/photobooth/sessions/{sessionId}/start`

Start an active session (change status from PENDING to ACTIVE).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "status": "active",
  "startedAt": "2025-10-27T15:06:28.994Z",
  "photoCount": 0,
  "maxPhotos": 3
}
```

### Complete Session
**PUT** `/api/v1/photobooth/sessions/{sessionId}/complete`

Complete an active session (change status from ACTIVE to COMPLETED).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "status": "completed",
  "completedAt": "2025-10-27T15:08:40.885Z",
  "photoCount": 3,
  "maxPhotos": 3,
  "photos": [
    {
      "id": "fa7c3c4c-2628-4f7a-b4e2-f4fae30cfdde",
      "imageUrl": "https://example.com/photo1.jpg",
      "order": 1,
      "caption": "First photo"
    },
    {
      "id": "1e81a9eb-7d64-455c-b4e8-e1783226fbe9",
      "imageUrl": "https://example.com/photo2.jpg",
      "order": 2,
      "caption": "Second photo"
    },
    {
      "id": "5584f506-bd39-401c-8540-efa46605891c",
      "imageUrl": "https://example.com/photo3.jpg",
      "order": 3,
      "caption": "Third photo"
    }
  ]
}
```

### Cancel Session
**PUT** `/api/v1/photobooth/sessions/{sessionId}/cancel`

Cancel a session (change status to CANCELLED).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{}
```

**Response:**
```json
{
  "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "status": "cancelled",
  "photoCount": 0,
  "maxPhotos": 3
}
```

---

## Photo Management

### Get Session Photos
**GET** `/api/v1/photobooth/sessions/{sessionId}/photos`

Get all photos for a specific session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "fa7c3c4c-2628-4f7a-b4e2-f4fae30cfdde",
    "sessionId": "7eff879d-09ea-4ea3-994c-75524ffd148a",
    "imageUrl": "https://example.com/photo1.jpg",
    "publicId": null,
    "thumbnailUrl": null,
    "order": 1,
    "caption": "First photo",
    "isProcessed": false,
    "processedAt": null,
    "createdAt": "2025-10-27T08:06:46.338Z",
    "updatedAt": "2025-10-27T08:06:46.338Z"
  }
]
```

### Take Photo
**POST** `/api/v1/photobooth/sessions/{sessionId}/photos`

Add a new photo to an active session.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "imageUrl": "https://example.com/photo1.jpg",
  "caption": "Optional photo caption"
}
```

**Response:**
```json
{
  "id": "fa7c3c4c-2628-4f7a-b4e2-f4fae30cfdde",
  "sessionId": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "session": {
    "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
    "status": "active",
    "photoCount": 1,
    "maxPhotos": 3
  },
  "imageUrl": "https://example.com/photo1.jpg",
  "publicId": null,
  "thumbnailUrl": null,
  "order": 1,
  "caption": "First photo",
  "isProcessed": false,
  "processedAt": null,
  "createdAt": "2025-10-27T08:06:46.338Z",
  "updatedAt": "2025-10-27T08:06:46.338Z"
}
```

### Get Photo Details
**GET** `/api/v1/photobooth/photos/{photoId}`

Get detailed information about a specific photo.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "fa7c3c4c-2628-4f7a-b4e2-f4fae30cfdde",
  "sessionId": "7eff879d-09ea-4ea3-994c-75524ffd148a",
  "session": {
    "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
    "status": "completed",
    "userId": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
    "photoboothId": "e3e0d016-f898-4baa-a283-853f56c70ba9"
  },
  "imageUrl": "https://example.com/photo1.jpg",
  "publicId": null,
  "thumbnailUrl": null,
  "order": 1,
  "caption": "First photo",
  "isProcessed": false,
  "processedAt": null,
  "createdAt": "2025-10-27T08:06:46.338Z",
  "updatedAt": "2025-10-27T08:06:46.338Z"
}
```

---

## Admin Management

### Get All Photobooths
**GET** `/api/v1/admin/photobooth/photobooths`

Get paginated list of all photobooths (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (available, busy, maintenance)
- `location` (optional): Filter by location

**Response:**
```json
{
  "data": [
    {
      "id": "e3e0d016-f898-4baa-a283-853f56c70ba9",
      "name": "Photobooth #1",
      "description": "Main photobooth at entrance",
      "status": "busy",
      "location": "Entrance Hall",
      "isActive": true,
      "currentSessionId": "7eff879d-09ea-4ea3-994c-75524ffd148a",
      "createdAt": "2025-10-27T06:41:55.309Z",
      "updatedAt": "2025-10-27T08:06:19.621Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Create Photobooth
**POST** `/api/v1/admin/photobooth/photobooths`

Create a new photobooth (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Photobooth #2",
  "description": "Secondary photobooth",
  "location": "Conference Room",
  "isActive": true
}
```

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "name": "Photobooth #2",
  "description": "Secondary photobooth",
  "status": "available",
  "location": "Conference Room",
  "isActive": true,
  "currentSessionId": null,
  "createdAt": "2025-10-27T08:10:00.000Z",
  "updatedAt": "2025-10-27T08:10:00.000Z"
}
```

### Get All Sessions
**GET** `/api/v1/admin/photobooth/sessions`

Get paginated list of all sessions (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, active, completed, cancelled, expired)
- `photoboothId` (optional): Filter by photobooth ID
- `userId` (optional): Filter by user ID
- `dateFrom` (optional): Filter from date (ISO string)
- `dateTo` (optional): Filter to date (ISO string)

**Response:**
```json
{
  "data": [
    {
      "id": "7eff879d-09ea-4ea3-994c-75524ffd148a",
      "status": "completed",
      "userId": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
      "user": {
        "id": "ebb57c96-95e8-46b5-9272-d195a3dd921f",
        "email": "admin@photoboth.com",
        "name": "System Administrator"
      },
      "photoboothId": "e3e0d016-f898-4baa-a283-853f56c70ba9",
      "photobooth": {
        "id": "e3e0d016-f898-4baa-a283-853f56c70ba9",
        "name": "Photobooth #1",
        "location": "Entrance Hall"
      },
      "photoCount": 3,
      "maxPhotos": 3,
      "startedAt": "2025-10-27T15:06:28.994Z",
      "completedAt": "2025-10-27T15:08:40.885Z",
      "createdAt": "2025-10-27T08:06:19.611Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Get Photobooth Statistics
**GET** `/api/v1/admin/photobooth/stats`

Get comprehensive photobooth system statistics (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `period` (optional): Time period (today, week, month, year)
- `photoboothId` (optional): Specific photobooth ID

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
      "id": "e3e0d016-f898-4baa-a283-853f56c70ba9",
      "name": "Photobooth #1",
      "sessionsCount": 78,
      "photosCount": 234,
      "averageSessionDuration": "00:03:30",
      "utilizationRate": 0.85
    }
  ],
  "timeRange": {
    "from": "2025-10-01T00:00:00.000Z",
    "to": "2025-10-27T23:59:59.999Z"
  }
}
```

### Cleanup Expired Sessions
**POST** `/api/v1/admin/photobooth/cleanup/expired-sessions`

Clean up expired sessions and free up photobooths (admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "dryRun": false
}
```

**Response:**
```json
{
  "message": "Cleanup completed successfully",
  "expiredSessions": 3,
  "freedPhotobooths": 2,
  "details": [
    {
      "sessionId": "expired-session-id",
      "photoboothId": "freed-photobooth-id",
      "action": "expired"
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "photoboothId",
      "message": "Photobooth ID is required"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Session not found",
  "error": "Not Found"
}
```

#### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Photobooth already has an active session",
  "error": "Conflict"
}
```

#### 422 Unprocessable Entity
```json
{
  "statusCode": 422,
  "message": "Session is not in the correct state for this operation",
  "error": "Unprocessable Entity"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### Session Status Validation

| Current Status | Allowed Operations |
|----------------|-------------------|
| `pending` | `start`, `cancel` |
| `active` | `complete`, `cancel`, `take_photo` |
| `completed` | None (final state) |
| `cancelled` | None (final state) |
| `expired` | None (final state) |

---

## API Examples

### Complete User Flow

#### 1. User Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### 2. Get Available Photobooths
```bash
curl -X GET http://localhost:3000/api/v1/photobooth/available \
  -H "Authorization: Bearer <token>"
```

#### 3. Create Session
```bash
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
    "maxPhotos": 5,
    "notes": "Wedding photos"
  }'
```

#### 4. Start Session
```bash
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### 5. Take Photos
```bash
# Photo 1
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/photos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/photo1.jpg",
    "caption": "First photo"
  }'

# Photo 2
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/photos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/photo2.jpg",
    "caption": "Second photo"
  }'
```

#### 6. Complete Session
```bash
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/{sessionId}/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Admin Management Flow

#### 1. Admin Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@photoboth.com",
    "password": "Admin123!"
  }'
```

#### 2. Get System Statistics
```bash
curl -X GET http://localhost:3000/api/v1/admin/photobooth/stats \
  -H "Authorization: Bearer <admin_token>"
```

#### 3. Get All Sessions
```bash
curl -X GET "http://localhost:3000/api/v1/admin/photobooth/sessions?page=1&limit=10&status=completed" \
  -H "Authorization: Bearer <admin_token>"
```

#### 4. Cleanup Expired Sessions
```bash
curl -X POST http://localhost:3000/api/v1/admin/photobooth/cleanup/expired-sessions \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false}'
```

---

## Data Models

### Session Entity
```typescript
interface Session {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
  userId?: string;
  user?: User;
  photoboothId: string;
  photobooth: Photobooth;
  photos: Photo[];
  startedAt?: Date;
  completedAt?: Date;
  expiresAt: Date;
  photoCount: number;
  maxPhotos: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Photo Entity
```typescript
interface Photo {
  id: string;
  sessionId: string;
  session?: Session;
  imageUrl: string;
  publicId?: string;
  thumbnailUrl?: string;
  order: number;
  caption?: string;
  isProcessed: boolean;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Photobooth Entity
```typescript
interface Photobooth {
  id: string;
  name: string;
  description?: string;
  status: 'available' | 'busy' | 'maintenance';
  location: string;
  isActive: boolean;
  currentSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Entity
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Session creation**: 10 requests per minute per user
- **Photo upload**: 30 requests per minute per session
- **Admin endpoints**: 100 requests per minute per admin user

---

## WebSocket Events (Future Enhancement)

### Real-time Updates
- `session.created` - New session created
- `session.started` - Session started
- `session.completed` - Session completed
- `session.cancelled` - Session cancelled
- `photo.taken` - New photo added to session
- `photobooth.status_changed` - Photobooth status updated

---

## Changelog

### Version 1.0.0 (2025-10-27)
- Initial release
- Complete session management API
- User authentication and authorization
- Photo management
- Admin dashboard support
- Real-time status monitoring
- Comprehensive error handling

---

## Support

For technical support or questions about this API, please contact:
- Email: support@photoboth.com
- Documentation: https://docs.photoboth.com
- GitHub: https://github.com/photoboth/api
