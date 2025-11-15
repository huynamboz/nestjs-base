# Photobooth System API Documentation

## Overview
Hệ thống Photobooth quản lý các phiên chụp hình của user, bao gồm quản lý photobooth, session và photos. Hệ thống đảm bảo chỉ có một session active trên mỗi photobooth tại một thời điểm.

**Base URL:** `http://localhost:3000/api/v1`

## System Architecture

### Core Entities
- **Photobooth**: Máy chụp hình vật lý
- **Session**: Phiên chụp hình của user (có thể chụp nhiều ảnh)
- **Photo**: Từng tấm ảnh trong session

### Business Flow
```
1. User tạo session → PENDING
2. User start session → ACTIVE
3. User chụp ảnh → Add photos to session
4. User complete session → COMPLETED
5. Photobooth trở về AVAILABLE
```

## Data Models

### Photobooth
```typescript
{
  id: string;                    // UUID
  name: string;                  // Tên photobooth
  description?: string;          // Mô tả
  status: PhotoboothStatus;      // Trạng thái
  location?: string;             // Vị trí
  isActive: boolean;             // Có hoạt động không
  currentSessionId?: string;     // Session đang active
  createdAt: Date;
  updatedAt: Date;
}
```

### Session
```typescript
{
  id: string;                    // UUID
  status: SessionStatus;         // Trạng thái session
  userId?: string;               // User ID (optional)
  photoboothId: string;          // Photobooth ID
  photoCount: number;            // Số ảnh đã chụp
  maxPhotos: number;             // Số ảnh tối đa
  startedAt?: Date;              // Thời gian bắt đầu
  completedAt?: Date;            // Thời gian hoàn thành
  expiresAt?: Date;              // Thời gian hết hạn
  notes?: string;                // Ghi chú
  createdAt: Date;
  updatedAt: Date;
}
```

### Photo
```typescript
{
  id: string;                    // UUID
  sessionId: string;             // Session ID
  imageUrl: string;              // URL ảnh
  publicId?: string;             // Cloudinary public ID
  thumbnailUrl?: string;         // URL thumbnail
  order: number;                 // Thứ tự trong session
  caption?: string;              // Chú thích
  isProcessed: boolean;          // Đã xử lý chưa
  processedAt?: Date;            // Thời gian xử lý
  createdAt: Date;
  updatedAt: Date;
}
```

### Enums
```typescript
enum SessionStatus {
  PENDING = 'pending',           // Chờ bắt đầu
  ACTIVE = 'active',             // Đang chụp
  COMPLETED = 'completed',       // Hoàn thành
  CANCELLED = 'cancelled',       // Hủy
  EXPIRED = 'expired',           // Hết hạn
}

enum PhotoboothStatus {
  AVAILABLE = 'available',       // Sẵn sàng
  BUSY = 'busy',                 // Đang có session
  MAINTENANCE = 'maintenance',   // Bảo trì
  OFFLINE = 'offline',           // Offline
}
```

## Public Endpoints (Không cần authentication)

### 1. Get System Status
Lấy trạng thái tổng quan của hệ thống.

**Endpoint:** `GET /api/v1/photobooth/status`

**Response:**
```json
{
  "photobooths": {
    "total": 5,
    "available": 3,
    "busy": 1,
    "maintenance": 1,
    "offline": 0
  },
  "sessions": {
    "total": 150,
    "pending": 2,
    "active": 1,
    "completed": 140,
    "cancelled": 5,
    "expired": 2
  }
}
```

### 2. Get Available Photobooths
Lấy danh sách photobooths sẵn sàng.

**Endpoint:** `GET /api/v1/photobooth/available`

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
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Create Session
Tạo phiên chụp hình mới. **Yêu cầu authentication.**

