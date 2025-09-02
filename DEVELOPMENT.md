# 🛠️ Development Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
2. **Docker Desktop** - [Download from docker.com](https://www.docker.com/products/docker-desktop/)
3. **Git** - [Download from git-scm.com](https://git-scm.com/)

## Quick Start

### Option 1: Using the Setup Script (Recommended)

**Windows:**
```bash
# Start Docker Desktop first, then run:
scripts/start-dev.bat
```

**Linux/macOS:**
```bash
# Start Docker Desktop first, then run:
./scripts/start-dev.sh
```

### Option 2: Manual Setup

1. **Start Docker Desktop** (make sure it's running)

2. **Install Dependencies:**
```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
cd shared && npm install && cd ..
```

3. **Setup Environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Services:**
```bash
docker-compose up -d postgres redis rabbitmq minio
```

5. **Setup Database:**
```bash
cd server
npm run db:generate
npm run db:migrate
cd ..
```

6. **Start Development:**
```bash
npm run dev
```

## 🌐 Service URLs

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database**: localhost:5432 (PostgreSQL)
- **Redis**: localhost:6379
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin123)

## 🔧 Environment Configuration

Edit your `.env` file with the following minimal configuration for development:

```env
# Basic Development Configuration
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000

# Database (matches docker-compose.yml)
DATABASE_URL=postgresql://shelfie:shelfie123@localhost:5432/shelfiedb
REDIS_URL=redis://localhost:6379

# Security (change these in production!)
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret
SESSION_SECRET=dev-session-secret
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# MinIO (for local file storage)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_BUCKET_NAME=shelfie-receipts

# Optional: Add API keys for full functionality
# CLAUDE_API_KEY=your-anthropic-api-key
# SPOONACULAR_API_KEY=your-spoonacular-key
# AWS_ACCESS_KEY_ID=your-aws-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run client tests
npm run test:client

# Run server tests
npm run test:server

# Run with coverage
npm run test:coverage

# Run E2E tests (requires app to be running)
cd client && npm run test:e2e
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose build

# Reset database
docker-compose down -v
docker-compose up -d postgres
cd server && npm run db:migrate
```

## 🔍 Debugging

### Client Debugging
- React Developer Tools
- Redux DevTools
- Chrome DevTools PWA tab for service workers

### Server Debugging
- VS Code Node.js debugger
- Logs available in console
- Database queries via Prisma Studio: `cd server && npm run db:studio`

### Common Issues

1. **Port already in use**: Check if services are already running
2. **Database connection failed**: Ensure PostgreSQL container is running
3. **Module not found**: Run `npm install` in the respective directory
4. **Docker permission denied**: Ensure Docker Desktop is running

## 📚 Development Workflow

1. **Feature Development**: Create feature branches from `develop`
2. **Code Quality**: Run `npm run lint` and `npm run typecheck`
3. **Testing**: Ensure tests pass with `npm test`
4. **Commits**: Use conventional commit format
5. **Pull Requests**: Target `develop` branch

## 🚀 Production Build

```bash
# Build all packages
npm run build

# Test production build locally
docker-compose -f docker-compose.prod.yml up

# Deploy (requires proper configuration)
npm run deploy
```

## 📞 Need Help?

- Check the [main README.md](./README.md) for project overview
- Review [Technical Architecture](./TECHNICAL-ARCHITECTURE.md) for system design
- Check [Task Manager](./TASKMANAGER.md) for development roadmap
- Create an issue on GitHub for bugs or questions