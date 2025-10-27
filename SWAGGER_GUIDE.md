# 📚 Swagger API Documentation Guide

## 🚀 **Truy cập Swagger UI**

```
http://localhost:3000/api
```

## 📋 **API Endpoints**

### **1. Health Check**
- **GET** `/api/v1/health` - Kiểm tra trạng thái ứng dụng

### **2. Authentication**
- **POST** `/api/v1/auth/register` - Đăng ký tài khoản mới
- **POST** `/api/v1/auth/login` - Đăng nhập
- **POST** `/api/v1/auth/logout` - Đăng xuất

### **3. Users**
- **GET** `/api/v1/users` - Lấy danh sách tất cả users
- **GET** `/api/v1/users/:id` - Lấy thông tin user theo ID
- **POST** `/api/v1/users` - Tạo user mới
- **PUT** `/api/v1/users/:id` - Cập nhật thông tin user
- **DELETE** `/api/v1/users/:id` - Xóa user

## 🔧 **Cách sử dụng Swagger UI**

### **1. Khởi động ứng dụng**
```bash
yarn start:dev
```

### **2. Mở Swagger UI**
- Truy cập: http://localhost:3000/api
- Swagger UI sẽ hiển thị tất cả API endpoints

### **3. Test API trực tiếp**

#### **Test Health Check:**
1. Mở section "health"
2. Click "GET /api/v1/health"
3. Click "Try it out"
4. Click "Execute"
5. Xem response

#### **Test User APIs:**
1. Mở section "users"
2. **Tạo user mới:**
   - Click "POST /api/v1/users"
   - Click "Try it out"
   - Nhập data:
     ```json
     {
       "email": "test@example.com",
       "name": "Test User"
     }
     ```
   - Click "Execute"

3. **Lấy danh sách users:**
   - Click "GET /api/v1/users"
   - Click "Try it out"
   - Click "Execute"

#### **Test Auth APIs:**
1. Mở section "auth"
2. **Đăng ký:**
   - Click "POST /api/v1/auth/register"
   - Click "Try it out"
   - Nhập data:
     ```json
     {
       "email": "user@example.com",
       "password": "password123",
       "name": "John Doe"
     }
     ```
   - Click "Execute"

3. **Đăng nhập:**
   - Click "POST /api/v1/auth/login"
   - Click "Try it out"
   - Nhập data:
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
   - Click "Execute"

## 🔐 **JWT Authentication**

### **Cách sử dụng JWT Token:**
1. Đăng nhập để lấy token
2. Click nút "Authorize" ở góc trên bên phải
3. Nhập token: `Bearer your-jwt-token-here`
4. Click "Authorize"
5. Bây giờ có thể test các protected endpoints

## 📊 **Response Examples**

### **Health Check Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### **User Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### **Auth Response:**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 🎯 **Swagger Features**

### **✅ Interactive Testing**
- Test API trực tiếp từ browser
- Không cần Postman hay curl
- Real-time response

### **✅ Auto-generated Documentation**
- Tự động tạo từ code
- Luôn cập nhật khi code thay đổi
- Type-safe examples

### **✅ Request/Response Examples**
- Có sẵn data mẫu
- Validation tự động
- Error responses đầy đủ

### **✅ JWT Authentication**
- Bearer token support
- Persistent authorization
- Secure testing

## 🐛 **Troubleshooting**

### **Lỗi 500 Internal Server Error:**
- Kiểm tra database connection
- Xem logs trong terminal
- Đảm bảo PostgreSQL đang chạy

### **Lỗi 404 Not Found:**
- Kiểm tra URL endpoint
- Đảm bảo ứng dụng đang chạy
- Kiểm tra route configuration

### **Lỗi 401 Unauthorized:**
- Kiểm tra JWT token
- Đảm bảo đã login trước
- Kiểm tra token format

## 📝 **Tips & Best Practices**

1. **Luôn test API trước khi deploy**
2. **Sử dụng examples có sẵn**
3. **Kiểm tra response status codes**
4. **Lưu token để test protected endpoints**
5. **Xem error messages để debug**

## 🔗 **Useful Links**

- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/v1/health
- **API Base URL**: http://localhost:3000/api/v1
