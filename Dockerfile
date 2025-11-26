# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install yarn if not available
RUN apk add --no-cache yarn

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy source code (including Prisma if exists)
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install netcat for health checks and yarn
RUN apk add --no-cache netcat-openbsd yarn

# Install dependencies (including devDependencies for migrations and seeds)
COPY package*.json ./
COPY yarn.lock* ./
RUN yarn install --frozen-lockfile --production=false && yarn cache clean

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ormconfig.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/src ./src

# Copy entrypoint script
COPY docker-entrypoint.sh ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership and set permissions
RUN chown -R nestjs:nodejs /app && \
    chmod +x docker-entrypoint.sh

USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]

