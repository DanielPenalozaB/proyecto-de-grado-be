# Coolify Backend Deployment Guide

## PostgreSQL Database Setup

When deploying to Coolify, you'll need to:

1. Create a PostgreSQL database service in Coolify
2. Note the connection details (host, port, username, password, database name)
3. Set these as environment variables for your API service

## API Service Configuration

### Required Environment Variables

Set these in the Coolify UI:

```
NODE_ENV=production
PORT=4000
DB_HOST=<coolify-postgres-host>
DB_PORT=<coolify-postgres-port>
DB_USERNAME=<coolify-postgres-username>
DB_PASSWORD=<coolify-postgres-password>
DB_DATABASE=<coolify-postgres-database>
```

### Deployment Steps

1. Connect your Git repository to Coolify
2. Use the provided Dockerfile for the build
3. Configure the environment variables
4. Set the exposed port to 4000
5. Deploy the service

### Post-Deployment

After the initial deployment:

1. Run database migrations:
   ```
   coolify execute --service="your-api-service-name" --command="npm run migration:run"
   ```

2. Seed the database if needed:
   ```
   coolify execute --service="your-api-service-name" --command="npm run seed"
   ```

## Health Check Configuration

Configure a health check in Coolify pointing to the `/health` endpoint:

- Path: `/health`
- Interval: 30s
- Timeout: 5s
- Retries: 3
- Start period: 60s

## Troubleshooting

Common issues:
- Database connection failures: Check your DB_HOST and credentials
- TypeORM synchronization issues: Ensure your migrations have run
- Memory issues: Adjust container resources in Coolify UI
