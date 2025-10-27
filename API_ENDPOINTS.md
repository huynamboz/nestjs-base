# API Endpoints Documentation

## Base URL
```
http://localhost:3000
```

## Available Endpoints

### 1. Health Check
- **GET** `/api/v1/health` - Kiểm tra trạng thái ứng dụng

### 2. Authentication
- **POST** `/api/v1/auth/register` - Đăng ký tài khoản mới
- **POST** `/api/v1/auth/login` - Đăng nhập
- **POST** `/api/v1/auth/logout` - Đăng xuất

### 3. Users
- **GET** `/api/v1/users` - Lấy danh sách tất cả users
- **GET** `/api/v1/users/:id` - Lấy thông tin user theo ID
- **POST** `/api/v1/users` - Tạo user mới
- **PUT** `/api/v1/users/:id` - Cập nhật thông tin user
- **DELETE** `/api/v1/users/:id` - Xóa user

## Request/Response Examples

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create User
```bash
POST /api/v1/users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "name": "New User"
}
```
