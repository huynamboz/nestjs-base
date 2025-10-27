# User Management API Documentation

## Overview
User Management API cung cấp các endpoint để quản lý thông tin người dùng. Tất cả endpoints đều yêu cầu xác thực JWT và quyền ADMIN.

**Base URL:** `http://localhost:3000/api/v1/users`

## Authentication
Tất cả endpoints yêu cầu:
- **JWT Token** trong header `Authorization: Bearer <token>`
- **Role:** ADMIN (chỉ admin mới có thể quản lý users)

## Endpoints

### 1. Get All Users
Lấy danh sách tất cả người dùng trong hệ thống.

**Endpoint:** `GET /api/v1/users`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "0909090909",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "role": {
      "id": "role-uuid",
      "name": "user",
      "description": "Regular user"
    }
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required

### 2. Get User by ID
Lấy thông tin chi tiết của một người dùng.

**Endpoint:** `GET /api/v1/users/{id}`

**Path Parameters:**
- `id` (string, required): User UUID

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "0909090909",
  "address": "123 Main St",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "role": {
    "id": "role-uuid",
    "name": "user",
    "description": "Regular user"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: User not found

### 3. Create New User
Tạo người dùng mới trong hệ thống.

**Endpoint:** `POST /api/v1/users`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "Password123",
  "phone": "0909090909",
  "address": "456 Oak St",
  "roleId": "role-uuid"
}
```

**Validation Rules:**
- `email`: Required, valid email format, unique
- `name`: Required, minimum 2 characters
- `password`: Optional, minimum 8 characters with complexity requirements
- `phone`: Optional, string
- `address`: Optional, string
- `roleId`: Optional, valid UUID

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "newuser@example.com",
  "name": "New User",
  "phone": "0909090909",
  "address": "456 Oak St",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "role": {
    "id": "role-uuid",
    "name": "user",
    "description": "Regular user"
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Bad request - validation failed
- `401`: Unauthorized
- `403`: Forbidden - Admin role required

### 4. Update User
Cập nhật thông tin người dùng.

**Endpoint:** `PUT /api/v1/users/{id}`

**Path Parameters:**
- `id` (string, required): User UUID

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "name": "Updated Name",
  "phone": "0987654321",
  "address": "789 Pine St",
  "roleId": "admin-role-uuid"
}
```

**Validation Rules:**
- Tất cả fields đều optional
- `email`: Valid email format if provided
- `name`: Minimum 2 characters if provided
- `password`: Minimum 8 characters with complexity if provided
- `roleId`: Valid UUID if provided

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "updated@example.com",
  "name": "Updated Name",
  "phone": "0987654321",
  "address": "789 Pine St",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "role": {
    "id": "admin-role-uuid",
    "name": "admin",
    "description": "Administrator"
  }
}
```

**Status Codes:**
- `200`: User updated successfully
- `400`: Bad request - validation failed
- `401`: Unauthorized
- `403`: Forbidden - Admin role required
- `404`: User not found

### 5. Delete User
Xóa người dùng khỏi hệ thống.

**Endpoint:** `DELETE /api/v1/users/{id}`

**Path Parameters:**
- `id` (string, required): User UUID

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "User with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted"
}
```

**Status Codes:**
- `200`: User deleted successfully
- `401`: Unauthorized
- `403`: Forbidden - Admin role required
- `404`: User not found

## User Data Model

### User Entity
```typescript
{
  id: string;           // UUID, Primary Key
  email: string;        // Unique email address
  name: string;         // Full name
  password?: string;    // Hashed password (optional in responses)
  phone?: string;       // Phone number
  address?: string;     // Address
  roleId?: string;      // Foreign key to Role
  role?: Role;          // Role object (eager loaded)
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Role Object
```typescript
{
  id: string;           // Role UUID
  name: string;         // Role name (admin, user)
  description?: string; // Role description
}
```

## Error Handling

### Common Error Responses

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
  "message": "User with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

**Validation Error (400):**
```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Name must be at least 2 characters long"
  ],
  "error": "Bad Request"
}
```

## Testing with cURL

### Get All Users
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create User
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "Password123",
    "phone": "0909090909",
    "address": "456 Oak St"
  }'
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "0987654321"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/v1/users/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Considerations

### Role-Based Access Control
- Tất cả endpoints yêu cầu role ADMIN
- JWT token phải hợp lệ và chứa thông tin role
- Role được kiểm tra qua RolesGuard

### Data Protection
- Password không bao giờ được trả về trong response
- Sensitive data được hash trước khi lưu trữ
- Input validation nghiêm ngặt

### Audit Trail
- Tất cả operations được log
- Timestamps cho create/update operations
- User tracking thông qua JWT token

## Rate Limiting
Currently no rate limiting implemented. Consider implementing rate limiting for production use.

## Notes
- Tất cả user IDs sử dụng UUID format
- Role information được eager load trong responses
- Soft delete không được implement (hard delete)
- Email addresses phải unique trong toàn hệ thống
