# Propel - AI Career Assistant

Propel is an AI-powered career assistant that helps students and recent graduates craft compelling professional messages, optimize their applications, and connect with industry professionals.

## Project Structure

```
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── chat/          # Chat interface components
│   │   ├── common/        # Shared/reusable components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout components
│   │   ├── subscription/  # Subscription/billing components
│   │   └── ui/            # UI primitives
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Core library code
│   │   ├── constants/     # Constants and enums
│   │   ├── services/      # Service layer
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── pages/             # Page components
│   └── styles/            # Global styles
├── public/                 # Static assets
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/             # End-to-end tests
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── architecture/     # Architecture docs
│   └── guides/          # User guides
├── config/               # Configuration files
├── scripts/             # Build/deployment scripts
└── supabase/            # Supabase configuration
    ├── functions/       # Edge functions
    └── migrations/      # Database migrations
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in the required values in `.env`

3. Start development server:
   ```bash
   npm run dev
   ```

## Technology Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- Backend:
  - Supabase
  - Edge Functions
  - PostgreSQL

- Authentication:
  - Supabase Auth

- Payments:
  - Stripe

## Development Standards

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Use meaningful variable/function names

### Component Structure

- One component per file
- Use proper file naming:
  - Components: PascalCase (e.g., `Button.tsx`)
  - Utilities: camelCase (e.g., `formatDate.ts`)
  - Constants: SCREAMING_SNAKE_CASE
- Group related components in feature folders
- Keep components focused and maintainable

### State Management

- Use React Context for global state
- Use hooks for component state
- Implement proper data fetching patterns
- Handle loading and error states

### Testing

- Write unit tests for utilities
- Write integration tests for components
- Write E2E tests for critical paths
- Maintain good test coverage

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

Copyright © 2025 Propel. All rights reserved.