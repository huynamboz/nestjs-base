# Webhook API Documentation

## Overview
Webhook API cung cấp các endpoint để nhận thông báo từ các hệ thống bên ngoài (như SePay) và xử lý tự động.

**Base URL:** `http://localhost:3000/webhooks`

## Authentication
Webhook endpoints **KHÔNG** yêu cầu authentication vì chúng được gọi từ các hệ thống bên ngoài.

## Endpoints

### 1. SePay Webhook
Nhận thông báo giao dịch từ SePay và tự động cộng points cho user.

**Endpoint:** `POST /webhooks/sepay`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 92704,
  "gateway": "Vietcombank",
  "transactionDate": "2023-03-25 14:02:37",
  "accountNumber": "0123499999",
  "code": "123e4567-e89b-12d3-a456-426614174000",
  "content": "chuyen tien mua iphone",
  "transferType": "in",
  "transferAmount": 2277000,
  "accumulated": 19077000,
  "subAccount": null,
  "referenceCode": "MBVCB.3278907687",
  "description": ""
}
```

**Request Body Fields:**
- `id` (number, required): ID giao dịch trên SePay
- `gateway` (string, required): Brand name của ngân hàng
- `transactionDate` (string, required): Thời gian xảy ra giao dịch
- `accountNumber` (string, required): Số tài khoản ngân hàng
- `code` (string, optional): Mã code thanh toán - **Nên chứa Payment Code (6-8 ký tự alphanumeric)** hoặc User ID (UUID) để hệ thống xác định user
- `content` (string, required): Nội dung chuyển khoản - **Có thể chứa Payment Code (6-8 ký tự)** hoặc User ID (UUID) nếu code không có
- `transferType` (string, required): Loại giao dịch - `"in"` (tiền vào) hoặc `"out"` (tiền ra)
- `transferAmount` (number, required): Số tiền giao dịch (VND) - sẽ được chuyển thành points (1 VND = 1 point)
- `accumulated` (number, required): Số dư tài khoản (lũy kế)
- `subAccount` (string, optional): Tài khoản ngân hàng phụ
- `referenceCode` (string, required): Mã tham chiếu của tin nhắn sms
- `description` (string, optional): Toàn bộ nội dung tin nhắn sms

**Response:**
```json
{
  "success": true,
  "message": "Points added successfully",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "pointsAdded": 2277000,
  "newBalance": 3277000,
  "transactionId": 92704
}
```

**Status Codes:**
- `200`: Webhook processed successfully
- `400`: Bad request - User ID not found in webhook data
- `404`: User not found

**Business Logic:**
1. Chỉ xử lý giao dịch có `transferType = "in"` (tiền vào)
2. Tìm User theo thứ tự ưu tiên:
   - **PTB + Payment Code (khuyến nghị):** Format `PTB` + 8 ký tự payment code (ví dụ: `PTBA1A1A1A1A1A1A1A1`)
   - **Payment Code trực tiếp:** 6-8 ký tự alphanumeric
   - **UUID (backward compatibility):** UUID format
3. Chuyển đổi `transferAmount` (VND) thành points: **1 VND = 1 point**
4. Cộng points vào user
5. Log toàn bộ quá trình

**Format Payment Code trong nội dung chuyển khoản:**
- Format khuyến nghị: `PTB` + payment code (8 ký tự)
- Ví dụ: `PTBA1A1A1A1A1A1A1A1` (PTB + a1a1a1a1a1a1a1a1)
- Tổng độ dài: 11 ký tự (PTB = 3 ký tự + 8 ký tự payment code)

**Example Requests:**

**cURL:**
```bash
curl -X POST http://localhost:3000/webhooks/sepay \
  -H "Content-Type: application/json" \
  -d '{
    "id": 92704,
    "gateway": "Vietcombank",
    "transactionDate": "2023-03-25 14:02:37",
    "accountNumber": "0123499999",
    "code": "PTBA1A1A1A1A1A1A1A1",
    "content": "PTBA1A1A1A1A1A1A1A1",
    "transferType": "in",
    "transferAmount": 2277000,
    "accumulated": 19077000,
    "subAccount": null,
    "referenceCode": "MBVCB.3278907687",
    "description": ""
  }'
```

**JavaScript (Fetch):**
```javascript
const response = await fetch('http://localhost:3000/webhooks/sepay', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id: 92704,
    gateway: 'Vietcombank',
    transactionDate: '2023-03-25 14:02:37',
    accountNumber: '0123499999',
    code: 'PTBA1A1A1A1A1A1A1A1',
    content: 'PTBA1A1A1A1A1A1A1A1',
    transferType: 'in',
    transferAmount: 2277000,
    accumulated: 19077000,
    subAccount: null,
    referenceCode: 'MBVCB.3278907687',
    description: ''
  })
});

const result = await response.json();
console.log('Webhook result:', result);
```

**JavaScript (Axios):**
```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3000/webhooks/sepay', {
  id: 92704,
  gateway: 'Vietcombank',
  transactionDate: '2023-03-25 14:02:37',
  accountNumber: '0123499999',
  code: 'PTBA1A1A1A1A1A1A1A1',
  content: 'PTBA1A1A1A1A1A1A1A1',
  transferType: 'in',
  transferAmount: 2277000,
  accumulated: 19077000,
  subAccount: null,
  referenceCode: 'MBVCB.3278907687',
  description: ''
});

