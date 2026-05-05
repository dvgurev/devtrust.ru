#!/bin/sh
set -e

echo "Running Prisma DB push..."
cd /app/apps/web
pnpm exec prisma db push --accept-data-loss

echo "Running seed..."
pnpm exec prisma db seed

echo "Starting dev server..."
pnpm dev
