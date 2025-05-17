import 'reflect-metadata';
import { AppDataSource } from './config/typeorm.config';
import app from './app';
import { env } from './config/env';

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection has been established successfully.');

    app.listen(env.port, '0.0.0.0', () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Server is listening on all interfaces (0.0.0.0:${env.port})`);
      console.log(`API documentation available at http://localhost:${env.port}/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });