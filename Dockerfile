# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
RUN npm ci --only=production

# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client

EXPOSE 4000
CMD ["node", "dist/server.js"]