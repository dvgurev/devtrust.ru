FROM node:24-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

# Copy root package.json and pnpm-workspace.yaml
COPY package.json pnpm-workspace.yaml ./

# Copy apps/web
COPY apps/web/package.json apps/web/
# Copy packages/core if exists
COPY packages/core/package.json packages/core/ 2>/dev/null || true

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web/ apps/web/
COPY packages/core/ packages/core/ 2>/dev/null || true
COPY packages/ packages/ 2>/dev/null || true

# Generate Prisma client
RUN cd apps/web && npx prisma generate

# Build the app
RUN cd apps/web && pnpm build

# Production image
FROM node:24-alpine AS runner

WORKDIR /app

# Copy built assets
COPY --from=base /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/public /app/apps/web/public
COPY --from=base /app/apps/web/package.json /app/apps/web/
COPY --from=base /app/apps/web/node_modules /app/apps/web/node_modules
COPY --from=base /app/apps/web/next.config.ts /app/apps/web/
COPY --from=base /app/node_modules /app/node_modules

WORKDIR /app/apps/web

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]
