#!/bin/bash
# Start Development Environment with full seeds

echo "Starting DevTrust platform in DEVELOPMENT mode..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

docker-compose -f docker-compose.dev.yml up --build -d

echo ""
echo "DevTrust DEV is starting with full seed data..."
echo "Web: http://localhost:3000"
echo "Admin: admin@devtrust.ru / admin123"
echo "Test user: test@test.ru / user1234"
echo "MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "To stop: docker-compose -f docker-compose.dev.yml down"
