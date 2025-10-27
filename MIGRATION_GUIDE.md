# 🚀 TypeORM Migration Guide

## 📋 **Các lệnh Migration cơ bản**

### **1. Tạo Migration mới**
```bash
# Tự động generate migration từ entities
yarn migration:generate src/migrations/AddNewTable

# Tạo migration trống (tự viết SQL)
yarn migration:create src/migrations/AddNewTable
```

### **2. Chạy Migrations**
```bash
# Chạy tất cả migrations chưa được chạy
yarn migration:run

# Xem trạng thái migrations
yarn migration:show
```

### **3. Rollback Migrations**
```bash
# Rollback migration gần nhất
yarn migration:revert

# Rollback tất cả migrations
yarn migration:revert --all
```

## 🔄 **Quy trình làm việc với Migrations**

### **Development Workflow:**

1. **Thay đổi Entity**
   ```typescript
   // Thêm cột mới vào User entity
   @Column({ nullable: true })
   phone: string;
   ```

2. **Generate Migration**
   ```bash
   yarn migration:generate src/migrations/AddPhoneToUser
   ```

3. **Review Migration**
   ```typescript
   // Kiểm tra file migration được tạo
   // src/migrations/1234567890-AddPhoneToUser.ts
   ```

4. **Chạy Migration**
   ```bash
   yarn migration:run
   ```

### **Production Workflow:**

1. **Build ứng dụng**
   ```bash
   yarn build
   ```

2. **Chạy migrations trước khi start app**
   ```bash
   yarn migration:run
   yarn start:prod
   ```

## 📁 **Cấu trúc Migration Files**

```
src/migrations/
├── 1761545183153-InitialMigration.ts
├── 1761545200000-AddPhoneToUser.ts
└── 1761545300000-AddCategoryToProduct.ts
```

## 🔧 **Ví dụ Migration thực tế**

### **Thêm cột mới:**
```typescript
export class AddPhoneToUser1761545200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }
}
```

### **Tạo bảng mới:**
```typescript
export class CreateCategoryTable1761545300000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" (
            "id" SERIAL NOT NULL,
            "name" character varying NOT NULL,
            "description" text,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_categories" PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }
}
```

## ⚠️ **Lưu ý quan trọng**

### **✅ Best Practices:**
- Luôn review migration trước khi chạy
- Backup database trước khi chạy migration lớn
- Test migration trên staging trước
- Sử dụng transactions cho migration phức tạp

### **❌ Tránh:**
- Không sử dụng `synchronize: true` trong production
- Không xóa migration đã chạy
- Không thay đổi migration đã commit

## 🐛 **Troubleshooting**

### **Lỗi migration đã tồn tại:**
```bash
# Xóa migration khỏi database
yarn typeorm migration:revert -d ormconfig.ts
```

### **Lỗi kết nối database:**
```bash
# Kiểm tra kết nối
yarn typeorm query "SELECT 1" -d ormconfig.ts
```

### **Reset toàn bộ database:**
```bash
# Xóa tất cả migrations
yarn typeorm migration:revert --all -d ormconfig.ts

# Chạy lại từ đầu
yarn migration:run
```

## 📊 **Kiểm tra Database**

### **Xem bảng migrations:**
```sql
SELECT * FROM migrations ORDER BY timestamp DESC;
```

### **Xem cấu trúc bảng:**
```sql
\d users
\d products
```

### **Xem foreign keys:**
```sql
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
```
