# Photo Assets API Documentation

## Overview
Photo Assets API cung cấp các endpoint để quản lý frames, filters và stickers cho photoboth. API được chia thành 2 nhóm: Public (không cần auth) và Admin (cần auth + admin role).

**Base URL:** `http://localhost:3000/api/v1`

## Asset Types
- **`frame`** - Khung ảnh cho photoboth
- **`filter`** - Bộ lọc màu sắc (có thể có các properties bổ sung như `filterType`, `scale`, `offset_y`, v.v.)
- **`sticker`** - Sticker trang trí

## Filter Properties (Chỉ áp dụng cho type="filter")
Khi asset có `type="filter"`, có thể có các properties bổ sung sau:
- **`filterType`** (string, optional): Tên nhóm filter - `cute`, `cool`, hoặc `poetic`
- **`scale`** (number, optional): Giá trị scale (decimal, ví dụ: 2.5)
- **`offset_y`** (number, optional): Giá trị offset Y (decimal, ví dụ: -100)
- **`anchor_idx`** (number, optional): Anchor index (integer, ví dụ: 10)
- **`left_idx`** (number, optional): Left index (integer, ví dụ: 10)
- **`right_idx`** (number, optional): Right index (integer, ví dụ: 10)

## Public Endpoints (Không cần authentication)

### 1. Get All Assets (Paginated)
Lấy danh sách tất cả assets trong hệ thống với phân trang và filter.

**Endpoint:** `GET /api/v1/assets`

**Query Parameters:**
- `page` (optional, number): Page number (starts from 1, default: 1)
- `limit` (optional, number): Number of items per page (max 100, default: 10)
- `search` (optional, string): Search term for filtering assets (searches in imageUrl)
- `type` (optional, string): Filter by asset type - `frame`, `filter`, or `sticker`

**Example Requests:**
```
# Get all assets
GET /api/v1/assets?page=1&limit=10

# Get only filters
GET /api/v1/assets?page=1&limit=10&type=filter

# Search with type filter
GET /api/v1/assets?page=1&limit=10&type=filter&search=cool
```

