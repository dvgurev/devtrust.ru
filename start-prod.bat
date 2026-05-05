@echo off
REM Start Production Environment with admin seed only
echo Starting DevTrust platform in PRODUCTION mode...

if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please edit .env with production values before continuing!
    pause
    exit /b 1
)

docker-compose up --build -d

echo.
echo DevTrust PROD is starting with admin seed only...
echo Web: http://localhost:3000
echo Admin: admin@devtrust.ru / admin123
echo MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
pause
