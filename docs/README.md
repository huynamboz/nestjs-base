# API Documentation

## Overview
Tài liệu API cho NestJS Authentication & User Management System. Hệ thống cung cấp các API để quản lý người dùng, xác thực và phân quyền.

## API Groups

### 🔐 [Authentication API](./api/auth-api.md)
Các endpoint để đăng ký, đăng nhập, đăng xuất và quản lý xác thực người dùng.

**Key Features:**
- User registration với validation
- JWT-based authentication
- Password hashing với bcrypt
- Role-based access control

**Endpoints:**
- `POST /api/v1/auth/register` - Đăng ký user mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất

### 👥 [User Management API](./api/user-api.md)
Các endpoint để quản lý thông tin người dùng (chỉ dành cho ADMIN).

**Key Features:**
- CRUD operations cho users
- Role assignment
- User profile management
- Admin-only access

**Endpoints:**
- `GET /api/v1/users` - Lấy danh sách users
- `GET /api/v1/users/{id}` - Lấy user theo ID
- `POST /api/v1/users` - Tạo user mới
- `PUT /api/v1/users/{id}` - Cập nhật user
- `DELETE /api/v1/users/{id}` - Xóa user

### ⚙️ [Admin Management API](./api/admin-api.md)
Các endpoint để quản lý roles và thực hiện tác vụ quản trị hệ thống.

**Key Features:**
- Role management
- User role assignment
- System initialization
- Admin-only operations

**Endpoints:**
- `GET /api/v1/admin/roles` - Lấy danh sách roles
- `POST /api/v1/admin/users/{id}/role` - Gán role cho user
- `GET /api/v1/admin/seed-roles` - Khởi tạo roles mặc định

## Quick Start

### 1. Authentication Flow
```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin User",
    "password": "Password123"
  }'

# 2. Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123"
  }'
```

### 2. Admin Setup
```bash
# 1. Seed default roles
curl -X GET http://localhost:3000/api/v1/admin/seed-roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 2. Get roles to find admin role ID
curl -X GET http://localhost:3000/api/v1/admin/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Promote user to admin
curl -X POST http://localhost:3000/api/v1/admin/users/USER_UUID/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": "ADMIN_ROLE_UUID"}'
```

## Authentication

### JWT Token
Tất cả protected endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access
- **USER**: Chỉ có thể truy cập thông tin cá nhân
- **ADMIN**: Có thể quản lý tất cả users và roles

## Data Models

### User
```typescript
{
  id: string;           // UUID
  email: string;        // Unique email
  name: string;         // Full name
  phone?: string;       // Phone number
  address?: string;     // Address
  roleId?: string;      // Role foreign key
  role?: Role;          // Role object
  createdAt: Date;      // Creation date
  updatedAt: Date;      // Last update date
}
```

### Role
```typescript
{
  id: string;           // UUID
  name: string;         // Role name (admin, user)
  description?: string; // Role description
  createdAt: Date;      // Creation date
  updatedAt: Date;      // Last update date
}
```

## Error Handling

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)

### Error Response Format
```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address",
    "Password must be at least 8 characters long"
  ],
  "error": "Bad Request"
}
```

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

### JWT Configuration
- **Algorithm**: HS256
- **Expiration**: 30 days (configurable)
- **Issuer**: nestjs-app

### Password Hashing
- **Algorithm**: bcrypt
- **Salt Rounds**: 12

## Development

### Prerequisites
- Node.js >= 20.0.0
- PostgreSQL
- Docker (optional)

### Installation
```bash
# Install dependencies
yarn install

# Start PostgreSQL with Docker
docker-compose up -d

# Run migrations
yarn migration:run

# Seed roles
yarn seed:roles

# Start development server
yarn start:dev
```

### Available Scripts
```bash
yarn start:dev          # Start development server
yarn build              # Build for production
yarn test               # Run tests
yarn migration:generate # Generate migration
yarn migration:run      # Run migrations
yarn seed:roles         # Seed default roles
```

## API Testing

### Swagger UI
Truy cập Swagger UI tại: `http://localhost:3000/api`

### Postman Collection
Import các endpoints vào Postman để test:
1. Authentication endpoints
2. User management endpoints
3. Admin management endpoints

## Production Considerations

### Security
- Implement rate limiting
- Use HTTPS in production
- Rotate JWT secrets regularly
- Implement proper logging and monitoring

### Performance
- Implement caching for frequently accessed data
- Use database indexing for better query performance
- Consider implementing pagination for large datasets

### Monitoring
- Set up application monitoring
- Implement health checks
- Log all admin actions for audit

## Support

### Common Issues
1. **JWT Token Expired**: Re-login to get new token
2. **Permission Denied**: Check user role and permissions
3. **Validation Errors**: Check request body format and validation rules

### Getting Help
- Check individual API documentation
- Review error messages and status codes
- Check server logs for detailed error information

## Changelog

### v1.0.0
- Initial release
- JWT authentication
- User management
- Role-based access control
- Admin management
- Swagger documentation
