import 'reflect-metadata';
import { AppDataSource } from './config/database';
import app from './app';
import { env } from './config/env';

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection has been established successfully.');

    // Start Express server
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`API documentation available at http://localhost:${env.port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });