import swaggerJsDoc from 'swagger-jsdoc';
import { env } from './env';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Proyecto de Grado API',
      version: '1.0.0',
      description: 'API documentation for university degree project'
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/**/*.controller.ts', './src/**/*.entity.ts']
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);