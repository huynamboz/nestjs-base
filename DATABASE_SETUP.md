# Database Setup với PostgreSQL và Docker

## 🐳 Chạy PostgreSQL với Docker

### 1. Khởi động PostgreSQL
```bash
# Chạy PostgreSQL container
docker-compose up -d postgres

# Xem logs
docker-compose logs postgres

# Kiểm tra container đang chạy
docker ps
```

### 2. Kết nối với PgAdmin (Web UI)
```bash
# Chạy PgAdmin
docker-compose up -d pgadmin

# Truy cập: http://localhost:5050
# Email: admin@admin.com
# Password: admin
```

### 3. Cấu hình PgAdmin
1. Mở PgAdmin tại http://localhost:5050
2. Login với admin@admin.com / admin
3. Right-click "Servers" → "Create" → "Server"
4. General tab: Name = "NestJS DB"
5. Connection tab:
   - Host: postgres
   - Port: 5432
   - Username: nestjs_user
   - Password: nestjs_password
   - Database: nestjs_db

## 🚀 Chạy ứng dụng

### 1. Cài đặt dependencies
```bash
yarn install
```

### 2. Tạo file .env
```bash
# Copy file cấu hình
cp .env.example .env
```

### 3. Chạy ứng dụng
```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Các lệnh Docker hữu ích

```bash
# Dừng tất cả containers
docker-compose down

# Dừng và xóa volumes (XÓA DỮ LIỆU)
docker-compose down -v

# Xem logs
docker-compose logs -f postgres

# Vào container PostgreSQL
docker exec -it nest-postgres psql -U nestjs_user -d nestjs_db

# Backup database
docker exec nest-postgres pg_dump -U nestjs_user nestjs_db > backup.sql

# Restore database
docker exec -i nest-postgres psql -U nestjs_user nestjs_db < backup.sql
```

## 🧪 Test API

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Tạo user mới
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Lấy danh sách users
curl http://localhost:3000/api/v1/users

# Lấy user theo ID
curl http://localhost:3000/api/v1/users/1
```

## 🐛 Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra container có chạy không
docker ps

# Kiểm tra logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

### Lỗi port đã được sử dụng
```bash
# Kiểm tra port 5432
lsof -i :5432

# Thay đổi port trong docker-compose.yml
ports:
  - "5433:5432"  # Sử dụng port 5433 thay vì 5432
```
