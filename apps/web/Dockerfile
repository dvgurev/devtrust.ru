FROM node:24-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

# Copy root config files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files first for proper dependency resolution
COPY apps/web/package.json apps/web/
COPY packages/core/package.json packages/core/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web apps/web
COPY packages/core packages/core
COPY packages packages

# Generate Prisma client and build
RUN cd apps/web && npx prisma generate && pnpm build

# Production image
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only necessary files for production
COPY --from=base /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/public /app/apps/web/public
COPY --from=base /app/apps/web/package.json /app/apps/web/
COPY --from=base /app/apps/web/next.config.ts /app/apps/web/
COPY --from=base /app/apps/web/prisma /app/apps/web/prisma
COPY --from=base /app/apps/web/node_modules/.prisma /app/apps/web/node_modules/.prisma

# Copy pnpm workspace dependencies
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/apps/web/node_modules /app/apps/web/node_modules

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed-prod.ts && pnpm start"]
