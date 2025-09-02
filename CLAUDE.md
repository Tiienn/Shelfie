# CLAUDE.md

## 🥘 Shelfie - Smart Pantry Management for Busy Families

**Repository**: [https://github.com/Tiienn/Shelfie](https://github.com/Tiienn/Shelfie)  
**Project Type**: Progressive Web Application (PWA)  
**Status**: Development Phase - Sprint 1/6  
**Target Launch**: December 4, 2025  

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Development Status](#development-status)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

Shelfie is a comprehensive pantry and grocery management app designed to help busy mothers efficiently manage household food inventory through intelligent automation and smart features.

### 🎯 Core Value Propositions
- **Save Time**: Eliminate manual tracking with receipt scanning
- **Reduce Waste**: Track expiration dates with smart notifications
- **Simplify Planning**: AI-powered recipe suggestions
- **Save Money**: Minimize duplicate purchases and food waste

### 📊 Success Metrics
- User retention: >70% after 3 months
- Time saved: 2+ hours per week
- Food waste reduction: 30% in first month
- User satisfaction (NPS): >40

## Quick Start

### Prerequisites
```bash
# Required software
Node.js 18+ 
Docker & Docker Compose
PostgreSQL 15
Redis 7
Git
```

### 🚀 Local Development Setup

```bash
# Clone the Shelfie repository
git clone https://github.com/Tiienn/Shelfie.git
cd Shelfie

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start Docker services
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev

# Access the app
# Frontend: http://localhost:3000
# API: http://localhost:3001
# Docs: http://localhost:3001/api/docs
```

### 🔐 Environment Configuration
```env
# Database
DATABASE_URL=postgresql://shelfie:shelfie123@localhost:5432/shelfiedb
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
SESSION_SECRET=your-session-secret

# AWS Services (for OCR)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=shelfie-receipts

# AI Services
CLAUDE_API_KEY=your-anthropic-api-key
OPENAI_API_KEY=your-openai-api-key (optional)
SPOONACULAR_API_KEY=your-spoonacular-key

# Push Notifications
FCM_SERVER_KEY=your-firebase-server-key

# Email Service
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@shelfie.app

# Environment
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000
```

## Architecture

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  ┌─────────────┐ ┌──────────┐ ┌──────────────┐    │
│  │     PWA     │ │  Service │ │   IndexedDB   │    │
│  │   (React)   │ │  Worker  │ │ (Offline DB)  │    │
│  └─────────────┘ └──────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                    API Gateway                       │
│         (Express + Rate Limiting + Auth)             │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                  Microservices                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Inventory │ │   OCR    │ │  Recipe  │           │
│  │ Service  │ │ Service  │ │ Service  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   Auth   │ │   Sync   │ │  Notify  │           │
│  │ Service  │ │ Service  │ │ Service  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                   Data Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │PostgreSQL│ │  Redis   │ │    S3    │           │
│  │   (DB)   │ │ (Cache)  │ │ (Files)  │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

### 🔑 Key Design Principles
1. **Offline-First**: Full functionality without internet
2. **Mobile-First**: Optimized for smartphones
3. **Microservices**: Independently scalable services
4. **Event-Driven**: Asynchronous message queues
5. **Security-First**: End-to-end encryption, OWASP compliance

## Development Status

### 📅 Current Sprint (Sprint 1/6)
**Duration**: Sep 11-24, 2025  
**Goal**: Foundation & Authentication

#### Sprint 1 Tasks
- [x] Project setup & repository
- [x] Development environment
- [ ] Database schema design
- [ ] API framework setup
- [ ] Authentication service
- [ ] Basic UI shell
- [ ] Docker configuration
- [ ] CI/CD pipeline

### 🗓️ Upcoming Sprints
| Sprint | Dates | Focus |
|--------|-------|-------|
| Sprint 2 | Sep 25 - Oct 8 | Core CRUD & PWA |
| Sprint 3 | Oct 9 - Oct 22 | Receipt Scanning |
| Sprint 4 | Oct 23 - Nov 5 | AI & Recipes |
| Sprint 5 | Nov 6 - Nov 19 | Sync & Real-time |
| Sprint 6 | Nov 20 - Dec 3 | Polish & Launch |
| **Beta Launch** | **Dec 4, 2025** | **🚀 Release** |

### 📈 Progress Metrics
- **Overall Progress**: 15% complete
- **Stories Completed**: 3/48
- **Test Coverage**: 0% (target: 80%)
- **Team Velocity**: Establishing baseline

## Features

### ✅ Phase 1 - MVP Features

#### 📦 Smart Pantry Management
- Add items manually or via barcode scan
- Track quantities and expiration dates
- Categorize by location (pantry, fridge, freezer)
- Smart expiry notifications

#### 📸 Receipt Scanning
- Take photo or upload receipt
- OCR text extraction (<5 seconds)
- Auto-categorize items
- Price tracking

#### 🤖 AI Recipe Suggestions
- Based on available ingredients
- Dietary preference filters
- Nutrition information
- Save favorites

#### 📝 Smart Grocery Lists
- Auto-generate from low stock
- Share with family
- Check off while shopping
- Store layout organization

#### 📱 Offline-First PWA
- Works without internet
- Background sync
- Push notifications
- Install on any device

### 🚀 Phase 2 Features (Q1 2026)
- Community deals hub
- Meal planning calendar
- Budget analytics
- Nutrition tracking
- Family sharing

## Tech Stack

### Frontend
```javascript
{
  "framework": "React 18 / Next.js 14",
  "state": "Redux Toolkit / Zustand",
  "ui": "Material-UI / Tailwind CSS",
  "pwa": "Workbox",
  "offline": "IndexedDB + Service Workers",
  "testing": "Jest + React Testing Library"
}
```

### Backend
```javascript
{
  "runtime": "Node.js 18",
  "framework": "Express.js",
  "database": "PostgreSQL 15",
  "cache": "Redis 7",
  "queue": "RabbitMQ / Bull",
  "ocr": "AWS Textract / Tesseract",
  "ml": "TensorFlow.js",
  "testing": "Jest + Supertest"
}
```

### Infrastructure
```yaml
containerization: Docker
orchestration: Kubernetes
ci_cd: GitHub Actions
monitoring: Prometheus + Grafana
logging: ELK Stack
cloud: AWS / GCP
cdn: CloudFlare
```

## API Reference

### 🔌 Base URL
```
Development: http://localhost:3001/api/v1
Staging: https://api.staging.shelfie.app/v1
Production: https://api.shelfie.app/v1
```

### 🔐 Authentication
```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/verify
```

### 📦 Pantry Management
```http
GET    /pantry/items          # List all items
POST   /pantry/items          # Add new item
GET    /pantry/items/:id      # Get item details
PUT    /pantry/items/:id      # Update item
DELETE /pantry/items/:id      # Delete item
GET    /pantry/categories     # List categories
GET    /pantry/expiring       # Items expiring soon
```

### 📸 Receipt Processing
```http
POST   /receipts/upload       # Upload receipt image
GET    /receipts/:jobId       # Check processing status
GET    /receipts              # List all receipts
DELETE /receipts/:id          # Delete receipt
```

### 🍳 Recipe Recommendations
```http
POST   /recipes/recommend     # Get recommendations
GET    /recipes/:id           # Get recipe details
POST   /recipes/favorite      # Save favorite
GET    /recipes/favorites     # List favorites
```

### 📝 Grocery Lists
```http
GET    /lists                 # Get all lists
POST   /lists                 # Create new list
PUT    /lists/:id             # Update list
DELETE /lists/:id             # Delete list
POST   /lists/:id/share       # Share list
```

### 📊 Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| GET endpoints | 100 req | 1 min |
| POST endpoints | 50 req | 1 min |
| Receipt upload | 10 req | 1 min |
| Recipe recommend | 20 req | 1 min |

## Development Guide

### 📁 Project Structure
```
Shelfie/
├── client/                 # React PWA frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── utils/        # Utilities
│   │   └── workers/      # Service workers
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utilities
│   │   └── workers/      # Background jobs
│   └── package.json
│
├── shared/               # Shared types/utils
├── docker/              # Docker configs
├── k8s/                 # Kubernetes manifests
├── scripts/             # Build/deploy scripts
├── docs/                # Documentation
├── .github/             # GitHub Actions
├── docker-compose.yml
└── README.md
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- --testPathPattern=auth

# E2E tests
npm run test:e2e

# Load testing
npm run test:load
```

### 📝 Code Style

```javascript
// ESLint + Prettier configuration
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
```

### 🔄 Git Workflow

```bash
# Feature development
git checkout -b feature/SHELFIE-123-feature-name
git add .
git commit -m "feat: add new feature"
git push origin feature/SHELFIE-123-feature-name

# Commit conventions
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: tests
chore: maintenance
```

## Deployment

### 🚀 Deployment Environments

| Environment | URL | Branch | Auto Deploy |
|------------|-----|--------|-------------|
| Development | dev.shelfie.app | develop | Yes |
| Staging | staging.shelfie.app | staging | Yes |
| Production | shelfie.app | main | Manual |

### 📦 Docker Deployment

```bash
# Build images
docker build -t shelfie/client:latest ./client
docker build -t shelfie/server:latest ./server

# Run with docker-compose
docker-compose up -d

# Deploy to Kubernetes
kubectl apply -f k8s/
```

### ⚙️ CI/CD Pipeline

```yaml
# GitHub Actions workflow
name: CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy.sh
```

## Contributing

### 🤝 How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/Tiienn/Shelfie.git
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make changes and test**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### 📋 PR Requirements
- [ ] Tests pass
- [ ] Code coverage maintained
- [ ] Documentation updated
- [ ] No linting errors
- [ ] PR description complete
- [ ] Linked to issue

### 🐛 Bug Reports

Please use the GitHub issue template:
```markdown
**Description**: Clear description of the bug
**Steps to Reproduce**: 1. Go to... 2. Click on...
**Expected**: What should happen
**Actual**: What actually happens
**Environment**: Browser, OS, version
**Screenshots**: If applicable
```

## 📚 Resources

### Documentation
- [Product Requirements](./docs/pantry-app-prd.md)
- [Technical Architecture](./docs/pantry-app-technical-architecture.md)
- [Task Management](./docs/pantry-task-manager.md)
- [API Documentation](http://localhost:3001/api/docs)
- [Storybook](http://localhost:6006)

### External Resources
- [React Documentation](https://react.dev)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com)

### Team Resources
- **Slack**: #shelfie-dev
- **Jira**: [shelfie.atlassian.net](https://shelfie.atlassian.net)
- **Wiki**: [Internal Wiki](https://wiki.shelfie.app)
- **Design**: [Figma Designs](https://figma.com/shelfie)

## 📊 Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial Load | <3s | TBD | 🟡 |
| API Response (p95) | <200ms | TBD | 🟡 |
| OCR Processing | <5s | TBD | 🟡 |
| Offline Sync | <2s | TBD | 🟡 |
| Lighthouse Score | >90 | TBD | 🟡 |
| Test Coverage | >80% | 0% | 🔴 |
| Uptime | 99.9% | N/A | ⚪ |

## 🔒 Security

### Security Features
- JWT authentication with refresh tokens
- End-to-end encryption for sensitive data
- OWASP Top 10 compliance
- Rate limiting & DDoS protection
- Input validation & sanitization
- Regular security audits
- GDPR/CCPA compliant

### Security Checklist
- [ ] HTTPS everywhere
- [ ] Secure headers (HSTS, CSP)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] API authentication
- [ ] Data encryption at rest
- [ ] Secure file uploads

## 🆘 Support & Troubleshooting

### Common Issues

**🔧 OCR not working**
```bash
# Check AWS credentials
aws configure list

# Test Textract access
npm run test:ocr

# Check logs
docker logs shelfie-ocr-service
```

**🔄 Sync issues**
```bash
# Check WebSocket connection
npm run test:websocket

# Clear local cache
npm run cache:clear

# Force sync
npm run sync:force
```

**📱 PWA not installing**
```bash
# Check manifest
curl http://localhost:3000/manifest.json

# Verify service worker
Chrome DevTools > Application > Service Workers

# Check HTTPS (required for production)
```

### Getting Help
- 📧 Email: support@shelfie.app
- 💬 Slack: #shelfie-support
- 📖 Docs: [docs.shelfie.app](https://docs.shelfie.app)
- 🐛 Issues: [GitHub Issues](https://github.com/Tiienn/Shelfie/issues)

## 📜 License

Copyright © 2025 Shelfie Team. All rights reserved.

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit permission from the Shelfie team.

---

## 📞 Team Contacts

| Role | Name | Contact | GitHub |
|------|------|---------|--------|
| Tech Lead | TBD | tech@shelfie.app | @techlead |
| Backend Lead | TBD | backend@shelfie.app | @backend |
| Frontend Lead | TBD | frontend@shelfie.app | @frontend |
| DevOps | TBD | devops@shelfie.app | @devops |
| QA Lead | TBD | qa@shelfie.app | @qa |
| Product Owner | TBD | po@shelfie.app | @po |

---

**Repository**: [https://github.com/Tiienn/Shelfie](https://github.com/Tiienn/Shelfie)  
**Last Updated**: September 2025  
**Version**: 1.0.0  
**Status**: Active Development

*Built with ❤️ for busy parents everywhere*