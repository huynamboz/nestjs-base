# Photo Assets API Documentation

## Overview
Photo Assets API cung cấp các endpoint để quản lý frames, filters và stickers cho photoboth. API được chia thành 2 nhóm: Public (không cần auth) và Admin (cần auth + admin role).

**Base URL:** `http://localhost:3000/api/v1`

## Asset Types
- **`frame`** - Khung ảnh cho photoboth
- **`filter`** - Bộ lọc màu sắc
- **`sticker`** - Sticker trang trí

## Public Endpoints (Không cần authentication)

### 1. Get All Assets
Lấy danh sách tất cả assets trong hệ thống.

**Endpoint:** `GET /api/v1/assets`

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
    "publicId": "photoboth/frames/frame1",
    "type": "frame",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Success

### 2. Get Frames
Lấy danh sách tất cả frames.

**Endpoint:** `GET /api/v1/assets/frames`

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
    "publicId": "photoboth/frames/frame1",
    "type": "frame",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Success

### 3. Get Filters
Lấy danh sách tất cả filters.

**Endpoint:** `GET /api/v1/assets/filters`

**Response:**
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/filters/filter1.png",
    "publicId": "photoboth/filters/filter1",
    "type": "filter",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Success

### 4. Get Stickers
Lấy danh sách tất cả stickers.

**Endpoint:** `GET /api/v1/assets/stickers`

**Response:**
```json
[
  {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/stickers/sticker1.png",
    "publicId": "photoboth/stickers/sticker1",
    "type": "sticker",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Success

### 5. Get Asset by ID
Lấy thông tin chi tiết của một asset.

**Endpoint:** `GET /api/v1/assets/{id}`

**Path Parameters:**
- `id` (string, required): Asset UUID

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
  "publicId": "photoboth/frames/frame1",
  "type": "frame",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200`: Success
- `404`: Asset not found

## Admin Endpoints (Cần authentication + admin role)

### Authentication
Tất cả admin endpoints yêu cầu:
- **JWT Token** trong header `Authorization: Bearer <token>`
- **Role:** ADMIN

### 1. Get All Assets (Admin)
Lấy danh sách tất cả assets (admin view).

**Endpoint:** `GET /api/v1/admin/assets`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
    "publicId": "photoboth/frames/frame1",
    "type": "frame",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized - Invalid or missing token
- `403`: Forbidden - Admin role required

### 2. Upload Asset File
Upload file ảnh lên Cloudinary và tạo asset mới.

**Endpoint:** `POST /api/v1/admin/assets/upload`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `file` (file, required): Image file (max 5MB, jpeg/jpg/png/gif/webp)
- `type` (string, required): Asset type (frame/filter/sticker)

**File Validation:**
- **Max size:** 5MB
- **Allowed types:** image/jpeg, image/jpg, image/png, image/gif, image/webp

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
  "publicId": "photoboth/frames/frame1",
  "type": "frame",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201`: Asset uploaded successfully
- `400`: Bad request - Invalid file or validation failed
- `401`: Unauthorized
- `403`: Forbidden - Admin role required

### 3. Create Asset with URL
Tạo asset mới với URL có sẵn (không upload file).

**Endpoint:** `POST /api/v1/admin/assets`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "frame"
}
```

**Validation Rules:**
- `type`: Required, must be one of: frame, filter, sticker

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "imageUrl": "https://example.com/asset.png",
  "publicId": null,
  "type": "frame",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201`: Asset created successfully
- `400`: Bad request - validation failed
- `401`: Unauthorized
- `403`: Forbidden - Admin role required

### 4. Delete Asset
Xóa asset khỏi hệ thống và Cloudinary.

**Endpoint:** `DELETE /api/v1/admin/assets/{id}`

**Path Parameters:**
- `id` (string, required): Asset UUID

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Asset with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted"
}
```

**Status Codes:**
- `200`: Asset deleted successfully
- `401`: Unauthorized
- `403`: Forbidden - Admin role required
- `404`: Asset not found

