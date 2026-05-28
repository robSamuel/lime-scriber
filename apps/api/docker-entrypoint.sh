#!/bin/sh
set -e

echo "Waiting for database..."
until pg_isready -h postgres -U scribe -d scribe > /dev/null 2>&1; do
  sleep 1
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting API..."
exec npx tsx src/index.ts
