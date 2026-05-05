#!/bin/bash
# Start Production Environment with admin seed only

echo "Starting DevTrust platform in PRODUCTION mode..."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "Please edit .env with production values before continuing!"
    exit 1
fi

docker-compose up --build -d

echo ""
echo "DevTrust PROD is starting with admin seed only..."
echo "Web: http://localhost:3000"
echo "Admin: admin@devtrust.ru / admin123"
echo "MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
