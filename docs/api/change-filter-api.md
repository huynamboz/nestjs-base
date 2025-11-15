# Change Filter API Documentation

## Overview
API này cho phép thêm hoặc xóa filter trong mảng `filterIds` của session. Khi filter được thêm hoặc xóa, hệ thống sẽ tự động emit WebSocket message để thông báo cho tất cả clients đang kết nối.

**Base URL:** `http://localhost:3000/api/v1`

## Authentication
API này yêu cầu JWT authentication:
```
Authorization: Bearer <access_token>
```

## Change Filter

### Endpoints
- **POST** `/api/v1/photobooth/sessions/{id}/change-filter` - Thêm filter vào mảng `filterIds`
- **DELETE** `/api/v1/photobooth/sessions/{id}/change-filter/{filterId}` - Xóa filter khỏi mảng `filterIds`

### Description
- **POST**: Thêm `filterId` vào mảng `filterIds` của session và emit WebSocket message `add_filter`
- **DELETE**: Xóa `filterId` khỏi mảng `filterIds` của session và emit WebSocket message `remove_filter`

### Path Parameters
- `id` (string, required): Session ID (UUID)
  - Example: `35e9fda1-97fe-4853-a58c-46460d9c9f65`

### Request Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body
```json
{
  "filterId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Request Body Fields:**
- `filterId` (string, required): Filter ID (UUID) - ID của filter muốn áp dụng cho session

### Response

**Success Response (200 OK):**
```json
{
  "id": "35e9fda1-97fe-4853-a58c-46460d9c9f65",
  "status": "active",
  "userId": "456e7890-e89b-12d3-a456-426614174001",
  "photoboothId": "123e4567-e89b-12d3-a456-426614174000",
  "filterIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "456e7890-e89b-12d3-a456-426614174001"
  ],
  "photoCount": 2,
  "maxPhotos": 5,
  "startedAt": "2024-01-01T00:05:00.000Z",
  "completedAt": null,
  "expiresAt": "2024-01-01T00:30:00.000Z",
  "notes": "Birthday party session",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:05:00.000Z"
}
```

### Status Codes

| Code | Description |
|------|-------------|
| `200` | Filter added/removed successfully |
| `400` | Bad request - Cannot change filter for completed or cancelled session |
| `401` | Unauthorized - Invalid or missing JWT token |
| `404` | Session not found (DELETE: Filter not found in session) |
| `409` | Conflict - Filter already exists in session (POST only) |
| `422` | Validation error - Invalid filterId format |

### WebSocket Events

Khi filter được thêm hoặc xóa thành công, hệ thống sẽ tự động emit WebSocket message đến tất cả clients đang kết nối với namespace `/photobooth`:

**POST Request - Event Name:** `add_filter`

**POST Request - Message Format:**
```json
{
  "type": "add_filter",
  "data": {
    "filter_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**DELETE Request - Event Name:** `delete_filter`

**DELETE Request - Message Format:**
```json
{
  "type": "delete_filter",
  "data": {
    "filter_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**WebSocket Connection:**
```javascript
const socket = io('http://localhost:3000/photobooth', {
  transports: ['polling']
});

socket.on('add_filter', (message) => {
  console.log('Filter added:', message);
  // message = {
  //   type: "add_filter",
  //   data: { filter_id: "123e4567-e89b-12d3-a456-426614174000" }
  // }
});

socket.on('delete_filter', (message) => {
  console.log('Filter removed:', message);
  // message = {
  //   type: "delete_filter",
  //   data: { filter_id: "123e4567-e89b-12d3-a456-426614174000" }
  // }
});
```

### Business Rules

1. **Session Status Validation:**
   - Chỉ có thể thay đổi filter cho session có status là `pending` hoặc `active`
   - Không thể thay đổi filter cho session đã `completed` hoặc `cancelled`

2. **Filter ID Validation:**
   - `filterId` phải là một UUID hợp lệ
   - Filter ID không cần phải tồn tại trong hệ thống (validation chỉ kiểm tra format)

3. **WebSocket Broadcasting:**
   - Message được broadcast đến tất cả clients, không chỉ client gọi API
   - Sử dụng HTTP long polling transport

### Example Requests

**POST - Add Filter (cURL):**
```bash
curl -X POST http://localhost:3000/api/v1/photobooth/sessions/35e9fda1-97fe-4853-a58c-46460d9c9f65/change-filter \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filterId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**DELETE - Remove Filter (cURL):**
```bash
curl -X DELETE http://localhost:3000/api/v1/photobooth/sessions/35e9fda1-97fe-4853-a58c-46460d9c9f65/change-filter/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**JavaScript (Fetch):**
```javascript
const response = await fetch('http://localhost:3000/api/v1/photobooth/sessions/35e9fda1-97fe-4853-a58c-46460d9c9f65/change-filter', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    filterId: '123e4567-e89b-12d3-a456-426614174000'
  })
});

const session = await response.json();
console.log('Updated session:', session);
```

**JavaScript (Axios):**
```javascript
const axios = require('axios');

const response = await axios.post(
  'http://localhost:3000/api/v1/photobooth/sessions/35e9fda1-97fe-4853-a58c-46460d9c9f65/change-filter',
  {
    filterId: '123e4567-e89b-12d3-a456-426614174000'
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    }
  }
);

console.log('Updated session:', response.data);
```

### Error Responses

**400 Bad Request - Session completed or cancelled:**
```json
{
  "statusCode": 400,
  "message": "Cannot change filter for completed or cancelled session",
  "error": "Bad Request"
}
```

**404 Not Found - Session not found:**
```json
{
  "statusCode": 404,
  "message": "Session with ID 35e9fda1-97fe-4853-a58c-46460d9c9f65 not found",
  "error": "Not Found"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**422 Validation Error:**
```json
{
  "statusCode": 422,
  "message": [
    "filterId must be a UUID"
  ],
  "error": "Unprocessable Entity"
}
```

### Related APIs

- **Add Filter to Session:** `POST /api/v1/photobooth/sessions/{id}/filters` - Thêm filter vào mảng `filterIds`
- **Remove Filter from Session:** `DELETE /api/v1/photobooth/sessions/{id}/filters/{filterId}` - Xóa filter khỏi mảng `filterIds`
- **Get Session:** `GET /api/v1/photobooth/sessions/{id}` - Lấy thông tin session (bao gồm `filterIds`)

### Notes

- `filterIds` là mảng chứa tất cả các filter IDs đã được thêm vào session (có thể có nhiều filters)
- API `change-filter` POST tương đương với API `filters` POST - cả hai đều thêm filter vào mảng `filterIds`
- API `change-filter` DELETE tương đương với API `filters` DELETE - cả hai đều xóa filter khỏi mảng `filterIds`

