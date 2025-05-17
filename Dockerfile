# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy TypeORM config (required for migrations)
COPY --from=builder /app/dist/config/typeorm.config.js ./dist/config/typeorm.config.js

# Create a non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Set the proper ownership for the app directory
USER appuser

# Expose the application port
EXPOSE 4000

# Health check to help Coolify monitor the application status
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q -O - http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]