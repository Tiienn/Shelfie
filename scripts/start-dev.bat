@echo off
echo Starting Shelfie Development Environment...
echo.

echo Step 1: Checking environment file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your configuration values!
    echo.
) else (
    echo .env file found.
)

echo Step 2: Installing dependencies...
echo Installing root dependencies...
npm install
if errorlevel 1 (
    echo Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing client dependencies...
cd client
npm install
if errorlevel 1 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo Installing server dependencies...
cd server
npm install
if errorlevel 1 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

echo Installing shared dependencies...
cd shared
npm install
if errorlevel 1 (
    echo Failed to install shared dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Starting Docker services...
echo Please make sure Docker Desktop is running!
echo Starting support services (PostgreSQL, Redis, RabbitMQ, MinIO)...
docker-compose up -d postgres redis rabbitmq minio

echo.
echo Step 4: Waiting for services to be ready...
timeout /t 10

echo.
echo Step 5: Setting up database...
cd server
npm run db:generate
npm run db:migrate
cd ..

echo.
echo Step 6: Starting development servers...
echo Starting both client and server...
npm run dev

pause