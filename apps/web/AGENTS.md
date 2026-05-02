# DevTrust Platform

Мультитенантная платформа-магазин бизнес-приложений с подписками.

## Tech Stack
- Next.js 16 (App Router)
- PostgreSQL + Prisma
- NextAuth 5 (JWT sessions)
- Stripe (payments)
- Upstash Redis (rate limiting)
- Tailwind CSS

## Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build for production
pnpm build

# Typecheck
pnpm typecheck

# Lint
pnpm lint
```

## Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe keys
- `RESEND_API_KEY` — Email delivery (optional)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — Rate limiting

## Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## Deployment (Vercel)

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy from `apps/web` directory

```bash
cd apps/web
vercel --prod
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Home page |
| `/catalog` | App catalog |
| `/apps/[slug]` | App details |
| `/blog` | Blog |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | User dashboard |
| `/admin` | Admin panel |

## Internal API

Platform apps use these endpoints:

- `POST /api/internal/check-access` — Check subscription
- `GET /api/internal/me` — Current user
- `GET /api/internal/organization` — Current org
- `POST /api/internal/usage` — Send usage metrics

## Available MCP Tools

- **magic** (21st.dev) — генерация UI компонентов через natural language. Используй для создания красивых компонентов (hero-секции, карточки, навигация, формы) в стиле 21st.dev.

## Adding New App

1. Create app in admin panel (`/admin/apps`)
2. Add plans with pricing
3. Create subdomain app in `apps/` if needed
4. Use `@platform/core` for access checks:

```typescript
import { checkAccess, sendUsage } from "@platform/core"

const { allowed } = await checkAccess("app-slug")
if (!allowed) redirect("/catalog")

await sendUsage("app-slug", { visits: 1 })
```

## External Apps (Separate Servers)

Apps can be hosted on separate servers and connected via SSO.

### Creating External App (Admin)

Use the API to create external apps:

```bash
POST /api/admin/external-apps
{
  "name": "My CRM",
  "slug": "my-crm",
  "externalUrl": "https://crm.example.com",
  "allowedDomains": ["crm.example.com"]
}
```

### SSO Authentication Flow

1. User opens external app: `https://crm.example.com`
2. App checks for `?token=xxx` in URL
3. If no token, app redirects to SSO login:
   ```
   https://devtrust.ru/sso/login?app=my-crm&redirect=https://crm.example.com
   ```
4. User logs in on platform
5. Platform creates SSO token and redirects back with token
6. App verifies token via `POST /api/sso/verify` with token

### App Template

Use `packages/app-template` as a starting point:

```bash
cp -r packages/app-template products/my-app
cd products/my-app
# Rename to @platform/my-app in package.json
# Configure PLATFORM_URL in .env.local
```

### Required Environment Variables

In external app `.env.local`:
```env
PLATFORM_URL=https://devtrust.ru
NEXT_PUBLIC_APP_ID=app-id-from-admin
```