**Endpoint:** `POST /api/v1/photobooth/sessions`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "maxPhotos": 5, // Optional, default: 5, max: 20
  "notes": "Birthday party session" // Optional
}
```

**Note:** `userId` sẽ được tự động lấy từ JWT token của user đã đăng nhập.
```

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "pending",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "user": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "email": "user@example.com",
    "name": "John Doe",
    "role": {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "name": "user"
    }
  },
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "photobooth": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Photobooth #1",
    "status": "busy",
    "currentSessionId": "789e0123-e89b-12d3-a456-426614174002"
  },
  "photos": [],
  "photoCount": 0,
  "maxPhotos": 5,
  "startedAt": null,
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201`: Session created successfully
- `400`: Bad request - validation failed
- `404`: Photobooth not found
- `409`: Photobooth not available or user has active session

### 4. Get Session
Lấy thông tin chi tiết session.

**Endpoint:** `GET /api/v1/photobooth/sessions/{id}`

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "photobooth": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Photobooth #1",
    "status": "busy"
  },
  "photos": [
    {
      "id": "abc12345-e89b-12d3-a456-426614174003",
      "imageUrl": "https://example.com/photo1.jpg",
      "order": 1,
      "caption": "First photo"
    }
  ],
  "photoCount": 1,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

### 5. Start Session
Bắt đầu phiên chụp hình.

**Endpoint:** `PUT /api/v1/photobooth/sessions/{id}/start`

**Request Body:**
```json
{
  "startedAt": "2024-01-01T00:05:00.000Z" // Optional, default: now
}
```

**Response:** Same as Get Session with `status: "active"` and `startedAt` set.

**Status Codes:**
- `200`: Session started successfully
- `400`: Session not in pending status or expired
- `404`: Session not found

### 6. Complete Session
Hoàn thành phiên chụp hình.

**Endpoint:** `PUT /api/v1/photobooth/sessions/{id}/complete`

**Request Body:**
```json
{
  "completedAt": "2024-01-01T00:25:00.000Z" // Optional, default: now
}
```

**Response:** Same as Get Session with `status: "completed"` and `completedAt` set.

**Status Codes:**
- `200`: Session completed successfully
- `400`: Session not active
- `404`: Session not found

### 7. Cancel Session
Hủy phiên chụp hình.

**Endpoint:** `PUT /api/v1/photobooth/sessions/{id}/cancel`

**Response:** Same as Get Session with `status: "cancelled"`.

**Status Codes:**
- `200`: Session cancelled successfully
- `400`: Session already completed
- `404`: Session not found

### 8. Add Filter to Session
Thêm filter ID vào danh sách filters của session. Mỗi session có thể có nhiều filters.

**Endpoint:** `POST /api/v1/photobooth/sessions/{id}/filters`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required): Session ID (UUID)

**Request Body:**
```json
{
  "filterId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "filterIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "456e7890-e89b-12d3-a456-426614174001"
  ],
  "photoCount": 1,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

**Status Codes:**
- `200`: Filter added successfully
- `400`: Bad request - Cannot add filter to completed or cancelled session
- `404`: Session not found
- `409`: Filter already exists in session

**WebSocket Event:**
Khi filter được thêm thành công, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "add_filter",
  "data": { "filter_id": "123e4567-e89b-12d3-a456-426614174000" }
}
```

### 9. Remove Filter from Session
Xóa filter ID khỏi danh sách filters của session.

**Endpoint:** `DELETE /api/v1/photobooth/sessions/{id}/filters/{filterId}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string, required): Session ID (UUID)
- `filterId` (string, required): Filter ID (UUID) cần xóa

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "filterIds": [
    "123e4567-e89b-12d3-a456-426614174000"
  ],
  "photoCount": 1,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

**Status Codes:**
- `200`: Filter removed successfully
- `400`: Bad request - Cannot remove filter from completed or cancelled session
- `404`: Session or filter not found

