# Electronics Store - Operations Runbook

## Table of Contents
- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Docker Operations](#docker-operations)
- [Database Management](#database-management)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## Prerequisites

### Required Software
| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ | Runtime |
| pnpm | 8+ | Package manager |
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Orchestration |

### Installation
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installations
node --version
pnpm --version
docker --version
docker-compose --version
```

---

## Development Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd electronics-store
pnpm install
```

### 2. Environment Configuration
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your values
```

### 3. Start Development Servers

#### Option A: Local Development (Requires MongoDB & Redis)
```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

#### Option B: Using Docker (Recommended)
```bash
cp .env.docker .env
docker-compose up -d
```

### 4. Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Docs | http://localhost:5000/api-docs |
| MongoDB | mongodb://localhost:27017 |
| Redis | redis://localhost:6379 |

---

## Docker Operations

### Starting Services
```bash
# Start all services (detached)
docker-compose up -d

# Start with build
docker-compose up --build -d

# Start specific service
docker-compose up -d backend
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuilding
```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

### Shell Access
```bash
# Backend container
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh -u admin -p adminpassword

# Redis CLI
docker-compose exec redis redis-cli -a redispassword
```

---

## Database Management

### Seeding Data
```bash
# With Docker
docker-compose exec backend pnpm seed

# Local development
cd backend
pnpm seed
```

### Database Backup
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump \
  -u admin -p adminpassword \
  --authenticationDatabase admin \
  --out /data/backup

# Copy backup to host
docker cp electrostore-mongodb:/data/backup ./backup
```

### Database Restore
```bash
# Copy backup to container
docker cp ./backup electrostore-mongodb:/data/backup

# Restore
docker-compose exec mongodb mongorestore \
  -u admin -p adminpassword \
  --authenticationDatabase admin \
  /data/backup
```

### Reset Database
```bash
# Drop and reseed
docker-compose exec backend pnpm db:reset
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

#### 2. Docker Context Canceled Error
```bash
# Clean Docker cache
docker system prune -a

# Increase Docker memory (Docker Desktop Settings > Resources)
# Recommended: 4GB+ RAM

# Ensure .dockerignore is present
```

#### 3. MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 4. Redis Connection Failed
```bash
# Check Redis status
docker-compose exec redis redis-cli -a redispassword ping
# Should return "PONG"

# Restart Redis
docker-compose restart redis
```

#### 5. Node Modules Issues
```bash
# Clear and reinstall
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
pnpm install
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health (nginx)
curl http://localhost:3000/health

# Check all container health
docker-compose ps
```

---

## Production Deployment

### Build Production Images
```bash
docker-compose -f docker-compose.prod.yml build
```

### Deploy to Production
```bash
# Set production environment variables
export MONGO_ROOT_PASSWORD=<secure-password>
export REDIS_PASSWORD=<secure-password>
export JWT_SECRET=<64-char-secret>
export JWT_REFRESH_SECRET=<64-char-secret>

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### SSL/TLS Setup
For production, configure nginx with SSL certificates:
1. Obtain certificates (Let's Encrypt recommended)
2. Mount certificates in frontend container
3. Update nginx.conf for HTTPS

### Environment Variables (Production)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_ROOT_USERNAME` | MongoDB admin user | Yes |
| `MONGO_ROOT_PASSWORD` | MongoDB admin password | Yes |
| `REDIS_PASSWORD` | Redis password | Yes |
| `JWT_SECRET` | JWT signing key (64+ chars) | Yes |
| `JWT_REFRESH_SECRET` | Refresh token key (64+ chars) | Yes |
| `STRIPE_SECRET_KEY` | Stripe API key | Yes |
| `CLOUDINARY_*` | Image upload config | Optional |
| `SMTP_*` | Email configuration | Optional |

---

## Useful Commands Reference

```bash
# Quick status check
docker-compose ps

# View resource usage
docker stats

# Clean up unused Docker resources
docker system prune -a --volumes

# Run backend tests
docker-compose exec backend pnpm test

# Generate Prisma client
docker-compose exec backend pnpm prisma generate

# View API routes
curl http://localhost:5000/api/v1
```

---

## Support

For issues not covered here:
1. Check container logs: `docker-compose logs -f <service>`
2. Verify environment variables are set correctly
3. Ensure all prerequisites are installed
4. Check GitHub issues for known problems
