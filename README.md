# Electronics Store - E-Commerce Platform

A modern, full-stack e-commerce platform for electronics built with React, Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

- **Modern Dark UI** - Sleek, dynamic interface with glassmorphism and glow effects
- **Full Authentication** - JWT-based auth with refresh tokens
- **Product Management** - Categories, brands, search, filters
- **Shopping Cart** - Guest and authenticated cart support
- **Order Management** - Complete order lifecycle
- **Reviews & Ratings** - Product reviews with helpful votes
- **Admin Dashboard** - Product, order, and user management
- **Stripe Integration** - Secure payment processing
- **Docker Ready** - Full containerization support

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS with custom dark theme
- Redux Toolkit + React Query
- Framer Motion animations
- Vite build tool

### Backend  
- Node.js with Express
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- Stripe payments

### DevOps
- Docker & Docker Compose
- Nginx reverse proxy
- Multi-stage builds

## 📦 Quick Start

### Using Docker (Recommended)

1. **Clone and setup environment**
```bash
cd electronics-store
cp .env.docker .env
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

4. **Seed the database**
```bash
docker-compose exec backend pnpm seed
```

### Local Development

1. **Install dependencies**
```bash
pnpm install
```

2. **Setup environment variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Start MongoDB and Redis**
```bash
docker-compose up mongodb redis -d
```

4. **Run development servers**
```bash
pnpm dev
```

## 🐳 Docker Commands

```bash
# Development
docker-compose up -d                    # Start all services
docker-compose down                     # Stop all services
docker-compose logs -f backend          # View backend logs
docker-compose exec backend sh          # Shell into backend

# Production
docker-compose -f docker-compose.prod.yml up -d

# Build images
docker-compose build --no-cache
```

## 📁 Project Structure

```
electronics-store/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper utilities
│   │   └── validators/     # Request validators
│   └── Dockerfile
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   ├── nginx.conf
│   └── Dockerfile
├── shared/                 # Shared types
├── docker/                 # Docker init scripts
├── docker-compose.yml      # Dev compose
└── docker-compose.prod.yml # Prod compose
```

## 🔐 Default Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@electronics-store.com | Admin@123 |
| Manager | manager@electronics-store.com | Manager@123 |

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login user |
| GET | /api/v1/products | List products |
| GET | /api/v1/products/:slug | Get product |
| GET | /api/v1/categories | List categories |
| GET | /api/v1/cart | Get cart |
| POST | /api/v1/orders | Create order |

## 🎨 UI Theme

The UI features a modern dark theme with:
- **Background**: Deep black (#0a0a0f)
- **Primary Accent**: Orange/Coral (#f97316)
- **Secondary**: Purple (#a855f7)
- **Glassmorphism effects**
- **Glow animations**
- **Smooth transitions**

## 📄 License

MIT License
