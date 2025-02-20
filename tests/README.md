# Testing Documentation

## Overview

The testing suite includes:
- Unit tests
- Integration tests
- End-to-end tests

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── utils/         # Utility function tests
│   ├── hooks/         # Custom hook tests
│   └── services/      # Service tests
├── integration/       # Integration tests
│   ├── components/    # Component tests
│   └── pages/         # Page tests
└── e2e/              # End-to-end tests
    ├── auth/          # Authentication flows
    ├── messaging/     # Messaging flows
    └── billing/       # Billing flows
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('utilityFunction', () => {
  it('should handle valid input', () => {
    // Test implementation
  });

  it('should handle invalid input', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', async () => {
    // Test implementation
  });
});
```

### E2E Tests

```typescript
describe('Authentication', () => {
  it('should allow user to sign up', () => {
    // Test implementation
  });

  it('should handle invalid credentials', () => {
    // Test implementation
  });
});
```

## Mocking

### API Mocks

```typescript
vi.mock('../lib/api', () => ({
  fetchData: vi.fn()
}));
```

### Component Mocks

```typescript
vi.mock('../components/Button', () => ({
  default: ({ children }) => <button>{children}</button>
}));
```

## Coverage

Aim for:
- 90% coverage for utilities
- 80% coverage for components
- 70% coverage for pages

## CI/CD Integration

Tests run on:
- Pull requests
- Main branch commits
- Release tags