**WebSocket Event:**
Khi filter được xóa thành công, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "delete_filter",
  "data": { "filter_id": "123e4567-e89b-12d3-a456-426614174000" }
}
```

### 10. Start Capture
Bắt đầu chụp ảnh cho session. API này sẽ emit WebSocket message để báo hiệu bắt đầu chụp.

**Endpoint:** `POST /api/v1/photobooth/sessions/{id}/start-capture`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string, required): Session ID (UUID)

**Response:**
```json
{
  "message": "Start capture message sent for session 123e4567-e89b-12d3-a456-426614174000",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Status Codes:**
- `200`: Start capture message sent successfully
- `404`: Session not found

**WebSocket Event:**
Khi API được gọi, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "start_capture",
  "data": { "session_id": "123e4567-e89b-12d3-a456-426614174000" }
}
```

### 11. Change Filter
Thêm hoặc xóa filter trong mảng `filterIds` của session. Xem chi tiết tại [Change Filter API Documentation](./change-filter-api.md).

**Endpoints:**
- `POST /api/v1/photobooth/sessions/{id}/change-filter` - Thêm filter vào mảng
- `DELETE /api/v1/photobooth/sessions/{id}/change-filter/{filterId}` - Xóa filter khỏi mảng

**Quick Reference:**
- **POST Method:** Thêm filterId vào mảng `filterIds`
- **DELETE Method:** Xóa filterId khỏi mảng `filterIds`
- **Authentication:** Required (JWT)
- **Path Parameter:** `id` - Session ID (UUID), `filterId` - Filter ID (UUID) cho DELETE
- **Request Body (POST):** `{ "filterId": "uuid" }`
- **Response:** Session object với `filterIds` đã được cập nhật
- **WebSocket Events:** 
  - POST emits `add_filter` message
  - DELETE emits `delete_filter` message

### 12. Session Photos
Quản lý ảnh trong session. Xem chi tiết tại [Session Photo API Documentation](./session-photo-api.md).

## Admin Endpoints (Cần authentication + admin role)

### Authentication
Tất cả admin endpoints yêu cầu:
- **JWT Token** trong header `Authorization: Bearer <token>`
- **Role:** ADMIN

### 1. Get All Photobooths
Lấy danh sách tất cả photobooths với pagination.

**Endpoint:** `GET /api/v1/admin/photobooth/photobooths`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in name, description, location

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Photobooth #1",
      "description": "Main photobooth at entrance",
      "status": "available",
      "location": "Entrance Hall",
      "isActive": true,
      "currentSessionId": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 2. Create Photobooth
Tạo photobooth mới.

**Endpoint:** `POST /api/v1/admin/photobooth/photobooths`

**Request Body:**
```json
{
  "name": "Photobooth #2",
  "description": "Secondary photobooth",
  "location": "VIP Area",
  "status": "available" // Optional, default: available
}
```

**Response:** Same as Get Photobooth response.

**Status Codes:**
- `201`: Photobooth created successfully
- `400`: Bad request - validation failed
- `409`: Name already exists
- `401`: Unauthorized
- `403`: Forbidden - Admin role required

### 3. Update Photobooth
Cập nhật thông tin photobooth.

**Endpoint:** `PUT /api/v1/admin/photobooth/photobooths/{id}`

**Request Body:**
```json
{
  "name": "Photobooth #1 - Updated",
  "description": "Updated description",
  "location": "New Location",
  "status": "maintenance",
  "isActive": true
}
```

**Response:** Same as Get Photobooth response.

**Status Codes:**
- `200`: Photobooth updated successfully
- `400`: Bad request - cannot set to available while has active session
- `404`: Photobooth not found
- `409`: Name already exists

### 4. Update Photobooth Status
Cập nhật trạng thái photobooth.

**Endpoint:** `PUT /api/v1/admin/photobooth/photobooths/{id}/status`

**Request Body:**
```json
{
  "status": "maintenance"
}
```

**Valid Status Values:**
- `available` - Sẵn sàng
- `busy` - Đang có session
- `maintenance` - Bảo trì
- `offline` - Offline

**Response:** Same as Get Photobooth response.

### 5. Delete Photobooth
Xóa photobooth.

**Endpoint:** `DELETE /api/v1/admin/photobooth/photobooths/{id}`

**Response:**
```json
{
  "message": "Photobooth with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted"
}
```

**Status Codes:**
- `200`: Photobooth deleted successfully
- `400`: Cannot delete photobooth with active session
- `404`: Photobooth not found

### 6. Get All Sessions
Lấy danh sách tất cả sessions với pagination.

**Endpoint:** `GET /api/v1/admin/photobooth/sessions`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in notes

**Response:**
```json
{
  "data": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "status": "completed",
      "userId": "456e7890-e89b-12d3-a456-426614174001",
      "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
      "photoCount": 3,
      "maxPhotos": 5,
      "startedAt": "2024-01-01T00:05:00.000Z",
      "completedAt": "2024-01-01T00:25:00.000Z",
      "notes": "Birthday party session",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:25:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 7. Update Session
Cập nhật thông tin session.

**Endpoint:** `PUT /api/v1/admin/photobooth/sessions/{id}`

**Request Body:**
```json
{
  "status": "cancelled",
  "notes": "Updated notes"
}
```

**Response:** Same as Get Session response.

**Status Codes:**
- `200`: Session updated successfully
- `400`: Cannot update completed or cancelled session
- `404`: Session not found

### 8. Delete Session
Xóa session.

**Endpoint:** `DELETE /api/v1/admin/photobooth/sessions/{id}`

**Response:**
```json
{
  "message": "Session with ID 789e0123-e89b-12d3-a456-426614174002 has been deleted"
}
```

**Status Codes:**
- `200`: Session deleted successfully
- `400`: Cannot delete active session
- `404`: Session not found

**WebSocket Event:**
Khi session được xóa thành công, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "stop_session",
  "data": { "user_id": "456e7890-e89b-12d3-a456-426614174001" }
}
```

### 9. Add Filter to Session (Admin)
Thêm filter ID vào danh sách filters của session (Admin only).

**Endpoint:** `POST /api/v1/admin/photobooth/sessions/{id}/filters`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required): Session ID (UUID)

**Request Body:**
```json
{
  "filterId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "filterIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "456e7890-e89b-12d3-a456-426614174001"
  ],
  "photoCount": 1,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

