# AnnonsHjälpen - Professional SaaS Platform

## 🏗️ Architecture Overview

This is a professional monorepo structure for AnnonsHjälpen, a SaaS platform helping craftsmen create effective advertisements.

### 📁 Project Structure

```
annonshjälpen/
├── apps/
│   ├── web/           # Landing page (Next.js)
│   ├── dashboard/     # SaaS Dashboard (React + Vite)
│   └── admin/         # Admin panel
├── packages/
│   ├── ui/           # Shared UI components
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Shared utilities
│   └── config/       # Configuration packages
├── services/
│   ├── api/          # Backend API (Node.js + Express)
│   ├── auth/         # Authentication service
│   └── integrations/ # External API integrations
└── infrastructure/
    ├── database/     # Database schema & migrations
    ├── docker/       # Docker configurations
    └── deployment/   # CI/CD configurations
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - Landing page with SSG/SSR
- **React 18** - Dashboard SPA with Vite
- **TypeScript** - Type safety across all apps
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management

### Backend
- **Node.js + Express** - REST API
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Zod** - Runtime type validation

### DevOps & Tooling
- **pnpm** - Efficient package manager for monorepos
- **ESLint + Prettier** - Code quality & formatting
- **Husky** - Git hooks for quality gates
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL (for local development)

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```

3. **Start development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individual services
   pnpm --filter @annonshjälpen/web dev
   pnpm --filter @annonshjälpen/dashboard dev
   pnpm --filter @annonshjälpen/api dev
   ```

## 📦 Package Management

This monorepo uses **pnpm workspaces** for efficient package management:

- **Shared dependencies** are hoisted to the root
- **Internal packages** use `workspace:*` protocol
- **Type safety** across all packages with shared types

### Common Commands

```bash
# Install dependency to specific workspace
pnpm --filter @annonshjälpen/web add react-query

# Run command in all workspaces
pnpm --recursive build

# Run command in parallel
pnpm --parallel --recursive dev

# Add dev dependency to root
pnpm add -D -w prettier
```

## 🏛️ Architecture Principles

### 1. **Separation of Concerns**
- Each app has a single responsibility
- Shared logic extracted to packages
- Clear boundaries between layers

### 2. **Type Safety**
- TypeScript everywhere
- Shared types package
- Runtime validation with Zod

### 3. **Scalability**
- Modular architecture
- Independent deployments
- Micro-frontend ready

### 4. **Developer Experience**
- Fast development setup
- Consistent tooling
- Comprehensive linting

## 🔧 Development Workflow

### Adding New Features

1. **Types First** - Define types in `packages/types`
2. **UI Components** - Create reusable components in `packages/ui`
3. **API Endpoints** - Add to `services/api`
4. **Frontend Integration** - Implement in respective apps

### Code Quality

- **Pre-commit hooks** run linting and type checking
- **CI pipeline** runs tests and builds
- **Type checking** across all packages
- **Consistent formatting** with Prettier

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run tests across all packages |
| `pnpm lint` | Lint all code |
| `pnpm type-check` | Type check all TypeScript |
| `pnpm format` | Format all code with Prettier |

## 🎯 Next Steps

1. **Authentication System** - JWT-based auth with refresh tokens
2. **Database Setup** - Prisma schema and migrations
3. **UI Component Library** - Complete Tailwind component system
4. **API Development** - REST endpoints for core features
5. **Dashboard Implementation** - React-based SaaS dashboard
6. **External Integrations** - Facebook, Google, Instagram APIs

## 📞 Support

For questions about the architecture or development process, check the inline documentation or reach out to the development team.