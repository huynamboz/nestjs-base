# Bank Management API Documentation

## Overview
Bank Management API cung cấp các endpoint để quản lý thông tin ngân hàng của admin. Admin có thể lấy danh sách ngân hàng từ VietQR API và lưu thông tin tài khoản ngân hàng để user có thể chuyển khoản.

**Base URLs:**
- Admin endpoints: `http://localhost:3000/api/v1/admin`
- Public endpoints: `http://localhost:3000/api/v1/bank-info`

## Authentication

### Admin Endpoints
Tất cả admin endpoints yêu cầu:
- **JWT Token** trong header `Authorization: Bearer <token>`
- **Role:** ADMIN (chỉ admin mới có thể truy cập)

### Public Endpoints
Public endpoints không yêu cầu authentication, bất kỳ ai cũng có thể truy cập.

## Endpoints

### Public Endpoints

#### 1. Get Bank Information (Public)
Lấy thông tin ngân hàng để user có thể chuyển khoản nạp điểm. Endpoint này không yêu cầu authentication.

**Endpoint:** `GET /api/v1/bank-info`

**Headers:**
```
(No authentication required)
```

**Response (Success):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "bankCode": "VCB",
  "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
  "accountNumber": "0123456789",
  "accountHolderName": "NGUYEN VAN A",
  "branch": "Chi nhánh Hà Nội",
  "qrCodeUrl": "https://api.vietqr.io/image/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (Not Found):**
```json
null
```

**Status Codes:**
- `200`: Success (returns bank info or null if not found)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/bank-info"
```

**Use Case:**
- User có thể gọi API này để lấy thông tin tài khoản ngân hàng khi muốn nạp điểm
- Hiển thị thông tin ngân hàng trên UI để user chuyển khoản
- Tạo QR code từ thông tin này để user quét và chuyển khoản

---

### Admin Endpoints

#### 1. Get List of Banks
Lấy danh sách tất cả ngân hàng từ VietQR API.

**Endpoint:** `GET /api/v1/admin/banks`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "code": "00",
  "desc": "Get Bank list successful! Total 65 banks",
  "data": [
    {
      "id": 43,
      "name": "Ngân hàng TMCP Ngoại Thương Việt Nam",
      "code": "VCB",
      "bin": "970436",
      "shortName": "Vietcombank",
      "logo": "https://cdn.vietqr.io/img/VCB.png",
      "transferSupported": 1,
      "lookupSupported": 1
    },
    {
      "id": 4,
      "name": "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      "code": "BIDV",
      "bin": "970418",
      "shortName": "BIDV",
      "logo": "https://cdn.vietqr.io/img/BIDV.png",
      "transferSupported": 1,
      "lookupSupported": 1
    }
    // ... và các ngân hàng khác
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required
- `500`: Internal server error - Failed to fetch from VietQR API

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/banks" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 2. Get Bank Information (Admin)
Lấy thông tin ngân hàng hiện tại của admin.

**Endpoint:** `GET /api/v1/admin/bank-info`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "bankCode": "VCB",
  "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
  "accountNumber": "0123456789",
  "accountHolderName": "NGUYEN VAN A",
  "branch": "Chi nhánh Hà Nội",
  "qrCodeUrl": "https://api.vietqr.io/image/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response (Not Found):**
```json
null
```

**Status Codes:**
- `200`: Success (returns bank info or null if not found)
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/bank-info" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 3. Create or Update Bank Information
Tạo mới hoặc cập nhật thông tin ngân hàng. Nếu đã có thông tin ngân hàng, endpoint này sẽ cập nhật thông tin hiện có. Nếu chưa có, sẽ tạo mới.

**Endpoint:** `POST /api/v1/admin/bank-info`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bankCode": "VCB",
  "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
  "accountNumber": "0123456789",
  "accountHolderName": "NGUYEN VAN A",
  "branch": "Chi nhánh Hà Nội",
  "qrCodeUrl": "https://api.vietqr.io/image/..."
}
```

**Request Body Fields:**
- `bankCode` (required, string): Mã ngân hàng từ VietQR API (VD: VCB, BIDV, etc.)
- `bankName` (required, string): Tên ngân hàng
- `accountNumber` (required, string, min 8 characters): Số tài khoản
- `accountHolderName` (required, string, min 2 characters): Tên chủ tài khoản
- `branch` (optional, string): Chi nhánh ngân hàng
- `qrCodeUrl` (optional, string): URL QR code (nếu có)

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "bankCode": "VCB",
  "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
  "accountNumber": "0123456789",
  "accountHolderName": "NGUYEN VAN A",
  "branch": "Chi nhánh Hà Nội",
  "qrCodeUrl": "https://api.vietqr.io/image/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200`: Success - Bank info created/updated successfully
