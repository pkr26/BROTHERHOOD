# Brotherhood Platform - Clean Architecture

## Tech Stack
- **Frontend**: Next.js 14 (App Router, Server Components, TypeScript)
- **Backend**: FastAPI (Python, async, type-safe)
- **Database**: PostgreSQL (production) / SQLite (development)
- **Auth**: JWT with refresh tokens
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand (lightweight state management)

## Project Structure

```
BROTHERHOOD/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   └── public/             # Static assets
│
├── backend/                 # FastAPI application
│   ├── api/                # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management
│   │   └── posts/         # Posts/content endpoints
│   ├── core/              # Core functionality
│   │   ├── config.py      # Configuration
│   │   ├── security.py    # Security utilities
│   │   └── database.py    # Database setup
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   └── services/          # Business logic
│
└── shared/                 # Shared types/constants
    └── types/             # TypeScript types

## Design Principles
1. **Clean Code**: Single responsibility, DRY
2. **Type Safety**: TypeScript + Pydantic
3. **Modern UI**: Minimal, accessible, responsive
4. **Performance**: Optimized loading, caching
5. **Security**: HTTPS, JWT, input validation
```