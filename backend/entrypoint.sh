#!/bin/sh
set -e

echo "▶ Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "▶ Starting Signal Lab backend..."
exec node dist/main
