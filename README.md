# Proyecto de Grado - Backend

This is the backend API for the university degree project.

## Features

- Express.js with TypeScript
- PostgreSQL database with TypeORM
- Docker and docker-compose setup
- Swagger API documentation
- Environment variables configuration

## Requirements

- Node.js v18 or higher
- Docker and docker-compose
- npm or yarn

## Installation & Setup

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd proyecto-de-grado-be
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Start the containers:
   ```bash
   docker-compose up -d
   ```

The API will be available at http://localhost:4000 and the Swagger documentation at http://localhost:4000/api-docs.

### Local Development (without Docker)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd proyecto-de-grado-be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example and update the database connection settings:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm run migration:run`: Run migrations
- `npm run migration:generate -- -n MigrationName`: Generate migrations based on entity changes
- `npm run migration:create -- -n MigrationName`: Create a new empty migration
- `npm run migration:revert`: Revert the latest migration

### Docker Commands
- `npm run docker:dev`: Start development environment with Docker
- `npm run docker:dev:build`: Build and start development environment
- `npm run docker:dev:recreate`: Force recreation of containers and start development environment
- `npm run docker:down`: Stop all containers
- `npm run docker:down:volumes`: Stop all containers and remove volumes (will delete database data)
- `npm run docker:logs`: View logs from all containers
- `npm run docker:ps`: List running containers
- `npm run docker:api:bash`: Open a shell in the API container

## Project Structure

- `src/`
  - `config/`: Configuration files (environment, database)
  - `controllers/`: Request handlers
  - `entities/`: TypeORM entities
  - `middlewares/`: Express middlewares
  - `routes/`: API routes
  - `services/`: Business logic
  - `app.ts`: Express application setup
  - `server.ts`: Server entry point