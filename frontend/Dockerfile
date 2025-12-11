# Frontend Dockerfile - Standalone
FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 3000

# Development command with host binding
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