**Response:**
```json
{
  "data": [
    {
      "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
      "imageUrl": "https://res.cloudinary.com/dtpqh6cau/image/upload/v1763213217/photoboth/filters/qwtppcnm9nkftfrdsrcv.jpg",
      "publicId": "qwtppcnm9nkftfrdsrcv",
      "type": "filter",
      "filterType": "cool",
      "scale": 2.5,
      "offset_y": -100,
      "anchor_idx": 10,
      "left_idx": 10,
      "right_idx": 10,
      "createdAt": "2025-11-15T06:26:59.604Z",
      "updatedAt": "2025-11-15T06:26:59.604Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
      "publicId": "photoboth/frames/frame1",
      "type": "frame",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Status Codes:**
- `200`: Success

### 2. Get Frames
Lấy danh sách tất cả frames với phân trang.

**Endpoint:** `GET /api/v1/assets/frames`

**Query Parameters:**
- `page` (optional, number): Page number (starts from 1, default: 1)
- `limit` (optional, number): Number of items per page (max 100, default: 10)
- `search` (optional, string): Search term for filtering frames

**Response:**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frames/frame1.png",
      "publicId": "photoboth/frames/frame1",
      "type": "frame",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Status Codes:**
- `200`: Success

### 3. Get Filters
Lấy danh sách tất cả filters với phân trang. Filters có thể có các properties bổ sung như `filterType`, `scale`, `offset_y`, v.v.

**Endpoint:** `GET /api/v1/assets/filters`

**Query Parameters:**
- `page` (optional, number): Page number (starts from 1, default: 1)
- `limit` (optional, number): Number of items per page (max 100, default: 10)
- `search` (optional, string): Search term for filtering filters

**Response:**
```json
{
  "data": [
    {
      "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
      "imageUrl": "https://res.cloudinary.com/dtpqh6cau/image/upload/v1763213217/photoboth/filters/qwtppcnm9nkftfrdsrcv.jpg",
      "publicId": "qwtppcnm9nkftfrdsrcv",
      "type": "filter",
      "filterType": "cool",
      "scale": 2.5,
      "offset_y": -100,
      "anchor_idx": 10,
      "left_idx": 10,
      "right_idx": 10,
      "createdAt": "2025-11-15T06:26:59.604Z",
      "updatedAt": "2025-11-15T06:26:59.604Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Filter Properties (chỉ áp dụng cho type="filter"):**
- `filterType` (string, optional): Tên nhóm filter - `cute`, `cool`, hoặc `poetic`
- `scale` (number, optional): Giá trị scale (decimal)
- `offset_y` (number, optional): Giá trị offset Y (decimal)
- `anchor_idx` (number, optional): Anchor index (integer)
- `left_idx` (number, optional): Left index (integer)
- `right_idx` (number, optional): Right index (integer)

**Status Codes:**
- `200`: Success

### 4. Get Stickers
Lấy danh sách tất cả stickers với phân trang.

**Endpoint:** `GET /api/v1/assets/stickers`

**Query Parameters:**
- `page` (optional, number): Page number (starts from 1, default: 1)
- `limit` (optional, number): Number of items per page (max 100, default: 10)
- `search` (optional, string): Search term for filtering stickers

**Response:**
```json
{
  "data": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/stickers/sticker1.png",
      "publicId": "photoboth/stickers/sticker1",
      "type": "sticker",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Status Codes:**
- `200`: Success

### 5. Get Asset by ID
Lấy thông tin chi tiết của một asset.

**Endpoint:** `GET /api/v1/assets/{id}`

**Path Parameters:**
- `id` (string, required): Asset UUID

**Response (Frame):**
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

**Response (Filter):**
```json
{
  "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
  "imageUrl": "https://res.cloudinary.com/dtpqh6cau/image/upload/v1763213217/photoboth/filters/qwtppcnm9nkftfrdsrcv.jpg",
  "publicId": "qwtppcnm9nkftfrdsrcv",
  "type": "filter",
  "filterType": "cool",
  "scale": 2.5,
  "offset_y": -100,
  "anchor_idx": 10,
  "left_idx": 10,
  "right_idx": 10,
  "createdAt": "2025-11-15T06:26:59.604Z",
  "updatedAt": "2025-11-15T06:26:59.604Z"
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
Lấy danh sách tất cả assets với phân trang và filter (admin view).

**Endpoint:** `GET /api/v1/admin/assets`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional, number): Page number (starts from 1, default: 1)
- `limit` (optional, number): Number of items per page (max 100, default: 10)
- `search` (optional, string): Search term for filtering assets
- `type` (optional, string): Filter by asset type - `frame`, `filter`, or `sticker`

**Response:**
```json
{
  "data": [
    {
      "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
      "imageUrl": "https://res.cloudinary.com/dtpqh6cau/image/upload/v1763213217/photoboth/filters/qwtppcnm9nkftfrdsrcv.jpg",
      "publicId": "qwtppcnm9nkftfrdsrcv",
      "type": "filter",
      "filterType": "cool",
      "scale": 2.5,
      "offset_y": -100,
      "anchor_idx": 10,
      "left_idx": 10,
      "right_idx": 10,
      "createdAt": "2025-11-15T06:26:59.604Z",
      "updatedAt": "2025-11-15T06:26:59.604Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
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
- `filterType` (string, optional): Filter type - chỉ áp dụng khi type=filter (cute/cool/poetic)
- `scale` (number, optional): Scale value - chỉ áp dụng khi type=filter
- `offset_y` (number, optional): Offset Y value - chỉ áp dụng khi type=filter
- `anchor_idx` (number, optional): Anchor index - chỉ áp dụng khi type=filter
- `left_idx` (number, optional): Left index - chỉ áp dụng khi type=filter
- `right_idx` (number, optional): Right index - chỉ áp dụng khi type=filter

**File Validation:**
- **Max size:** 5MB
- **Allowed types:** image/jpeg, image/jpg, image/png, image/gif, image/webp

**Response (Frame):**
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

**Response (Filter with properties):**
```json
{
  "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
  "imageUrl": "https://res.cloudinary.com/dtpqh6cau/image/upload/v1763213217/photoboth/filters/qwtppcnm9nkftfrdsrcv.jpg",
  "publicId": "qwtppcnm9nkftfrdsrcv",
  "type": "filter",
  "filterType": "cool",
  "scale": 2.5,
  "offset_y": -100,
  "anchor_idx": 10,
  "left_idx": 10,
  "right_idx": 10,
  "createdAt": "2025-11-15T06:26:59.604Z",
  "updatedAt": "2025-11-15T06:26:59.604Z"
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
  "type": "filter",
  "filterType": "cool",
  "scale": 2.5,
  "offset_y": -100,
  "anchor_idx": 10,
  "left_idx": 10,
  "right_idx": 10
}
```

**Validation Rules:**
- `type`: Required, must be one of: frame, filter, sticker
- `filterType`: Optional, must be one of: cute, cool, poetic (only for filter type)
- `scale`: Optional, number (only for filter type)
- `offset_y`: Optional, number (only for filter type)
- `anchor_idx`: Optional, number (only for filter type)
- `left_idx`: Optional, number (only for filter type)
- `right_idx`: Optional, number (only for filter type)

**Response (Filter with properties):**
```json
{
  "id": "2bb7c789-de1a-467e-8d14-4f36f3343828",
  "imageUrl": "https://example.com/filter.jpg",
  "publicId": null,
  "type": "filter",
  "filterType": "cool",
  "scale": 2.5,
  "offset_y": -100,
  "anchor_idx": 10,
  "left_idx": 10,
  "right_idx": 10,
  "createdAt": "2025-11-15T06:26:59.604Z",
  "updatedAt": "2025-11-15T06:26:59.604Z"
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
  filterType?: string;  // Filter type: cute, cool, or poetic (only for filter type)
  scale?: number;       // Scale value (only for filter type)
  offset_y?: number;   // Offset Y value (only for filter type)
  anchor_idx?: number;  // Anchor index (only for filter type)
  left_idx?: number;    // Left index (only for filter type)
  right_idx?: number;  // Right index (only for filter type)
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

**Get all assets with pagination:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets?page=1&limit=10"
```

**Get assets filtered by type:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets?page=1&limit=10&type=filter"
```

**Get assets with search and type filter:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets?page=1&limit=10&type=filter&search=cool"
```

**Get frames only:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets/frames?page=1&limit=10"
```

**Get filters only:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets/filters?page=1&limit=10"
```

**Get stickers only:**
```bash
curl -X GET "http://localhost:3000/api/v1/assets/stickers?page=1&limit=10"
```

**Get asset by ID:**
```bash
curl -X GET http://localhost:3000/api/v1/assets/123e4567-e89b-12d3-a456-426614174000
```

### Admin Endpoints

**Get all assets (admin):**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/assets?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get assets filtered by type (admin):**
```bash
curl -X GET "http://localhost:3000/api/v1/admin/assets?page=1&limit=10&type=filter" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Upload asset file (frame):**
```bash
curl -X POST http://localhost:3000/api/v1/admin/assets/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@frame1.png" \
  -F "type=frame"
```

**Upload filter asset with properties:**
```bash
curl -X POST http://localhost:3000/api/v1/admin/assets/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@filter1.jpg" \
  -F "type=filter" \
  -F "filterType=cool" \
  -F "scale=2.5" \
  -F "offset_y=-100" \
  -F "anchor_idx=10" \
  -F "left_idx=10" \
  -F "right_idx=10"
```

**Create asset with URL (filter with properties):**
```bash
curl -X POST http://localhost:3000/api/v1/admin/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "filter",
    "filterType": "cool",
    "scale": 2.5,
    "offset_y": -100,
    "anchor_idx": 10,
    "left_idx": 10,
    "right_idx": 10
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
