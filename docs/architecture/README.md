# Architecture Documentation

## Overview

Propel is built using a modern web architecture with the following key components:

1. Frontend (React + TypeScript)
2. Backend (Supabase)
3. Authentication (Supabase Auth)
4. Database (PostgreSQL)
5. Payments (Stripe)

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Supabase Edge  │────▶│   PostgreSQL   │
│                 │     │    Functions    │     │    Database    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                       │
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Supabase Auth  │     │     Stripe      │     │    OpenAI API   │
│                 │     │    Payments     │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Components

### Frontend

- React for UI components
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for routing
- React Context for state management
- Custom hooks for business logic

### Backend

- Supabase for backend services
- Edge Functions for serverless compute
- Row Level Security for data protection
- Real-time subscriptions
- PostgreSQL for data storage

### Authentication

- Supabase Auth
- JWT tokens
- Row Level Security policies
- User sessions

### Payments

- Stripe integration
- Subscription management
- Usage tracking
- Billing portal

## Data Flow

1. User Authentication:
   ```
   Client ──▶ Supabase Auth ──▶ JWT Token ──▶ Protected Resources
   ```

2. Message Generation:
   ```
   Client ──▶ Edge Function ──▶ OpenAI API ──▶ Response ──▶ Database
   ```

3. Subscription Management:
   ```
   Client ──▶ Stripe Checkout ──▶ Webhook ──▶ Database Update
   ```

## Security

1. Authentication:
   - JWT-based authentication
   - Secure session management
   - PKCE flow for OAuth

2. Authorization:
   - Row Level Security
   - Role-based access control
   - Policy-based permissions

3. Data Protection:
   - Encrypted data at rest
   - Secure communication (HTTPS)
   - Input validation

## Performance

1. Optimizations:
   - Code splitting
   - Lazy loading
   - Asset optimization
   - Caching strategies

2. Monitoring:
   - Error tracking
   - Performance metrics
   - Usage analytics

## Scalability

1. Database:
   - Connection pooling
   - Efficient indexing
   - Query optimization

2. Edge Functions:
   - Serverless architecture
   - Auto-scaling
   - Global distribution

3. Frontend:
   - CDN distribution
   - Progressive enhancement
   - Responsive design