## Data Models

### Asset Entity
```typescript
{
  id: string;           // UUID, Primary Key
  imageUrl: string;     // Cloudinary URL or external URL
  publicId?: string;    // Cloudinary public ID (if uploaded)
  type: AssetType;      // frame, filter, or sticker
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### AssetType Enum
```typescript
enum AssetType {
  FRAME = 'frame',
  FILTER = 'filter',
  STICKER = 'sticker'
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
  "message": "Asset not found",
  "error": "Not Found"
}
```

**Bad Request (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid file type or size",
  "error": "Bad Request"
}
```

**Validation Error (422):**
```json
{
  "statusCode": 422,
  "message": [
    "Type must be a valid asset type"
  ],
  "error": "Unprocessable Entity"
}
```

## Testing with cURL

### Public Endpoints

**Get all assets:**
```bash
curl -X GET http://localhost:3000/api/v1/assets
```

**Get frames only:**
```bash
curl -X GET http://localhost:3000/api/v1/assets/frames
```

**Get filters only:**
```bash
curl -X GET http://localhost:3000/api/v1/assets/filters
```

**Get stickers only:**
```bash
curl -X GET http://localhost:3000/api/v1/assets/stickers
```

**Get asset by ID:**
```bash
curl -X GET http://localhost:3000/api/v1/assets/123e4567-e89b-12d3-a456-426614174000
```

### Admin Endpoints

**Get all assets (admin):**
```bash
curl -X GET http://localhost:3000/api/v1/admin/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Upload asset file:**
```bash
curl -X POST http://localhost:3000/api/v1/admin/assets/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@frame1.png" \
  -F "type=frame"
```

**Create asset with URL:**
```bash
curl -X POST http://localhost:3000/api/v1/admin/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "frame"
  }'
```

**Delete asset:**
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/assets/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Cloudinary Integration

### Features
- **Automatic upload** to Cloudinary
- **Image optimization** (quality: auto, format: auto)
- **Organized folders** (photoboth/frames, photoboth/filters, photoboth/stickers)
- **Secure URLs** with HTTPS
- **Automatic cleanup** when deleting assets

### File Upload Process
1. **File validation** (size, type)
2. **Upload to Cloudinary** with optimization
3. **Extract public ID** from response
4. **Save to database** with URL and public ID
5. **Return asset data** to client

### File Deletion Process
1. **Find asset** in database
2. **Delete from Cloudinary** (if publicId exists)
3. **Delete from database**
4. **Return success message**

## Security Considerations

### File Upload Security
- **File type validation** - Only image files allowed
- **File size limit** - Maximum 5MB
- **Virus scanning** - Consider implementing for production
- **Content validation** - Verify file is actually an image

### Access Control
- **Public read access** - Anyone can view assets
- **Admin write access** - Only admins can upload/delete
- **JWT authentication** - Required for admin operations
- **Role-based authorization** - Admin role required

### Data Protection
- **Secure URLs** - Cloudinary provides HTTPS URLs
- **No sensitive data** - Only image URLs and metadata stored
- **Input validation** - All inputs validated and sanitized

## Rate Limiting
Currently no rate limiting implemented. Consider implementing rate limiting for production use, especially for file uploads.

## Performance Considerations

### Caching
- **CDN delivery** - Cloudinary provides global CDN
- **Image optimization** - Automatic format and quality optimization
- **Lazy loading** - Consider implementing for large asset lists

### Database Optimization
- **Indexed queries** - UUID and type fields indexed
- **Pagination** - Consider implementing for large datasets
- **Efficient queries** - Use specific endpoints for asset types

## Notes
- All asset IDs use UUID format
- Images are automatically optimized by Cloudinary
- Public endpoints are cached by CDN
- Admin operations require authentication and admin role
- File uploads are limited to 5MB and image types only
- Assets are organized in Cloudinary folders by type