**Status Codes:**
- `200`: Filter added successfully
- `400`: Bad request - Cannot add filter to completed or cancelled session
- `401`: Unauthorized
- `403`: Forbidden - Admin role required
- `404`: Session not found
- `409`: Filter already exists in session

**WebSocket Event:**
Khi filter được thêm thành công, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "add_filter",
  "data": { "filter_id": "123e4567-e89b-12d3-a456-426614174000" }
}
```

### 10. Remove Filter from Session (Admin)
Xóa filter ID khỏi danh sách filters của session (Admin only).

**Endpoint:** `DELETE /api/v1/admin/photobooth/sessions/{id}/filters/{filterId}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string, required): Session ID (UUID)
- `filterId` (string, required): Filter ID (UUID) cần xóa

**Response:**
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "filterIds": [
    "123e4567-e89b-12d3-a456-426614174000"
  ],
  "photoCount": 1,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

**Status Codes:**
- `200`: Filter removed successfully
- `400`: Bad request - Cannot remove filter from completed or cancelled session
- `401`: Unauthorized
- `403`: Forbidden - Admin role required
- `404`: Session or filter not found

**WebSocket Event:**
Khi filter được xóa thành công, hệ thống sẽ emit WebSocket message:
```json
{
  "type": "delete_filter",
  "data": { "filter_id": "123e4567-e89b-12d3-a456-426614174000" }
}
```

### 11. Get All Photos
Lấy danh sách tất cả photos với pagination.

**Endpoint:** `GET /api/v1/admin/photobooth/photos`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in captions

**Response:**
```json
{
  "data": [
    {
      "id": "abc12345-e89b-12d3-a456-426614174003",
      "sessionId": "789e0123-e89b-12d3-a456-426614174002",
      "imageUrl": "https://example.com/photo1.jpg",
      "order": 1,
      "caption": "First photo",
      "isProcessed": false,
      "createdAt": "2024-01-01T00:10:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 500,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 12. Update Photo
Cập nhật thông tin photo.

**Endpoint:** `PUT /api/v1/admin/photobooth/photos/{id}`

**Request Body:**
```json
{
  "caption": "Updated caption",
  "order": 2,
  "isProcessed": true
}
```

**Response:** Same as Get Photo response.

### 13. Delete Photo
Xóa photo.

**Endpoint:** `DELETE /api/v1/admin/photobooth/photos/{id}`

**Response:**
```json
{
  "message": "Photo with ID abc12345-e89b-12d3-a456-426614174003 has been deleted"
}
```

### 14. Get System Statistics
Lấy thống kê tổng quan hệ thống.

**Endpoint:** `GET /api/v1/admin/photobooth/stats`

**Response:**
```json
{
  "photobooths": {
    "total": 5,
    "available": 3,
    "busy": 1,
    "maintenance": 1,
    "offline": 0
  },
  "sessions": {
    "total": 150,
    "pending": 2,
    "active": 1,
    "completed": 140,
    "cancelled": 5,
    "expired": 2
  },
  "photos": {
    "total": 500,
    "processed": 450,
    "unprocessed": 50,
    "bySession": {
      "789e0123-e89b-12d3-a456-426614174002": 3,
      "def45678-e89b-12d3-a456-426614174003": 5
    }
  }
}
```

### 15. Cleanup Expired Sessions
Dọn dẹp các session đã hết hạn.

**Endpoint:** `POST /api/v1/admin/photobooth/cleanup/expired-sessions`

**Response:**
```json
{
  "message": "5 expired sessions cleaned up",
  "count": 5
}
```

## Error Handling

### Common Error Responses

**Bad Request (400):**
```json
{
  "statusCode": 400,
  "message": [
    "Photobooth ID must be a valid UUID",
    "Max photos must be at least 1"
  ],
  "error": "Bad Request"
}
```

**Unauthorized (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Forbidden (403):**
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin role required",
  "error": "Forbidden"
}
```