console.log('Webhook result:', response.data);
```

## Error Handling

### User ID Not Found (400)
```json
{
  "statusCode": 400,
  "message": "User ID not found in webhook data. Please include user ID in code or content field.",
  "error": "Bad Request"
}
```

**Giải pháp:** Đảm bảo `code` hoặc `content` chứa User ID (UUID format).

### User Not Found (404)
```json
{
  "statusCode": 404,
  "message": "User with ID 123e4567-e89b-12d3-a456-426614174000 not found",
  "error": "Not Found"
}
```

**Giải pháp:** Kiểm tra User ID có tồn tại trong hệ thống.

## Integration Guide

### Cấu hình SePay Webhook

1. **Đăng nhập vào SePay Dashboard**
2. **Vào phần Cấu hình Webhook**
3. **Thiết lập Webhook URL:** `https://your-domain.com/webhooks/sepay`
4. **Chọn Events:** Chọn "Giao dịch tiền vào"
5. **Format:** JSON

### Cách gửi Payment Code trong giao dịch

**Payment Code** là mã ngắn (8 ký tự, chỉ chữ thường và số) được gán cho mỗi user. Khi chuyển khoản, cần nhập với format: **`PTB` + Payment Code**.

**Format:** `PTB` + 8 ký tự payment code
- Ví dụ: Payment code là `a1a1a1a1a1a1a1a1` → Nhập vào nội dung: `PTBA1A1A1A1A1A1A1A1`
- Tổng độ dài: 11 ký tự (PTB = 3 ký tự + 8 ký tự payment code)

Có 2 cách để hệ thống nhận diện user:

#### Cách 1: Gửi PTB + Payment Code trong field `code` (Khuyến nghị)
```json
{
  "code": "PTBA1A1A1A1A1A1A1A1",
  "content": "PTBA1A1A1A1A1A1A1A1",
  ...
}
```

#### Cách 2: Gửi PTB + Payment Code trong field `content`
```json
{
  "code": null,
  "content": "PTBA1A1A1A1A1A1A1A1",
  ...
}
```

**Lưu ý:** 
- Hệ thống vẫn hỗ trợ payment code trực tiếp (không có PTB) và UUID (backward compatibility)
- Nhưng **khuyến nghị dùng format `PTB` + Payment Code** để dễ nhận diện và tránh nhầm lẫn

### Lấy Payment Code của user

User có thể lấy payment code của mình qua API:
- `GET /api/v1/users/me` - Trả về thông tin user bao gồm payment code
- `GET /api/v1/users/me/payment-code` - Chỉ lấy payment code (tự động generate nếu chưa có)

## Security Considerations

### ⚠️ Important Notes

1. **No Authentication:** Webhook endpoint không yêu cầu authentication để SePay có thể gọi được
2. **IP Whitelist:** Nên cấu hình IP whitelist ở reverse proxy (nginx/Apache) để chỉ cho phép IP của SePay
3. **Signature Verification:** Nên implement signature verification nếu SePay hỗ trợ
4. **Rate Limiting:** Có thể cần implement rate limiting để tránh spam
5. **Idempotency:** Nên lưu transaction ID để tránh xử lý trùng lặp

### Recommended Security Setup

```nginx
# nginx configuration example
location /webhooks/sepay {
    # Only allow SePay IPs
    allow 1.2.3.4;  # SePay IP
    deny all;
    
    proxy_pass http://localhost:3000;
}
```

## Testing

### Test với giao dịch tiền vào
```bash
curl -X POST http://localhost:3000/webhooks/sepay \
  -H "Content-Type: application/json" \
  -d '{
    "id": 99999,
    "gateway": "Vietcombank",
    "transactionDate": "2024-01-01 10:00:00",
    "accountNumber": "0123499999",
    "code": "PTBA1A1A1A1A1A1A1A1",
    "content": "PTBA1A1A1A1A1A1A1A1",
    "transferType": "in",
    "transferAmount": 100000,
    "accumulated": 1000000,
    "subAccount": null,
    "referenceCode": "TEST.123456",
    "description": ""
  }'
```

**Lưu ý:** Thay `PTBA1A1A1A1A1A1A1A1` bằng payment code thực tế của user (format: `PTB` + 8 ký tự payment code).

### Test với giao dịch tiền ra (sẽ bị ignore)
```bash
curl -X POST http://localhost:3000/webhooks/sepay \
  -H "Content-Type: application/json" \
  -d '{
    ...
    "transferType": "out",
    ...
  }'
```

Response sẽ là:
```json
{
  "success": true,
  "message": "Transaction ignored (not incoming)"
}
```

## Logging

Tất cả webhook requests đều được log với các thông tin:
- Webhook data nhận được
- User ID được tìm thấy
- Số points đã cộng
- Số dư mới của user
- Errors (nếu có)

Check logs:
```bash
# Docker
docker-compose logs -f app | grep webhook

# Local
# Logs sẽ hiển thị trong console
```

## Notes

- **Tỷ lệ chuyển đổi:** Hiện tại 1 VND = 1 point. Có thể thay đổi trong code nếu cần
- **Chỉ xử lý tiền vào:** Giao dịch `transferType = "out"` sẽ bị bỏ qua
- **User ID format:** Phải là UUID format (ví dụ: `123e4567-e89b-12d3-a456-426614174000`)
- **Transaction ID:** Mỗi giao dịch có ID riêng, có thể dùng để tránh xử lý trùng lặp (chưa implement)

