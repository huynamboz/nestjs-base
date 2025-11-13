#!/bin/sh
set -e

echo "🚀 Starting application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432} 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done
echo "✅ Database is ready!"

# Wait a bit more for database to be fully ready
sleep 2

# Run migrations
echo "📦 Running database migrations..."
npm run migration:run || echo "⚠️  Migration failed or no migrations to run"

# Seed roles if needed
echo "🌱 Seeding roles..."
npm run seed:roles || echo "⚠️  Role seeding failed or already exists"

# Seed admin if needed
echo "👤 Seeding admin user..."
npm run seed:admin || echo "⚠️  Admin seeding failed or already exists"

# Start the application
echo "🎉 Starting NestJS application..."
exec npm run start:prod

