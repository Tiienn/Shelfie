# 🥘 Shelfie - Smart Pantry Management

> Comprehensive pantry and grocery management app designed to help busy families efficiently manage household food inventory through intelligent automation and smart features.

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Docker and Docker Compose
- Git

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Tiienn/Shelfie.git
cd Shelfie

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development services
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed demo data (optional)
npm run db:seed

# Start development servers
npm run dev
```

### Access Points

- **Landing Page**: http://localhost:3000 (public marketing)
- **App Dashboard**: http://localhost:3000/app (authenticated)
- **Login/Register**: http://localhost:3000/auth/login
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **RabbitMQ Management**: http://localhost:15672
- **MinIO Console**: http://localhost:9001

## 📁 Project Structure

```
Shelfie/
├── client/                 # React PWA frontend
├── server/                 # Node.js backend services
├── shared/                 # Shared types and utilities
├── docker/                 # Docker configurations
├── k8s/                   # Kubernetes manifests
├── scripts/               # Build and deployment scripts
├── docs/                  # Additional documentation
├── .github/               # GitHub Actions workflows
└── docker-compose.yml     # Development environment
```

## 🎯 Core Features

### ✅ Implemented (Sprint 1)
- **🏠 Marketing Landing Page**: Professional conversion-optimized homepage
  - Hero section with value proposition ("Save 2+ hours weekly")
  - Features showcase (OCR, AI recipes, offline-first, family sharing)
  - Social proof with testimonials (1000+ families)
  - SEO optimization and PWA install prompts
- **🎨 Design System Foundation**: Complete component library with Tailwind CSS
- **🔄 Smart Routing**: Public/auth/app route separation
- **📱 PWA Ready**: Service worker registration and offline capabilities

### ✅ Phase 1 - MVP (In Progress)
- **Smart Pantry Management**: Track items, quantities, and expiration dates
- **Receipt Scanning**: OCR-powered automatic inventory updates
- **AI Recipe Suggestions**: Recommendations based on available ingredients
- **Grocery Lists**: Auto-generated from low stock items
- **Real-time Sync**: Multi-device synchronization

### 🚀 Phase 2 (Planned)
- Community deals hub
- Meal planning calendar
- Budget analytics
- Nutrition tracking
- Family sharing features

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Next.js 14
- **State Management**: Zustand with persistence
- **UI Library**: Tailwind CSS with custom components
- **PWA**: Service Workers with Workbox
- **Offline Storage**: IndexedDB with Dexie

### Backend
- **Runtime**: Node.js 18 with Express.js
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis 7 for sessions and query caching
- **Queue**: RabbitMQ for background job processing
- **File Storage**: AWS S3 (MinIO for development)

### AI/ML Services
- **OCR**: AWS Textract / Google Vision API
- **Recipe AI**: Claude API integration
- **ML Framework**: TensorFlow.js for client-side inference

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with Helm charts
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Cloud**: AWS / GCP

## 📊 Development Status

- **Overall Progress**: 15% complete
- **Current Sprint**: Sprint 1/6 (Foundation & Authentication)
- **Target Launch**: December 4, 2025
- **Team Size**: 14 members (8 devs, 2 designers, 2 QA, 1 PM, 1 DevOps)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:client
npm run test:server

# Run E2E tests
cd client && npm run test:e2e

# Run load tests
cd server && npm run test:load
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Start only client
npm run dev:server       # Start only server

# Building
npm run build           # Build all packages
npm run build:client    # Build client only
npm run build:server    # Build server only

# Code Quality
npm run lint            # Lint all code
npm run lint:fix        # Fix linting issues
npm run typecheck       # TypeScript type checking

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with demo data
npm run db:reset        # Reset database

# Docker
npm run docker:up       # Start development services
npm run docker:down     # Stop development services
npm run docker:logs     # View service logs
```

## 📚 Documentation

- [Product Requirements Document](./PRD.md)
- [Technical Architecture](./TECHNICAL-ARCHITECTURE.md)
- [Task Management](./TASKMANAGER.md)
- [Development Guide](./docs/development-guide.md)
- [API Documentation](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes and add tests**
4. **Commit your changes**: `git commit -m "feat: add amazing feature"`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow conventional commits for commit messages
- Ensure all tests pass before submitting PR
- Maintain test coverage above 80%
- Update documentation for new features
- Use TypeScript for type safety

## 🔒 Security

- End-to-end encryption for sensitive data
- OWASP Top 10 compliance
- Regular security audits
- GDPR/CCPA compliant data handling
- Secure authentication with JWT

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Initial Load | <3s | TBD |
| API Response (p95) | <200ms | TBD |
| OCR Processing | <5s | TBD |
| Offline Sync | <2s | TBD |
| Lighthouse Score | >90 | TBD |
| Test Coverage | >80% | 0% |

## 🆘 Support

- **Documentation**: [docs.shelfie.app](https://docs.shelfie.app)
- **Issues**: [GitHub Issues](https://github.com/Tiienn/Shelfie/issues)
- **Email**: support@shelfie.app

## 📜 License

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited without explicit permission from the Shelfie team.

## 🙏 Acknowledgments

- Built with ❤️ for busy parents everywhere
- Special thanks to our beta testers and community contributors

---

**Repository**: [https://github.com/Tiienn/Shelfie](https://github.com/Tiienn/Shelfie)  
**Last Updated**: September 2025  
**Version**: 1.0.0  
**Status**: Active Development