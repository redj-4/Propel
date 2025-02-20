# API Documentation

## Authentication

### Endpoints

```typescript
POST /auth/signup
POST /auth/signin
POST /auth/signout
POST /auth/reset-password
```

### Error Codes

```typescript
AUTH_001: "Invalid credentials"
AUTH_002: "Email already registered"
AUTH_003: "Password reset required"
```

## Messages

### Endpoints

```typescript
POST /messages/generate
GET /messages/list
PUT /messages/star
DELETE /messages/{id}
```

### Types

```typescript
interface Message {
  id: string;
  content: string;
  type: 'email' | 'cover-letter' | 'linkedin';
  created_at: string;
  is_starred: boolean;
}
```

## Subscriptions

### Endpoints

```typescript
POST /subscriptions/create
GET /subscriptions/status
POST /subscriptions/cancel
GET /subscriptions/portal
```

### Webhooks

```typescript
POST /webhooks/stripe
```

## Database Schema

See [Database Types](../../src/lib/database.types.ts) for complete schema information.

## Error Handling

All API errors follow this format:

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Rate Limiting

- 100 requests per minute per user
- 5 message generations per day for free tier
- Unlimited for pro tier

## Security

- All endpoints require authentication
- CORS enabled for frontend origin
- Rate limiting per user
- Input validation
- SQL injection protection