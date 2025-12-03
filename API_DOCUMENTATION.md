# TODO API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

The API supports two authentication methods:

1. **JWT Bearer Token** (Production): Include `Authorization: Bearer <token>` header
2. **X-User-Id Header** (Development/Testing): Include `X-User-Id: <user-id>` header (fallback when JWT_SECRET is not configured)

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Todo Endpoints

### Create Todo
**POST** `/todos`

**Headers:**
- `Authorization: Bearer <token>` OR `X-User-Id: <user-id>`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending" // optional, defaults to "pending"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Todo by ID
**GET** `/todos/:id`

**Headers:**
- `Authorization: Bearer <token>` OR `X-User-Id: <user-id>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### List Todos (with Search, Pagination, Filtering, Sorting)
**GET** `/todos`

**Headers:**
- `Authorization: Bearer <token>` OR `X-User-Id: <user-id>`

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `search` (string, optional) - Search in title and description
- `status` (string, optional) - Filter by status: `pending` or `completed`
- `sortBy` (string, default: `createdAt`) - Sort field: `createdAt`, `updatedAt`, `title`
- `sortOrder` (string, default: `DESC`) - Sort order: `ASC` or `DESC`
- `startDate` (ISO date string, optional) - Filter todos created after this date
- `endDate` (ISO date string, optional) - Filter todos created before this date

**Example Request:**
```
GET /todos?page=1&limit=10&search=documentation&status=pending&sortBy=createdAt&sortOrder=DESC&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalCount": 25,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Update Todo
**PUT** `/todos/:id`

**Headers:**
- `Authorization: Bearer <token>` OR `X-User-Id: <user-id>`

**Request Body:**
```json
{
  "title": "Updated title", // optional
  "description": "Updated description", // optional
  "status": "completed" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Updated title",
    "description": "Updated description",
    "status": "completed",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### Delete Todo (Soft Delete)
**DELETE** `/todos/:id`

**Headers:**
- `Authorization: Bearer <token>` OR `X-User-Id: <user-id>`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Todo deleted successfully"
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "message": "Validation error",
    "details": [
      {
        "field": "title",
        "message": "\"title\" is required"
      }
    ]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "message": "Authentication required. Provide X-User-Id header or configure JWT_SECRET."
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "message": "Todo not found"
  }
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error"
  }
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

---

## Multi-User Isolation

All todo operations are automatically scoped to the authenticated user. Users can only:
- View their own todos
- Create todos for themselves
- Update/delete their own todos

The `userId` is automatically extracted from the JWT token or `X-User-Id` header and used to filter all queries.

---

## Rate Limiting

The API implements rate limiting:
- **Window**: 15 minutes (900000 ms)
- **Max Requests**: 100 requests per window per IP

Rate limit exceeded response:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

