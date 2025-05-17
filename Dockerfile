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

# Copy migrations folder for database setup
COPY --from=builder /app/src/database/migrations ./dist/database/migrations

# CRITICAL: Ensure the server explicitly listens on 0.0.0.0 to be accessible from outside
# Create a startup script
RUN echo '#!/bin/sh\n\
# Wait for postgres\n\
echo "Waiting for PostgreSQL..."\n\
sleep 5\n\
\n\
# Run migrations\n\
echo "Running database migrations..."\n\
npm run migration:run || echo "Migration failed but continuing..."\n\
\n\
# Start the application - ensure it listens on all interfaces\n\
echo "Starting application..."\n\
exec node dist/server.js\n\
' > /app/startup.sh && chmod +x /app/startup.sh

# Expose the application port
EXPOSE 4000

# Start the application using the startup script
CMD ["/app/startup.sh"]