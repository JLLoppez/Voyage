# Voyage — Private Transfer Platform

> Book private transfers in 150+ countries. Real drivers compete. You pick the best offer.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL via [Neon](https://neon.tech) + Prisma ORM
- **Auth**: Server-side sessions with `httpOnly` cookies + bcrypt
- **Styling**: Pure CSS with design tokens (no Tailwind)
- **Validation**: Zod (shared client + server)
- **Testing**: Vitest + React Testing Library
- **CI**: GitHub Actions

---

## Getting started

### 1. Clone & install
```bash
git clone https://github.com/yourorg/voyage.git
cd voyage
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
```

| Variable              | Description                                           |
|-----------------------|-------------------------------------------------------|
| `DATABASE_URL`        | PostgreSQL connection string (Neon recommended)       |
| `SESSION_SECRET`      | Random string ≥ 32 chars (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (`http://localhost:3000` for dev)        |

### 3. Database
```bash
npm run db:push   # Apply schema
npm run db:seed   # Seed admin + demo data
```

### 4. Run
```bash
npm run dev
```

---

## Admin panel

Visit `/admin` — redirects to `/admin/login`.

**Demo credentials** (seeded):
- Email: `admin@voyage.com`
- Password: `admin123`

---

## Scripts

| Script              | Description                                   |
|---------------------|-----------------------------------------------|
| `npm run dev`       | Development server                            |
| `npm run build`     | Production build (includes `prisma generate`) |
| `npm run typecheck` | TypeScript check (no emit)                    |
| `npm run lint`      | ESLint                                        |
| `npm test`          | Run all tests (Vitest)                        |
| `npm run db:push`   | Push Prisma schema to DB                      |
| `npm run db:seed`   | Seed demo data                                |
| `npm run db:studio` | Open Prisma Studio                            |

---

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables from `.env.example`
4. Vercel auto-detects Next.js — deploy

> Use Neon for serverless-compatible PostgreSQL. `DATABASE_URL` must include `?sslmode=require`.

---

## Project structure

```
voyage/
├── app/
│   ├── api/                   # Route Handlers (auth, bookings, admin)
│   ├── admin/                 # Admin panel (own layout, login, dashboard)
│   ├── login/ signup/         # Auth pages
│   ├── results/ driver/       # Core booking flow
│   └── globals.css / admin.css
├── components/                # Shared UI components
├── lib/
│   ├── db.ts                  # Prisma singleton
│   ├── auth.ts                # Session management
│   ├── env.ts                 # Validated env vars (Zod)
│   ├── rateLimit.ts           # Sliding window rate limiter
│   ├── validations.ts         # Zod schemas (shared)
│   ├── apiResponse.ts         # Consistent JSON helpers
│   └── utils.ts               # Shared utilities
├── prisma/
│   ├── schema.prisma          # DB schema
│   └── seed.ts                # Demo data seed
├── __tests__/                 # Vitest tests
├── middleware.ts              # Auth guards + security headers
└── .github/workflows/ci.yml   # TypeScript + lint + test + build
```
