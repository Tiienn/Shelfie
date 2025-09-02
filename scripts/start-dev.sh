#!/bin/bash

echo "🚀 Starting Shelfie Development Environment..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration values!"
    echo ""
else
    echo "✅ .env file found."
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo "Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

echo "Installing client dependencies..."
cd client && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
cd ..

echo "Installing server dependencies..."
cd server && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
cd ..

echo "Installing shared dependencies..."
cd shared && npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install shared dependencies"
    exit 1
fi
cd ..

# Start Docker services
echo ""
echo "🐳 Starting Docker services..."
echo "Make sure Docker Desktop is running!"
echo "Starting support services (PostgreSQL, Redis, RabbitMQ, MinIO)..."
docker-compose up -d postgres redis rabbitmq minio

# Wait for services
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Setup database
echo ""
echo "🗄️ Setting up database..."
cd server
npm run db:generate
npm run db:migrate
cd ..

# Start development servers
echo ""
echo "🎯 Starting development servers..."
echo "Client will be available at: http://localhost:3000"
echo "Server will be available at: http://localhost:3001"
echo "API Docs will be available at: http://localhost:3001/api/docs"
echo ""

npm run dev