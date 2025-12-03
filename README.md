# TODO API - Production-Ready Node.js Backend

A complete RESTful Todo Management API built with Node.js, TypeScript, Express, Sequelize, and PostgreSQL.

## Features

- ✅ Complete CRUD operations for todos
- ✅ JWT Authentication with X-User-Id fallback
- ✅ Multi-user isolation (users only see their own todos)
- ✅ Advanced search (title and description)
- ✅ Pagination with metadata
- ✅ Sorting (createdAt, updatedAt, title)
- ✅ Filtering (status, date range)
- ✅ Soft delete (deletedAt column)
- ✅ Input validation using Joi
- ✅ Comprehensive error handling
- ✅ Winston logging
- ✅ Rate limiting
- ✅ Security middleware (Helmet, CORS)

## Tech Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **Validation**: Joi
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit

## Project Structure

```
TODO API/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts   # Sequelize connection
│   │   ├── database.js   # Sequelize CLI config
│   │   └── env.ts        # Environment variables
│   ├── models/          # Sequelize models
│   │   ├── User.ts
│   │   ├── Todo.ts
│   │   └── index.ts
│   ├── controllers/     # Request handlers
│   │   ├── TodoController.ts
│   │   └── AuthController.ts
│   ├── services/        # Business logic
│   │   ├── TodoService.ts
│   │   └── AuthService.ts
│   ├── middlewares/     # Express middlewares
│   │   └── auth.ts       # Authentication middleware
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── todo.routes.ts
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts
│   │   ├── errorHandler.ts
│   │   ├── jwt.ts
│   │   ├── response.ts
│   │   └── validation.ts
│   ├── database/        # Migrations and seeders
│   │   ├── migrations/
│   │   └── seeders/
│   └── server.ts        # Express app entry point
├── logs/                # Log files (auto-created)
├── .env                 # Environment variables (create from .env.example)
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js v18 or higher
- PostgreSQL (running via Docker Compose)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

Ensure your PostgreSQL database is running (via Docker Compose):

```bash
# If not already running, start the database
docker-compose up -d
```

Run migrations:

```bash
npm run migrate
```

Seed the database with sample data:

```bash
npm run seed
```

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Todos Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → users.id)
- `title` (String, Required)
- `description` (Text, Optional)
- `status` (Enum: 'pending' | 'completed')
- `deletedAt` (Timestamp, Nullable - for soft delete)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## Sample Data

The seeder creates:
- 3 demo users (user1@example.com, user2@example.com, user3@example.com)
- Password for all: `password123`
- 8 sample todos distributed across users

## Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'
```

**Create a todo (using X-User-Id header for testing):**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 550e8400-e29b-41d4-a716-446655440001" \
  -d '{
    "title": "My new todo",
    "description": "This is a test todo",
    "status": "pending"
  }'
```

**List todos with filters:**
```bash
curl -X GET "http://localhost:3000/api/todos?page=1&limit=10&status=pending&search=documentation" \
  -H "X-User-Id: 550e8400-e29b-41d4-a716-446655440001"
```

### Using Postman

Import the Postman collection (see `POSTMAN_COLLECTION.json` if provided) or manually create requests using the API documentation.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration
- `npm run seed` - Seed database with sample data
- `npm run seed:undo` - Remove seeded data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Authentication

The API supports two authentication methods:

1. **JWT Bearer Token** (Production):
   - Register/Login to get a token
   - Include `Authorization: Bearer <token>` header in requests

2. **X-User-Id Header** (Development/Testing):
   - If `JWT_SECRET` is not configured or uses default value, you can use `X-User-Id: <user-id>` header
   - Useful for testing without JWT setup

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": [] // Optional, for validation errors
  }
}
```

## Logging

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

Console logging is enabled in development mode.

## Security Features

- Helmet.js for security headers
- CORS enabled
- Rate limiting (100 requests per 15 minutes per IP)
- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- SQL injection protection (Sequelize ORM)

## Production Considerations

1. **Environment Variables**: Change `JWT_SECRET` to a strong, random secret
2. **Database**: Use connection pooling and proper credentials
3. **Logging**: Configure log rotation and monitoring
4. **Rate Limiting**: Adjust based on your needs
5. **HTTPS**: Use HTTPS in production
6. **Error Messages**: Disable stack traces in production (already handled)

## License

ISC

## Author

Generated for TODO API project

