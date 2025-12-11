.PHONY: help install dev build start test lint clean docker-up docker-down seed

# Default target
help:
	@echo "Electronics Store - Available Commands"
	@echo "======================================="
	@echo ""
	@echo "Development:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start development servers"
	@echo "  make build      - Build all packages"
	@echo "  make start      - Start production servers"
	@echo "  make test       - Run all tests"
	@echo "  make lint       - Run linting"
	@echo "  make clean      - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up  - Start Docker containers (dev)"
	@echo "  make docker-down- Stop Docker containers"
	@echo "  make docker-prod- Start production containers"
	@echo ""
	@echo "Database:"
	@echo "  make seed       - Seed the database"
	@echo "  make migrate    - Run database migrations"

# Install dependencies
install:
	pnpm install

# Start development servers
dev:
	pnpm run dev

# Build all packages
build:
	pnpm run build

# Start production servers
start:
	pnpm run start

# Run all tests
test:
	pnpm run test

# Run linting
lint:
	pnpm run lint

# Type checking
type-check:
	pnpm run type-check

# Clean build artifacts
clean:
	pnpm run clean

# Start Docker containers (development)
docker-up:
	docker-compose -f docker-compose.dev.yml up -d

# Stop Docker containers
docker-down:
	docker-compose -f docker-compose.dev.yml down

# Start production Docker containers
docker-prod:
	docker-compose -f docker-compose.yml up -d --build

# Seed the database
seed:
	pnpm --filter backend seed

# Run database migrations
migrate:
	pnpm --filter backend prisma migrate dev

# Generate Prisma client
prisma-generate:
	pnpm --filter backend prisma generate

# Format code
format:
	pnpm run format

# Full setup for new developers
setup: install docker-up prisma-generate seed
	@echo "Setup complete! Run 'make dev' to start development."
