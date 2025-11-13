# Docker Production Setup

Hướng dẫn chạy toàn bộ ứng dụng bằng Docker Compose trong môi trường production.

## 🚀 Quick Start

### 1. Tạo file `.env` (tùy chọn)

Copy file `.env.example` và cập nhật các giá trị:

```bash
cp .env.example .env
```

Chỉnh sửa các biến môi trường trong `.env` nếu cần thiết.

### 2. Chạy toàn bộ ứng dụng

```bash
docker-compose up -d
```

Lệnh này sẽ:
- Build Docker image cho NestJS app
- Khởi động PostgreSQL database
- Khởi động Redis cache
- Khởi động NestJS application
- Chạy database migrations tự động
- Seed roles và admin user tự động
- Khởi động PgAdmin (optional)

### 3. Kiểm tra trạng thái

```bash
docker-compose ps
```

### 4. Xem logs

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của app chỉ
docker-compose logs -f app

# Xem logs của database
docker-compose logs -f postgres
```

### 5. Dừng ứng dụng

```bash
docker-compose down
```

### 6. Dừng và xóa volumes (xóa dữ liệu)

```bash
docker-compose down -v
```

## 📋 Services

### App (NestJS Application)
- **Port**: 3000
- **Health Check**: http://localhost:3000/api/v1/health
- **Swagger**: http://localhost:3000/api

### PostgreSQL Database
- **Port**: 5432
- **Database**: nestjs_db
- **User**: nestjs_user
- **Password**: nestjs_password

### Redis Cache
- **Port**: 6379

### PgAdmin (Database Management)
- **Port**: 5050
- **Email**: admin@admin.com
- **Password**: admin

## 🔧 Environment Variables

Các biến môi trường có thể được set trong file `.env` hoặc trực tiếp trong `docker-compose.yml`.

### Quan trọng:
- **JWT_SECRET**: Phải thay đổi trong production
- **DB_PASSWORD**: Nên thay đổi trong production
- **PGADMIN_PASSWORD**: Nên thay đổi trong production

## 🛠️ Commands

### Rebuild và restart

```bash
docker-compose up -d --build
```

### Restart một service cụ thể

```bash
docker-compose restart app
```

### Xem logs real-time

```bash
docker-compose logs -f app
```

### Execute command trong container

```bash
# Vào container app
docker-compose exec app sh

# Chạy migration thủ công
docker-compose exec app npm run migration:run

# Seed data thủ công
docker-compose exec app npm run seed:roles
docker-compose exec app npm run seed:admin
```

### Xóa và rebuild từ đầu

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📦 Production Deployment

### 1. Build image

```bash
docker-compose build
```

### 2. Tag và push image (nếu dùng registry)

```bash
docker tag photobooth-be_app:latest your-registry/photobooth-be:latest
docker push your-registry/photobooth-be:latest
```

### 3. Deploy

```bash
docker-compose up -d
```

## 🔍 Troubleshooting

### App không kết nối được database

Kiểm tra:
1. Database đã sẵn sàng: `docker-compose logs postgres`
2. Network: `docker network ls`
3. Environment variables: `docker-compose exec app env | grep DB`

### Migration failed

Chạy migration thủ công:
```bash
docker-compose exec app npm run migration:run
```

### Port đã được sử dụng

Thay đổi port trong `.env` hoặc `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay đổi port host
```

## 📝 Notes

- Database data được lưu trong volume `postgres_data`
- Redis data được lưu trong volume `redis_data`
- Migrations và seed scripts chạy tự động khi container start lần đầu
- Health checks được cấu hình cho tất cả services
- App sẽ đợi database và redis sẵn sàng trước khi start