**Not Found (404):**
```json
{
  "statusCode": 404,
  "message": "Session with ID 789e0123-e89b-12d3-a456-426614174002 not found",
  "error": "Not Found"
}
```

**Conflict (409):**
```json
{
  "statusCode": 409,
  "message": "Photobooth already has an active session",
  "error": "Conflict"
}
```

## Business Rules

### Session Management
1. **One session per photobooth**: Mỗi photobooth chỉ có thể có một session active tại một thời điểm
2. **Session expiration**: Pending sessions tự động hết hạn sau 30 phút
3. **Photo limits**: Mỗi session có giới hạn số ảnh (default: 5, max: 20)
4. **Status transitions**: 
   - PENDING → ACTIVE → COMPLETED
   - PENDING → EXPIRED
   - ACTIVE → CANCELLED

### Photobooth Management
1. **Status constraints**: Không thể set photobooth về AVAILABLE khi đang có session active
2. **Deletion constraints**: Không thể xóa photobooth khi đang có session active
3. **Concurrent access**: Hệ thống đảm bảo không có race conditions

### Photo Management
1. **Session validation**: Chỉ có thể thêm/sửa/xóa photos trong session ACTIVE
2. **Order management**: Photos có thứ tự tự động, có thể reorder
3. **Processing status**: Photos có thể được đánh dấu đã xử lý

## Testing Examples

### Complete Session Flow
```bash
# 1. Get available photobooths
curl -X GET http://localhost:3000/api/v1/photobooth/available

# 2. Create session
curl -X POST http://localhost:3000/api/v1/photobooth/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
    "maxPhotos": 3,
    "notes": "Test session"
  }'

# 3. Start session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/SESSION_ID/start \
  -H "Content-Type: application/json" \
  -d '{}'

# 4. Add photos
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/SESSION_ID/photos \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/photo1.jpg",
    "caption": "First photo"
  }'

# 5. Complete session
curl -X PUT http://localhost:3000/api/v1/photobooth/sessions/SESSION_ID/complete \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Admin Management
```bash
# 1. Login as admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@photoboth.com",
    "password": "Admin123!"
  }'

# 2. Get system stats
curl -X GET http://localhost:3000/api/v1/admin/photobooth/stats \
  -H "Authorization: Bearer JWT_TOKEN"

# 3. Create photobooth
curl -X POST http://localhost:3000/api/v1/admin/photobooth/photobooths \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photobooth #2",
    "description": "VIP Area Photobooth",
    "location": "VIP Area"
  }'

# 4. Update photobooth status
curl -X PUT http://localhost:3000/api/v1/admin/photobooth/photobooths/PHOTOBOOTH_ID/status \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance"
  }'
```

## Frontend Integration Guidelines

### State Management
- **Photobooth Status**: Real-time updates cho available/busy status
- **Session State**: Track current session status và progress
- **Photo Gallery**: Display photos với order và captions

### UI Components Needed
1. **Photobooth Selector**: Dropdown/list available photobooths
2. **Session Timer**: Countdown cho session duration
3. **Photo Capture**: Interface để add photos
4. **Photo Gallery**: Grid/list view của photos trong session
5. **Admin Dashboard**: Overview của system status
6. **Photobooth Management**: CRUD operations cho photobooths
7. **Session Management**: View và manage sessions
8. **Photo Management**: View và manage photos

### Real-time Updates
- **WebSocket**: Để update photobooth status real-time
- **Polling**: Fallback cho session status updates
- **Notifications**: Alert khi session expires hoặc photobooth status changes

### Error Handling
- **Validation Errors**: Display field-specific error messages
- **Business Logic Errors**: Show appropriate error dialogs
- **Network Errors**: Retry mechanisms và offline handling

## Security Considerations

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Admin vs Public API separation
- **Token Expiration**: Automatic token refresh

### Data Validation
- **Input Sanitization**: Prevent XSS và injection attacks
- **File Upload Security**: Validate image files và sizes
- **Rate Limiting**: Prevent abuse của API endpoints

### Privacy
- **Photo Storage**: Secure storage với proper access controls
- **Session Data**: Encrypt sensitive session information
- **User Data**: GDPR compliance cho user data handling
