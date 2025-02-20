# Configuration Documentation

## Environment Variables

Required variables:
```bash
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# OpenAI
VITE_OPENAI_API_KEY=

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Build Configuration

See [vite.config.ts](../vite.config.ts) for build configuration.

## Database Configuration

See [supabase/migrations](../supabase/migrations) for database schema.

## Testing Configuration

See [tests/README.md](../tests/README.md) for testing configuration.