# StartHub

A NestJS GraphQL API with a waitlist feature built with Apollo Server.

## Prerequisites

- Node.js 22+
- npm
- Docker (optional)

## Getting Started

### Without Docker

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

### With Docker

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up --build -d

# Stop
docker compose down
```

The app will be available at `http://localhost:3000/graphql`.

## Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## GraphQL API

Open the playground at `http://localhost:3000/graphql` and try these queries:

### Add an email to the waitlist

```graphql
mutation {
  addToWaitlist(email: "john@example.com") {
    email
    position
    createdAt
  }
}
```

### Add a second email

```graphql
mutation {
  addToWaitlist(email: "jane@example.com") {
    email
    position
    createdAt
  }
}
```

### Check waitlist status

```graphql
query {
  waitlistStatus(email: "john@example.com") {
    email
    position
    totalEntries
    createdAt
  }
}
```

### Try a duplicate (will return an error)

```graphql
mutation {
  addToWaitlist(email: "john@example.com") {
    email
    position
    createdAt
  }
}
```

### Check status of unknown email (will return an error)

```graphql
query {
  waitlistStatus(email: "unknown@example.com") {
    email
    position
    totalEntries
    createdAt
  }
}
```

## Environment Variables

| Variable      | Default                 | Description                                                 |
| ------------- | ----------------------- | ----------------------------------------------------------- |
| `PORT`        | `3000`                  | Server port                                                 |
| `NODE_ENV`    | -                       | Set to `production` to enable helmet and disable playground |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin                                         |