- `400`: Bad request - Validation failed
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required

**cURL Example:**
```bash
curl -X POST "http://localhost:3000/api/v1/admin/bank-info" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankCode": "VCB",
    "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
    "accountNumber": "0123456789",
    "accountHolderName": "NGUYEN VAN A",
    "branch": "Chi nhánh Hà Nội"
  }'
```

---

#### 4. Update Bank Information by ID
Cập nhật thông tin ngân hàng theo ID.

**Endpoint:** `PUT /api/v1/admin/bank-info/:id`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (required, UUID): ID của bank info cần cập nhật

**Request Body:**
```json
{
  "accountNumber": "9876543210",
  "accountHolderName": "TRAN THI B",
  "branch": "Chi nhánh TP. Hồ Chí Minh"
}
```

**Request Body Fields (all optional):**
- `bankCode` (optional, string): Mã ngân hàng từ VietQR API
- `bankName` (optional, string): Tên ngân hàng
- `accountNumber` (optional, string, min 8 characters): Số tài khoản
- `accountHolderName` (optional, string, min 2 characters): Tên chủ tài khoản
- `branch` (optional, string): Chi nhánh ngân hàng
- `qrCodeUrl` (optional, string): URL QR code

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "bankCode": "VCB",
  "bankName": "Ngân hàng TMCP Ngoại Thương Việt Nam",
  "accountNumber": "9876543210",
  "accountHolderName": "TRAN THI B",
  "branch": "Chi nhánh TP. Hồ Chí Minh",
  "qrCodeUrl": "https://api.vietqr.io/image/...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200`: Success - Bank info updated successfully
- `400`: Bad request - Validation failed
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required
- `404`: Not found - Bank info with specified ID not found

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/v1/admin/bank-info/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "9876543210",
    "accountHolderName": "TRAN THI B"
  }'
```

---

#### 5. Delete Bank Information
Xóa thông tin ngân hàng theo ID.

**Endpoint:** `DELETE /api/v1/admin/bank-info/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (required, UUID): ID của bank info cần xóa

**Response:**
```json
{
  "message": "Bank info with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted"
}
```

**Status Codes:**
- `200`: Success - Bank info deleted successfully
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required
- `404`: Not found - Bank info with specified ID not found

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/admin/bank-info/123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Bank Info Entity Model

```typescript
{
  id: string;                    // UUID
  bankCode: string;              // Mã ngân hàng (VD: VCB, BIDV)
  bankName: string;              // Tên ngân hàng
  accountNumber: string;         // Số tài khoản
  accountHolderName: string;     // Tên chủ tài khoản
  branch?: string;               // Chi nhánh (optional)
  qrCodeUrl?: string;           // URL QR code (optional)
  createdAt: Date;               // Ngày tạo
  updatedAt: Date;               // Ngày cập nhật
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": [
    "bankCode must be a string",
    "accountNumber must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

### Unauthorized (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "statusCode": 403,
  "message": "Forbidden - Admin role required"
}
```

### Not Found (404)
```json
{
  "statusCode": 404,
  "message": "Bank info with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

---

## Notes

1. **Single Bank Info**: Hệ thống được thiết kế để chỉ có một thông tin ngân hàng. Endpoint `POST /api/v1/admin/bank-info` sẽ tự động cập nhật thông tin hiện có nếu đã tồn tại, hoặc tạo mới nếu chưa có.

2. **VietQR API**: Danh sách ngân hàng được lấy từ VietQR API (`https://api.vietqr.io/v2/banks`). API này trả về danh sách tất cả ngân hàng tại Việt Nam.

3. **Bank Code**: Khi tạo/cập nhật bank info, `bankCode` phải là một trong các mã ngân hàng hợp lệ từ VietQR API (VD: VCB, BIDV, ACB, etc.).

4. **Account Number**: Số tài khoản phải có ít nhất 8 ký tự.

5. **Account Holder Name**: Tên chủ tài khoản phải có ít nhất 2 ký tự.

---

## Integration with Webhook

Thông tin ngân hàng này có thể được sử dụng kết hợp với webhook SePay để:
- Hiển thị thông tin tài khoản ngân hàng cho user khi họ muốn nạp điểm
- Tạo QR code để user quét và chuyển khoản
- Xác minh các giao dịch chuyển khoản đến từ đúng tài khoản

