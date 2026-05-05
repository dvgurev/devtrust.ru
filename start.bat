@echo off
REM One-command startup script for DevTrust platform

echo Starting DevTrust platform...

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please edit .env and set proper values for production!
)

REM Build and start all services
docker-compose up --build -d

echo.
echo DevTrust platform is starting...
echo Web: http://localhost:3000
echo MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
echo PostgreSQL: localhost:5432
echo Redis: localhost:6379
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
pause
